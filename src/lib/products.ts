import { getWhatsAppLink, projectGallery } from "@/lib/siteContent";

export type ProductAvailability = "available" | "limited" | "made_to_order" | "out_of_stock";
export type ProductMediaKind = "image" | "video";

export type ProductMedia = {
  id: string;
  kind: ProductMediaKind;
  filename?: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  url: string;
  isCover: boolean;
  order: number;
};

export type MediaAsset = {
  id: string;
  kind: ProductMediaKind;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  availability: ProductAvailability;
  availabilityLabel: string;
  published: boolean;
  featured: boolean;
  media: ProductMedia[];
  coverImageUrl: string | null;
  videoUrl: string | null;
  imageCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  price: string;
  availability: ProductAvailability;
  published: boolean;
  featured: boolean;
  media: ProductMedia[];
  coverMediaId: string | null;
};

export type ProductUpsertPayload = {
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  availability: ProductAvailability;
  published: boolean;
  featured: boolean;
  mediaIds: string[];
  coverMediaId: string | null;
};

export const availabilityOptions: Array<{ value: ProductAvailability; label: string }> = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited stock" },
  { value: "made_to_order", label: "Made to order" },
  { value: "out_of_stock", label: "Out of stock" },
];

export const availabilityColors: Record<ProductAvailability, string> = {
  available: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
  limited: "bg-amber-500/15 text-amber-700 border-amber-500/20",
  made_to_order: "bg-blue-500/15 text-blue-700 border-blue-500/20",
  out_of_stock: "bg-rose-500/15 text-rose-700 border-rose-500/20",
};

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatProductAvailability(value: ProductAvailability | string) {
  const option = availabilityOptions.find((item) => item.value === value);
  return option?.label ?? value;
}

export function getProductEnquiryLink(product: Pick<Product, "name">) {
  return getWhatsAppLink(
    `Hello Jonak Construction,\n\nI would like to enquire about ${product.name}.\nPlease send me the next steps.`,
  );
}

export function buildFallbackProducts(): Product[] {
  const priceByCategory: Record<string, number> = {
    Gates: 4800000,
    Doors: 1850000,
    Staircases: 3200000,
    "Civil Works": 14500000,
    Buildings: 4200000,
  };

  const availabilityByIndex: ProductAvailability[] = [
    "available",
    "limited",
    "available",
    "made_to_order",
    "available",
    "limited",
    "available",
    "available",
    "available",
    "limited",
    "available",
  ];

  return projectGallery.map((item, index) => {
    const price = priceByCategory[item.cat] ?? 2500000;
    const availability = availabilityByIndex[index] ?? "available";

    return {
      id: `fallback-${index}`,
      slug: `fallback-${index}`,
      name: item.title,
      description: item.description,
      fullDescription: item.description,
      category: item.cat,
      price,
      availability,
      availabilityLabel: formatProductAvailability(availability),
      published: true,
      featured: index === 0,
      media: [
        {
          id: `fallback-${index}-image`,
          kind: "image",
          url: item.url,
          isCover: true,
          order: 0,
        },
      ],
      coverImageUrl: item.url,
      videoUrl: null,
      imageCount: 1,
    };
  });
}

export function getCoverMedia(product: Product) {
  return (
    product.media.find((item) => item.kind === "image" && item.isCover) ??
    product.media.find((item) => item.kind === "image") ??
    null
  );
}
