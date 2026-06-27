import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getProductEnquiryLink, type Product } from "@/lib/products";
import { formatProductAvailability, getCoverMedia } from "@/lib/products";

type ProductModalProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
  const media = useMemo(() => {
    if (!product) {
      return [];
    }

    return [...product.media].sort((a, b) => a.order - b.order);
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open || !product) {
      return;
    }

    const cover = getCoverMedia(product);
    const index = cover ? media.findIndex((item) => item.id === cover.id) : 0;
    setActiveIndex(index >= 0 ? index : 0);
  }, [media, open, product]);

  const activeMedia = media[activeIndex] ?? null;
  const enquiryLink = product ? getProductEnquiryLink(product) : "#";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden border-white/10 bg-surface p-0 text-white sm:rounded-3xl">
        <div className="grid max-h-[92vh] gap-0 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative min-h-[40vh] bg-black">
            {activeMedia?.kind === "video" ? (
              <video
                src={activeMedia.url}
                className="h-full w-full max-h-[92vh] object-cover"
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={activeMedia?.url ?? product?.coverImageUrl ?? ""}
                alt={product?.description ?? product?.name ?? "Product image"}
                className="h-full w-full max-h-[92vh] object-cover"
              />
            )}

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge className="border-white/15 bg-white/10 text-white">{product?.category}</Badge>
              <Badge className="border-white/15 bg-gold/90 text-gold-foreground">
                {formatProductAvailability(product?.availability ?? "available")}
              </Badge>
            </div>

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((current) => (current - 1 + media.length) % media.length)
                  }
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current + 1) % media.length)}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="max-w-3xl">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                    {product?.category}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold">{product?.name}</h3>
                  <div className="mt-2 text-sm text-white/70">{product?.description}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex max-h-[92vh] flex-col border-l border-white/10 bg-surface/95">
            <DialogHeader className="border-b border-white/10 px-6 py-5 text-left">
              <DialogTitle className="text-left font-display text-xl font-bold text-white">
                Product Details
              </DialogTitle>
              <DialogDescription className="text-left text-white/60">
                Gallery, optional video, description, and enquiry details.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {product && (
                <div className="space-y-6">
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                        Availability
                      </div>
                      <div className="mt-2 font-display text-xl font-semibold">
                        {formatProductAvailability(product.availability)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                      Full Description
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      {product.fullDescription}
                    </p>
                  </div>

                  {media.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
                        Gallery
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {media.map((item, index) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setActiveIndex(index)}
                            className={`group relative overflow-hidden rounded-2xl border transition-all ${
                              index === activeIndex
                                ? "border-gold ring-2 ring-gold/30"
                                : "border-white/10 hover:border-white/25"
                            }`}
                          >
                            {item.kind === "video" ? (
                              <div className="flex aspect-[4/3] items-center justify-center bg-black/60 text-white">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                                  </span>
                                  <span className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                                    Video
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={item.url}
                                alt={item.originalName ?? product.name}
                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      asChild
                      className="flex-1 bg-gold-gradient text-gold-foreground shadow-gold hover:opacity-95"
                    >
                      <a href={enquiryLink} target="_blank" rel="noopener noreferrer">
                        Enquire on WhatsApp
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      onClick={() => onOpenChange(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
