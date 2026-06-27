import { backendOrigin } from "../config/env";

const availabilityLabels: Record<string, string> = {
  available: "Available",
  limited: "Limited stock",
  made_to_order: "Made to order",
  out_of_stock: "Out of stock",
};

type MediaAssetLike = {
  _id?: unknown;
  id?: unknown;
  kind: string;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type ProductMediaEntryLike = {
  mediaId?: MediaAssetLike | { _id?: unknown; id?: unknown } | null;
  asset?: MediaAssetLike | { _id?: unknown; id?: unknown } | null;
  isCover?: boolean;
  order?: number;
};

type ProductLike = {
  _id?: unknown;
  id?: unknown;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  availability: string;
  published?: boolean;
  featured?: boolean;
  media?: Array<ProductMediaEntryLike | MediaAssetLike | null | undefined>;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export interface SerializedMediaAsset {
  id: string;
  kind: string;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SerializedProductMedia extends SerializedMediaAsset {
  isCover: boolean;
  order: number;
}

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  availability: string;
  availabilityLabel: string;
  published: boolean;
  featured: boolean;
  media: SerializedProductMedia[];
  coverImageUrl: string | null;
  videoUrl: string | null;
  imageCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function serializeMediaAsset(asset: MediaAssetLike): SerializedMediaAsset {
  const id = String(asset?._id ?? asset?.id);
  return {
    id,
    kind: asset.kind,
    filename: asset.filename,
    originalName: asset.originalName,
    contentType: asset.contentType,
    size: asset.size,
    url: `${backendOrigin}/api/media/${id}`,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}

export function serializeProduct(product: ProductLike): SerializedProduct {
  const mediaEntries = Array.isArray(product.media) ? product.media : [];
  const media = mediaEntries
    .map((entry, index): SerializedProductMedia | null => {
      const mediaEntry = entry as ProductMediaEntryLike;
      const asset = mediaEntry.mediaId ?? mediaEntry.asset ?? (entry as MediaAssetLike);
      if (!asset) {
        return null;
      }

      const serialized = serializeMediaAsset(asset as MediaAssetLike);
      return {
        ...serialized,
        isCover: Boolean(mediaEntry.isCover),
        order: mediaEntry.order ?? index,
      };
    })
    .filter((item): item is SerializedProductMedia => Boolean(item))
    .sort((a, b) => a.order - b.order);

  const imageMedia = media.filter((entry) => entry.kind === "image");
  const coverImage = imageMedia.find((entry) => entry.isCover) ?? imageMedia[0] ?? null;
  const videoMedia = media.find((entry) => entry.kind === "video") ?? null;

  return {
    id: String(product._id ?? product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    fullDescription: product.fullDescription,
    category: product.category,
    price: product.price,
    availability: product.availability,
    availabilityLabel: availabilityLabels[product.availability] ?? product.availability,
    published: Boolean(product.published),
    featured: Boolean(product.featured),
    media,
    coverImageUrl: coverImage?.url ?? null,
    videoUrl: videoMedia?.url ?? null,
    imageCount: imageMedia.length,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
