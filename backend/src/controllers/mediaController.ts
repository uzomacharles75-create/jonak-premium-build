import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { z } from "zod";
import type { Request, Response } from "express";

import { backendOrigin, allowedImageMimeTypes, allowedVideoMimeTypes } from "../config/env";
import { getMediaBucket, toObjectId } from "../config/gridfs";
import { MediaAssetModel } from "../models/MediaAsset";
import { ProductModel } from "../models/Product";
import type { AuthenticatedRequest } from "../middleware/auth";
import { HttpError } from "../utils/http-error";
import { safeFileName } from "../utils/format";
import { serializeMediaAsset } from "../utils/serializers";

const mediaIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid media id"),
});

function detectMediaKind(mimeType: string) {
  if (allowedVideoMimeTypes.has(mimeType)) {
    return "video" as const;
  }

  if (allowedImageMimeTypes.has(mimeType)) {
    return "image" as const;
  }

  throw new HttpError(400, "Unsupported file type");
}

function buildStoredFilename(originalName: string) {
  const extension = path.extname(originalName).toLowerCase();
  const baseName = safeFileName(path.basename(originalName, extension)) || "media";
  return `${Date.now()}-${baseName}${extension}`;
}

async function cleanupOrphanedMediaAssetIds(mediaAssetIds: string[]) {
  const uniqueIds = [...new Set(mediaAssetIds)];
  for (const mediaAssetId of uniqueIds) {
    const stillUsed = await ProductModel.exists({ "media.mediaId": mediaAssetId });
    if (stillUsed) {
      continue;
    }

    const asset = await MediaAssetModel.findById(mediaAssetId);
    if (!asset) {
      continue;
    }

    try {
      await getMediaBucket().delete(toObjectId(String(asset.fileId)));
    } catch {
      // If the GridFS file was already removed, keep cleaning up the document.
    }

    await asset.deleteOne();
  }
}

async function ensureProductsHaveImageCover(productIds: string[]) {
  const uniqueIds = [...new Set(productIds)];
  for (const productId of uniqueIds) {
    const product = await ProductModel.findById(productId).populate("media.mediaId");
    if (!product) {
      continue;
    }

    type ProductMediaEntry = {
      mediaId?: { kind?: string; _id?: unknown; id?: unknown } | string | null;
      isCover?: boolean;
      order?: number;
    };

    function isPopulatedMediaReference(
      value: ProductMediaEntry["mediaId"],
    ): value is { kind?: string; _id?: unknown; id?: unknown } {
      return typeof value === "object" && value !== null;
    }

    const mediaEntries = product.media as ProductMediaEntry[];
    const imageEntries = mediaEntries.filter(
      (entry) => isPopulatedMediaReference(entry.mediaId) && entry.mediaId.kind === "image",
    );
    if (imageEntries.length === 0) {
      continue;
    }

    const hasCover = imageEntries.some((entry) => entry.isCover);
    if (hasCover) {
      continue;
    }

    let firstImageMarked = false;
    product.media = mediaEntries.map((entry) => {
      const isImage = isPopulatedMediaReference(entry.mediaId) && entry.mediaId.kind === "image";
      if (!isImage) {
        return entry;
      }

      if (!firstImageMarked) {
        firstImageMarked = true;
        return { ...entry, isCover: true };
      }

      return entry;
    }) as typeof product.media;

    await product.save();
  }
}

export async function listMediaAssets(_req: Request, res: Response) {
  const assets = await MediaAssetModel.find().sort({ createdAt: -1 }).lean();
  res.json({
    media: assets.map(serializeMediaAsset),
  });
}

export async function uploadMediaAssets(req: AuthenticatedRequest, res: Response) {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) {
    throw new HttpError(400, "At least one file is required");
  }

  const videoFiles = files.filter((file) => file.mimetype === "video/mp4");
  if (videoFiles.length > 1) {
    throw new HttpError(400, "Only one MP4 video can be uploaded at a time");
  }

  const createdMedia: Array<ReturnType<typeof serializeMediaAsset>> = [];

  try {
    for (const file of files) {
      const kind = detectMediaKind(file.mimetype);
      const storedFilename = buildStoredFilename(file.originalname);
      const bucket = getMediaBucket();

      const uploadStream = bucket.openUploadStream(storedFilename, {
        metadata: {
          contentType: file.mimetype,
          originalName: file.originalname,
          kind,
        },
      });

      await pipeline(Readable.from(file.buffer), uploadStream);

      const mediaAsset = await MediaAssetModel.create({
        fileId: uploadStream.id,
        kind,
        filename: storedFilename,
        originalName: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        uploadedBy: req.authUser?.userId,
      });

      createdMedia.push(serializeMediaAsset(mediaAsset.toObject()));
    }

    res.status(201).json({ media: createdMedia });
  } catch (error) {
    if (createdMedia.length > 0) {
      const ids = createdMedia.map((item) => item.id);
      await cleanupOrphanedMediaAssetIds(ids);
    }
    throw error;
  }
}

export async function streamMediaAsset(req: Request, res: Response) {
  const parsed = mediaIdSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid media id");
  }

  const mediaAsset = await MediaAssetModel.findById(parsed.data.id).lean();
  if (!mediaAsset) {
    throw new HttpError(404, "Media asset not found");
  }

  res.setHeader("Content-Type", mediaAsset.contentType);
  res.setHeader("Content-Disposition", `inline; filename="${mediaAsset.originalName}"`);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  const bucket = getMediaBucket();
  const downloadStream = bucket.openDownloadStream(toObjectId(String(mediaAsset.fileId)));
  downloadStream.on("error", (error) => {
    if (!res.headersSent) {
      res.status(404).json({ message: "Media file unavailable" });
      return;
    }
    res.destroy(error as Error);
  });

  await pipeline(downloadStream, res);
}

export async function deleteMediaAsset(req: AuthenticatedRequest, res: Response) {
  const parsed = mediaIdSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid media id");
  }

  const mediaAsset = await MediaAssetModel.findById(parsed.data.id);
  if (!mediaAsset) {
    throw new HttpError(404, "Media asset not found");
  }

  const affectedProducts = await ProductModel.find({ "media.mediaId": mediaAsset._id }).select(
    "_id",
  );
  await ProductModel.updateMany(
    { "media.mediaId": mediaAsset._id },
    { $pull: { media: { mediaId: mediaAsset._id } } },
  );

  await ensureProductsHaveImageCover(affectedProducts.map((product) => String(product._id)));

  try {
    await getMediaBucket().delete(toObjectId(String(mediaAsset.fileId)));
  } catch {
    // The GridFS file may already be gone. Continue removing the metadata.
  }

  await mediaAsset.deleteOne();

  res.status(204).send();
}
