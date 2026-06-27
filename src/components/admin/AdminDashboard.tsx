import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  FileImage,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import logo from "@/assets/jonak-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ApiError,
  deleteAdminMedia,
  deleteAdminProduct,
  fetchAdminMedia,
  fetchAdminProducts,
  fetchCurrentUser,
  logoutAdmin,
  saveAdminProduct,
  uploadAdminMedia,
} from "@/lib/api";
import {
  availabilityColors,
  availabilityOptions,
  formatNaira,
  formatProductAvailability,
  type MediaAsset,
  type Product,
  type ProductAvailability,
  type ProductFormValues,
  type ProductMedia,
  type ProductUpsertPayload,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type DraftMediaItem = Omit<ProductMedia, "id"> & {
  id?: string;
  clientId: string;
  file?: File;
  source: "existing" | "new";
};

type DraftState = Omit<ProductFormValues, "media" | "coverMediaId"> & {
  id?: string;
  media: DraftMediaItem[];
};

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_MEDIA: MediaAsset[] = [];

function createClientId() {
  return (
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function revokeMediaUrls(items: DraftMediaItem[]) {
  items.forEach((item) => {
    if (item.file && item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    }
  });
}

function normalizeMedia(items: DraftMediaItem[]) {
  const ordered = items.map((item, index) => ({ ...item, order: index }));
  const imageItems = ordered.filter((item) => item.kind === "image");

  if (imageItems.length === 0) {
    return ordered.map((item) => ({ ...item, isCover: false }));
  }

  const hasCover = imageItems.some((item) => item.isCover);
  if (hasCover) {
    let foundCover = false;
    return ordered.map((item) => {
      if (item.kind !== "image") return item;
      if (item.isCover && !foundCover) {
        foundCover = true;
        return item;
      }
      return { ...item, isCover: false };
    });
  }

  let assignedCover = false;
  return ordered.map((item) => {
    if (item.kind !== "image") return item;
    if (!assignedCover) {
      assignedCover = true;
      return { ...item, isCover: true };
    }
    return { ...item, isCover: false };
  });
}

function blankDraft(category = "Gates"): DraftState {
  return {
    name: "",
    description: "",
    fullDescription: "",
    category,
    price: "",
    availability: "available",
    published: false,
    featured: false,
    media: [],
  };
}

function draftFromProduct(product: Product): DraftState {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    fullDescription: product.fullDescription,
    category: product.category,
    price: String(product.price),
    availability: product.availability,
    published: product.published,
    featured: product.featured,
    media: product.media
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        clientId: item.id,
        source: "existing" as const,
      })),
  };
}

function draftToPayload(draft: DraftState, mediaIds: string[]): ProductUpsertPayload {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    fullDescription: draft.fullDescription.trim(),
    category: draft.category.trim(),
    price: Number(draft.price),
    availability: draft.availability,
    published: draft.published,
    featured: draft.featured,
    mediaIds,
    coverMediaId: draft.media.find((item) => item.isCover)?.id ?? null,
  };
}

function mapUploadedMedia(
  draft: DraftState,
  uploaded: MediaAsset[],
  pendingUploads: DraftMediaItem[],
) {
  const uploadedByClientId = new Map(
    pendingUploads.map((item, index) => [
      item.clientId,
      {
        ...uploaded[index],
        clientId: item.clientId,
        isCover: item.isCover,
        order: item.order,
        source: "existing" as const,
      },
    ]),
  );

  return draft.media.map((item) => {
    if (!item.file) return item;
    const replacement = uploadedByClientId.get(item.clientId);
    if (!replacement) return item;
    return {
      ...replacement,
      file: undefined,
    } as DraftMediaItem;
  });
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isBrowser = typeof window !== "undefined";
  const [draft, setDraft] = useState<DraftState>(blankDraft());
  const [selectedProductId, setSelectedProductId] = useState<string | "new" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | "neutral">("neutral");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    return () => revokeMediaUrls(draftRef.current.media);
  }, []);

  const currentUserQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await fetchCurrentUser()).user,
    staleTime: 60 * 1000,
    retry: false,
    enabled: typeof window !== "undefined",
  });

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await fetchAdminProducts()).products,
    retry: false,
    enabled: typeof window !== "undefined",
  });

  const mediaQuery = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => (await fetchAdminMedia()).media,
    retry: false,
    enabled: typeof window !== "undefined",
  });

  const products = productsQuery.data ?? EMPTY_PRODUCTS;
  const mediaAssets = mediaQuery.data ?? EMPTY_MEDIA;
  const publishedCount = products.filter((product) => product.published).length;

  useEffect(() => {
    if (currentUserQuery.error instanceof ApiError && currentUserQuery.error.status === 401) {
      void navigate({ to: "/admin" });
    }
  }, [currentUserQuery.error, navigate]);

  useEffect(() => {
    if (productsQuery.isLoading || !productsQuery.data) return;

    if (selectedProductId === null) {
      const firstProduct = productsQuery.data[0];
      if (firstProduct) {
        setSelectedProductId(firstProduct.id);
        setDraft(draftFromProduct(firstProduct));
      } else {
        setSelectedProductId("new");
        setDraft(blankDraft());
      }
      return;
    }

    if (selectedProductId === "new") {
      return;
    }

    const selectedProduct = productsQuery.data.find((product) => product.id === selectedProductId);
    if (selectedProduct) {
      setDraft(draftFromProduct(selectedProduct));
    }
  }, [productsQuery.data, productsQuery.isLoading, selectedProductId]);

  const handleNewProduct = () => {
    revokeMediaUrls(draftRef.current.media);
    setSelectedProductId("new");
    setDraft(blankDraft(products[0]?.category ?? "Gates"));
    setStatusMessage(null);
  };

  const handleSelectProduct = (product: Product) => {
    revokeMediaUrls(draftRef.current.media);
    setSelectedProductId(product.id);
    setDraft(draftFromProduct(product));
    setStatusMessage(null);
  };

  const addImages = (files: FileList | null) => {
    if (!files?.length) return;

    const additions: DraftMediaItem[] = Array.from(files).map((file) => ({
      clientId: createClientId(),
      kind: "image",
      url: URL.createObjectURL(file),
      originalName: file.name,
      isCover: false,
      order: 0,
      source: "new",
      file,
    }));

    setDraft((current) => ({
      ...current,
      media: normalizeMedia([...current.media, ...additions]),
    }));
  };

  const addVideo = (file: File | null) => {
    if (!file) return;

    const addition: DraftMediaItem = {
      clientId: createClientId(),
      kind: "video",
      url: URL.createObjectURL(file),
      originalName: file.name,
      isCover: false,
      order: 0,
      source: "new",
      file,
    };

    setDraft((current) => {
      revokeMediaUrls(current.media.filter((item) => item.kind === "video"));
      return {
        ...current,
        media: normalizeMedia([...current.media.filter((item) => item.kind !== "video"), addition]),
      };
    });
  };

  const removeMediaItem = (clientId: string) => {
    setDraft((current) => {
      const item = current.media.find((entry) => entry.clientId === clientId);
      if (item) {
        revokeMediaUrls([item]);
      }

      return {
        ...current,
        media: normalizeMedia(current.media.filter((entry) => entry.clientId !== clientId)),
      };
    });
  };

  const setCoverMedia = (clientId: string) => {
    setDraft((current) => ({
      ...current,
      media: normalizeMedia(
        current.media.map((item) => ({
          ...item,
          isCover: item.kind === "image" ? item.clientId === clientId : false,
        })),
      ),
    }));
  };

  const handleFieldChange = <K extends keyof DraftState>(field: K, value: DraftState[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const submitDraft = async () => {
    setStatusMessage(null);
    setIsSaving(true);

    const pendingUploads = draftRef.current.media.filter((item) => item.file);
    let uploadedMedia: MediaAsset[] = [];

    try {
      if (pendingUploads.length > 0) {
        const result = await uploadAdminMedia(pendingUploads.map((item) => item.file!));
        uploadedMedia = result.media;
      }

      const nextMedia =
        pendingUploads.length > 0
          ? mapUploadedMedia(draftRef.current, uploadedMedia, pendingUploads)
          : draftRef.current.media;
      const payload = draftToPayload(
        {
          ...draftRef.current,
          media: nextMedia,
        },
        nextMedia.map((item) => item.id).filter((id): id is string => Boolean(id)),
      );

      const saved = await saveAdminProduct(payload, draftRef.current.id);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      setSelectedProductId(saved.product.id);
      setDraft(draftFromProduct(saved.product));
      setStatusTone("success");
      setStatusMessage("Product saved successfully.");
    } catch (error) {
      if (uploadedMedia.length > 0) {
        await Promise.allSettled(uploadedMedia.map((asset) => deleteAdminMedia(asset.id)));
        await queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      }
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async () => {
    if (!draft.id) return;
    const confirmed = window.confirm(`Delete "${draft.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeletingProduct(true);
    setStatusMessage(null);

    try {
      await deleteAdminProduct(draft.id);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      const nextProduct = productsQuery.data?.find((product) => product.id !== draft.id) ?? null;
      if (nextProduct) {
        setSelectedProductId(nextProduct.id);
        setDraft(draftFromProduct(nextProduct));
      } else {
        setSelectedProductId("new");
        setDraft(blankDraft());
      }
      setStatusTone("success");
      setStatusMessage("Product deleted.");
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to delete product.");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    await queryClient.removeQueries({ queryKey: ["current-user"] });
    await navigate({ to: "/admin" });
  };

  const selectedProduct =
    selectedProductId && selectedProductId !== "new"
      ? (products.find((product) => product.id === selectedProductId) ?? null)
      : null;

  if (
    !isBrowser ||
    currentUserQuery.isLoading ||
    productsQuery.isLoading ||
    mediaQuery.isLoading ||
    (currentUserQuery.error instanceof ApiError && currentUserQuery.error.status === 401)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-white">
        <div className="flex items-center gap-3 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
          Loading admin workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/15">
              <img
                src={logo}
                alt="Jonak Construction Limited"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-display text-sm font-bold uppercase tracking-[0.22em] text-white">
                Admin
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/55">
                Private dashboard
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium text-white">
                {currentUserQuery.data?.name ?? "Admin"}
              </div>
              <div className="text-xs text-white/50">{currentUserQuery.data?.email}</div>
            </div>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container-px mx-auto max-w-7xl py-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70 shadow-card-soft">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Products
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-card-soft">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Published
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-card-soft">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Media Assets
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{mediaAssets.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="grid h-auto w-full max-w-sm grid-cols-2 bg-muted p-1">
            <TabsTrigger value="products" className="rounded-md px-4 py-2">
              Products
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-md px-4 py-2">
              Media Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <Card className="border-border/70 shadow-card-soft">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="font-display text-xl">Catalogue</CardTitle>
                      <CardDescription>Pick a product to edit or create a new one.</CardDescription>
                    </div>
                    <Button
                      onClick={handleNewProduct}
                      className="bg-gold-gradient text-gold-foreground shadow-gold"
                    >
                      <Plus className="h-4 w-4" />
                      New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                      No products yet. Create the first one to populate the public catalogue.
                    </div>
                  ) : (
                    products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className={cn(
                          "flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                          selectedProduct?.id === product.id
                            ? "border-gold bg-gold/10"
                            : "border-border bg-background hover:border-primary/30 hover:bg-accent/40",
                        )}
                      >
                        <div>
                          <div className="font-semibold text-foreground">{product.name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            {product.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={cn("border", availabilityColors[product.availability])}>
                            {formatProductAvailability(product.availability)}
                          </Badge>
                          <div className="mt-2 text-sm font-semibold">
                            {formatNaira(product.price)}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/70 shadow-card-soft">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="font-display text-2xl">
                        {draft.id ? "Edit Product" : "New Product"}
                      </CardTitle>
                      <CardDescription>
                        Manage the catalogue copy, visibility, media, and pricing.
                      </CardDescription>
                    </div>
                    {draft.id ? (
                      <Button
                        variant="outline"
                        className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 hover:text-rose-800"
                        onClick={removeProduct}
                        disabled={isDeletingProduct}
                      >
                        {isDeletingProduct ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => setDraft(blankDraft(products[0]?.category ?? "Gates"))}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Reset
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {statusMessage && (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm",
                        statusTone === "success"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                          : statusTone === "error"
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
                            : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {statusMessage}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name">
                      <Input
                        value={draft.name}
                        onChange={(event) => handleFieldChange("name", event.target.value)}
                        placeholder="Product name"
                      />
                    </Field>
                    <Field label="Category">
                      <Input
                        value={draft.category}
                        onChange={(event) => handleFieldChange("category", event.target.value)}
                        placeholder="Gates, Doors, Civil Works..."
                      />
                    </Field>
                    <Field label="Price (NGN)">
                      <Input
                        type="number"
                        min="0"
                        value={draft.price}
                        onChange={(event) => handleFieldChange("price", event.target.value)}
                        placeholder="2500000"
                      />
                    </Field>
                    <Field label="Availability">
                      <Select
                        value={draft.availability}
                        onValueChange={(value) =>
                          handleFieldChange("availability", value as ProductAvailability)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose availability" />
                        </SelectTrigger>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Short description">
                    <Textarea
                      rows={3}
                      value={draft.description}
                      onChange={(event) => handleFieldChange("description", event.target.value)}
                      placeholder="Short card description"
                    />
                  </Field>

                  <Field label="Full description">
                    <Textarea
                      rows={5}
                      value={draft.fullDescription}
                      onChange={(event) => handleFieldChange("fullDescription", event.target.value)}
                      placeholder="Detailed description for the modal"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ToggleField
                      label="Published"
                      description="Visible on the public website."
                      checked={draft.published}
                      onCheckedChange={(checked) => handleFieldChange("published", checked)}
                    />
                    <ToggleField
                      label="Featured"
                      description="Highlights this product near the top."
                      checked={draft.featured}
                      onCheckedChange={(checked) => handleFieldChange("featured", checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Media</div>
                        <div className="text-xs text-muted-foreground">
                          Upload images and one optional MP4 video. Preview items before saving.
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary">
                          <Upload className="h-4 w-4" />
                          Images
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple
                            className="hidden"
                            onChange={(event) => {
                              addImages(event.target.files);
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary">
                          <Video className="h-4 w-4" />
                          Video
                          <input
                            type="file"
                            accept="video/mp4"
                            className="hidden"
                            onChange={(event) => {
                              addVideo(event.target.files?.[0] ?? null);
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {draft.media.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                          No media selected yet.
                        </div>
                      ) : (
                        draft.media.map((item) => (
                          <div
                            key={item.clientId}
                            className="overflow-hidden rounded-2xl border border-border bg-background"
                          >
                            <div className="relative aspect-[4/3] bg-muted">
                              {item.kind === "video" ? (
                                <video
                                  src={item.url}
                                  controls
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img
                                  src={item.url}
                                  alt={item.originalName}
                                  className="h-full w-full object-cover"
                                />
                              )}

                              <div className="absolute left-2 top-2 flex gap-2">
                                <Badge className="border-white/15 bg-surface/80 text-white">
                                  {item.kind === "video" ? "Video" : "Image"}
                                </Badge>
                                {item.kind === "image" && item.isCover && (
                                  <Badge className="bg-gold text-gold-foreground">Cover</Badge>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3 p-3">
                              <div className="text-xs text-muted-foreground">
                                {item.originalName}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.kind === "image" && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-border bg-muted text-foreground"
                                    onClick={() => setCoverMedia(item.clientId)}
                                  >
                                    Set cover
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 hover:text-rose-800"
                                  onClick={() => removeMediaItem(item.clientId)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      {draft.media.length} media item{draft.media.length === 1 ? "" : "s"} selected
                      {draft.media.some((item) => item.file) ? " · includes new uploads" : ""}
                    </div>
                    <Button
                      type="button"
                      className="bg-gold-gradient text-gold-foreground shadow-gold"
                      onClick={submitDraft}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card className="border-border/70 shadow-card-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Media Library</CardTitle>
                <CardDescription>
                  View and delete uploaded images or videos. Removing media also updates any
                  products using it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {mediaAssets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                      No media assets uploaded yet.
                    </div>
                  ) : (
                    mediaAssets.map((asset) => (
                      <MediaCard
                        key={asset.id}
                        asset={asset}
                        onDelete={async () => {
                          const confirmed = window.confirm(`Delete ${asset.originalName}?`);
                          if (!confirmed) return;
                          await deleteAdminMedia(asset.id);
                          await queryClient.invalidateQueries({ queryKey: ["admin-media"] });
                          await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
                        }}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-4">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function MediaCard({ asset, onDelete }: { asset: MediaAsset; onDelete: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Card className="overflow-hidden border-border/70 shadow-card-soft">
      <div className="aspect-[4/3] bg-muted">
        {asset.kind === "video" ? (
          <video src={asset.url} controls className="h-full w-full object-cover" />
        ) : (
          <img src={asset.url} alt={asset.originalName} className="h-full w-full object-cover" />
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge className="border border-border bg-background text-foreground">{asset.kind}</Badge>
          <span className="text-xs text-muted-foreground">{formatBytes(asset.size)}</span>
        </div>
        <div className="text-sm font-medium">{asset.originalName}</div>
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 hover:text-rose-800"
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDelete();
              } finally {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border bg-muted text-foreground"
            asChild
          >
            <a href={asset.url} target="_blank" rel="noopener noreferrer">
              <FileImage className="h-4 w-4" />
              View
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
