import { useMemo, useState } from "react";
import { ArrowUpRight, Loader2, MessageCircle, ZoomIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { ProductModal } from "./ProductModal";
import {
  buildFallbackProducts,
  formatProductAvailability,
  getProductEnquiryLink,
  type Product,
} from "@/lib/products";
import { availabilityColors } from "@/lib/products";
import { fetchPublicProducts } from "@/lib/api";

type Cat = "All" | string;

const fallbackProducts = buildFallbackProducts();

export function Projects() {
  const [active, setActive] = useState<Cat>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: fetchPublicProducts,
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.products.length ? data.products : fallbackProducts;
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((product) => product.category === active)),
    [active, products],
  );

  return (
    <section id="projects" className="relative bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Recent Projects
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              Built with precision. Delivered with pride.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              A selection of recent works delivered by Jonak Construction Limited — residential
              builds, structural steelwork, security gates, doors, and bespoke staircases.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold"
          >
            Discuss your project <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading && !data ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-card-soft">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            Loading product catalogue...
          </div>
        ) : null}

        <div className="mt-8 grid auto-rows-[300px] gap-4 sm:grid-cols-2 lg:grid-cols-3 md:auto-rows-[320px]">
          {filtered.map((product, i) => {
            const coverImage =
              product.coverImageUrl ??
              product.media.find((item) => item.kind === "image")?.url ??
              "";

            return (
              <Reveal key={product.id} delay={i * 60}>
                <article className="group relative h-full overflow-hidden rounded-2xl bg-surface shadow-card-soft">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="absolute inset-0 z-10 h-full w-full text-left"
                    aria-label={`Open details for ${product.name}`}
                  >
                    <img
                      src={coverImage}
                      alt={product.description}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-95" />
                  </button>

                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                        {product.category}
                      </div>
                      <div
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          availabilityColors[product.availability]
                        }`}
                      >
                        {formatProductAvailability(product.availability)}
                      </div>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold md:text-xl">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/70">{product.description}</p>

                    <div className="mt-5 flex items-center justify-end gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-gold hover:text-gold"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                        Details
                      </button>
                      <a
                        href={getProductEnquiryLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Enquire
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProduct(null);
            }
          }}
        />
      )}
    </section>
  );
}
