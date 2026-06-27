import { z } from "zod";
import type { Request, Response } from "express";

import { getMediaBucket, toObjectId } from "../config/gridfs";
import { MediaAssetModel } from "../models/MediaAsset";
import { ProductModel } from "../models/Product";
import type { AuthenticatedRequest } from "../middleware/auth";
import { HttpError } from "../utils/http-error";
import { formatSlugSource } from "../utils/format";
import { serializeProduct } from "../utils/serializers";

type ProductMediaReferenceId = {
  _id?: unknown;
  id?: unknown;
};

type ProductMediaEntry = {
  mediaId?: ProductMediaReferenceId | string | null;
  isCover?: boolean;
  order?: number;
};

type ProductWithMedia = {
  media?: ProductMediaEntry[];
};

export const productPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(500),
  fullDescription: z.string().trim().min(20).max(4000),
  category: z.string().trim().min(2).max(80),
  price: z.coerce.number().min(0),
  availability: z.enum(["available", "limited", "made_to_order", "out_of_stock"]),
  published: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  mediaIds: z.array(z.string().regex(/^[a-f\d]{24}$/i)).default([]),
  coverMediaId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .nullable()
    .optional(),
});

function dedupePreserveOrder(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

async function generateUniqueSlug(name: string, currentId?: string) {
  const baseSlug = formatSlugSource(name) || "product";
  let candidate = baseSlug;
  let counter = 2;

  while (
    await ProductModel.exists({
      slug: candidate,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function resolveMediaReferenceId(mediaId: unknown) {
  const reference = mediaId as ProductMediaReferenceId | undefined;
  return String(reference?._id ?? reference?.id ?? mediaId ?? "");
}

async function resolveMediaEntries(
  mediaIds: string[],
  coverMediaId?: string | null,
): Promise<{ mediaEntries: ProductMediaEntry[]; imageCount: number }> {
  const orderedIds = dedupePreserveOrder(mediaIds);
  if (orderedIds.length === 0) {
    return {
      mediaEntries: [],
      imageCount: 0,
    };
  }

  const mediaAssets = await MediaAssetModel.find({ _id: { $in: orderedIds } });
  const mediaById = new Map(mediaAssets.map((asset) => [String(asset._id), asset]));

  const missingIds = orderedIds.filter((id) => !mediaById.has(id));
  if (missingIds.length > 0) {
    throw new HttpError(400, `Media asset not found: ${missingIds[0]}`);
  }

  const coverAsset = coverMediaId ? mediaById.get(coverMediaId) : null;
  if (coverMediaId && !coverAsset) {
    throw new HttpError(400, "Cover image must be one of the uploaded images");
  }
  if (coverAsset && coverAsset.kind !== "image") {
    throw new HttpError(400, "Cover image must be an image");
  }

  const kinds = mediaAssets.map((asset) => asset.kind);
  const videoCount = kinds.filter((kind) => kind === "video").length;
  if (videoCount > 1) {
    throw new HttpError(400, "Only one video can be attached to a product");
  }

  const imageAssets = mediaAssets.filter((asset) => asset.kind === "image");
  const imageCount = imageAssets.length;
  const defaultCoverId =
    coverMediaId ?? orderedIds.find((id) => mediaById.get(id)?.kind === "image") ?? null;

  if (defaultCoverId && mediaById.get(defaultCoverId)?.kind !== "image") {
    throw new HttpError(400, "Cover media must be an image");
  }

  const mediaEntries = orderedIds.map((id, index) => {
    const asset = mediaById.get(id);
    if (!asset) {
      throw new HttpError(400, `Media asset not found: ${id}`);
    }

    return {
      mediaId: asset._id,
      isCover: defaultCoverId ? id === defaultCoverId : false,
      order: index,
    };
  });

  return { mediaEntries, imageCount };
}

async function cleanupOrphanedMedia(mediaIds: string[]) {
  const uniqueIds = dedupePreserveOrder(mediaIds);
  if (uniqueIds.length === 0) {
    return;
  }

  for (const mediaId of uniqueIds) {
    const stillReferenced = await ProductModel.exists({ "media.mediaId": mediaId });
    if (stillReferenced) {
      continue;
    }

    const asset = await MediaAssetModel.findById(mediaId);
    if (!asset) {
      continue;
    }

    try {
      await getMediaBucket().delete(toObjectId(String(asset.fileId)));
    } catch {
      // Ignore missing GridFS file records during cleanup.
    }

    await asset.deleteOne();
  }
}

function ensureProductMedia(product: ProductWithMedia) {
  if (!product.media) {
    product.media = [];
  }
}

export async function listPublicProducts(_req: Request, res: Response) {
  const products = await ProductModel.find({ published: true })
    .sort({ featured: -1, updatedAt: -1, createdAt: -1 })
    .populate("media.mediaId");

  res.json({
    products: products.map((product) => serializeProduct(product.toObject())),
  });
}

export async function getPublicProduct(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug, published: true }).populate(
    "media.mediaId",
  );
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  res.json({
    product: serializeProduct(product.toObject()),
  });
}

export async function listAdminProducts(_req: Request, res: Response) {
  const products = await ProductModel.find()
    .sort({ featured: -1, updatedAt: -1, createdAt: -1 })
    .populate("media.mediaId");

  res.json({
    products: products.map((product) => serializeProduct(product.toObject())),
  });
}

export async function getAdminProduct(req: Request, res: Response) {
  const product = await ProductModel.findById(req.params.id).populate("media.mediaId");
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  res.json({
    product: serializeProduct(product.toObject()),
  });
}

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  const payload = productPayloadSchema.parse(req.body);
  const { mediaEntries, imageCount } = await resolveMediaEntries(
    payload.mediaIds,
    payload.coverMediaId,
  );

  if (payload.published && imageCount === 0) {
    throw new HttpError(400, "Published products require at least one image");
  }

  const slug = await generateUniqueSlug(payload.name);
  const product = await ProductModel.create({
    name: payload.name,
    slug,
    description: payload.description,
    fullDescription: payload.fullDescription,
    category: payload.category,
    price: payload.price,
    availability: payload.availability,
    published: payload.published,
    featured: payload.featured,
    media: mediaEntries,
    createdBy: req.authUser?.userId,
    updatedBy: req.authUser?.userId,
  });

  const populatedProduct = await ProductModel.findById(product._id).populate("media.mediaId");
  res.status(201).json({
    product: serializeProduct(populatedProduct?.toObject() ?? product.toObject()),
  });
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  const payload = productPayloadSchema.parse(req.body);
  const product = await ProductModel.findById(req.params.id).populate("media.mediaId");
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  const previousMediaIds: string[] = (product.media ?? []).map((entry: ProductMediaEntry) =>
    resolveMediaReferenceId(entry.mediaId),
  );
  const { mediaEntries, imageCount } = await resolveMediaEntries(
    payload.mediaIds,
    payload.coverMediaId,
  );

  if (payload.published && imageCount === 0) {
    throw new HttpError(400, "Published products require at least one image");
  }

  const nextSlug = await generateUniqueSlug(payload.name, String(product._id));

  product.name = payload.name;
  product.slug = nextSlug;
  product.description = payload.description;
  product.fullDescription = payload.fullDescription;
  product.category = payload.category;
  product.price = payload.price;
  product.availability = payload.availability;
  product.published = payload.published;
  product.featured = payload.featured;
  product.media = mediaEntries;
  product.updatedBy = req.authUser?.userId;

  ensureProductMedia(product);
  await product.save();

  const nextMediaIds = dedupePreserveOrder(payload.mediaIds);
  const removedMediaIds = previousMediaIds.filter((id) => !nextMediaIds.includes(id));
  await cleanupOrphanedMedia(removedMediaIds);

  const populatedProduct = await ProductModel.findById(product._id).populate("media.mediaId");
  res.json({
    product: serializeProduct(populatedProduct?.toObject() ?? product.toObject()),
  });
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  const mediaIds: string[] = (product.media ?? []).map((entry: ProductMediaEntry) =>
    resolveMediaReferenceId(entry.mediaId),
  );
  await product.deleteOne();
  await cleanupOrphanedMedia(mediaIds);

  res.status(204).send();
}
