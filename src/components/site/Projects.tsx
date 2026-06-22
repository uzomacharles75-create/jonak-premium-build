import { useMemo, useState } from "react";
import { ArrowUpRight, ZoomIn } from "lucide-react";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";

import p1 from "@/assets/projects/p1.jpeg.asset.json";
import p2 from "@/assets/projects/p2.jpeg.asset.json";
import p3 from "@/assets/projects/p3.jpeg.asset.json";
import p4 from "@/assets/projects/p4.jpeg.asset.json";
import p5 from "@/assets/projects/p5.jpeg.asset.json";
import p6 from "@/assets/projects/p6.jpeg.asset.json";
import p7 from "@/assets/projects/p7.jpeg.asset.json";
import p8 from "@/assets/projects/p8.jpeg.asset.json";
import p9 from "@/assets/projects/p9.jpeg.asset.json";
import p10 from "@/assets/projects/p10.jpeg.asset.json";

type Cat = "All" | "Buildings" | "Gates" | "Doors" | "Staircases";

const projects: { url: string; title: string; cat: Exclude<Cat, "All">; span: string }[] = [
  { url: p6.url, title: "Premium Estate Security Gate", cat: "Gates", span: "lg:col-span-2 lg:row-span-2" },
  { url: p10.url, title: "Two-Storey Residential Build", cat: "Buildings", span: "lg:col-span-1" },
  { url: p4.url, title: "Spiral Staircase with Canopy", cat: "Staircases", span: "lg:col-span-1" },
  { url: p1.url, title: "Industrial Compound Gate", cat: "Gates", span: "lg:col-span-1" },
  { url: p8.url, title: "Hardwood Entrance Doors", cat: "Doors", span: "lg:col-span-2" },
  { url: p5.url, title: "Reinforced Security Door", cat: "Doors", span: "lg:col-span-1" },
  { url: p3.url, title: "Interior Spiral Staircase", cat: "Staircases", span: "lg:col-span-1" },
  { url: p7.url, title: "Custom Steel Gate Panel", cat: "Gates", span: "lg:col-span-1" },
  { url: p2.url, title: "Lion Crest Estate Gate", cat: "Gates", span: "lg:col-span-1" },
  { url: p9.url, title: "Heavy-Duty Entry Door", cat: "Doors", span: "lg:col-span-1" },
];

const cats: Cat[] = ["All", "Buildings", "Gates", "Doors", "Staircases"];

export function Projects() {
  const [active, setActive] = useState<Cat>("All");
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.cat === active)),
    [active]
  );

  return (
    <section id="projects" className="relative bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Recent Projects</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              Built with precision. Delivered with pride.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              A selection of recent works delivered by Jonak Construction Limited —
              residential builds, structural steelwork, security gates, doors, and bespoke staircases.
            </p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold">
            Discuss your project <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {cats.map((c) => (
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

        <div className="mt-8 grid auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-3 md:auto-rows-[280px]">
          {filtered.map((p, i) => (
            <Reveal key={p.url} delay={i * 60} className={active === "All" ? p.span : ""}>
              <button
                onClick={() => setLbIndex(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-surface shadow-card-soft text-left"
              >
                <img
                  src={p.url}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">{p.cat}</div>
                  <h3 className="mt-2 font-display text-lg font-bold md:text-xl">{p.title}</h3>
                  <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all group-hover:bg-gold group-hover:text-gold-foreground">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lbIndex !== null && (
        <Lightbox
          images={filtered.map((p) => ({ url: p.url, title: p.title, cat: p.cat }))}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
          onNext={() => setLbIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
        />
      )}
    </section>
  );
}
