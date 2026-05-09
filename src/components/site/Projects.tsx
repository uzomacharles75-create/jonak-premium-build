import { ArrowUpRight } from "lucide-react";
import commercial from "@/assets/project-commercial.jpg";
import road from "@/assets/project-road.jpg";
import residential from "@/assets/project-residential.jpg";
import industrial from "@/assets/project-industrial.jpg";
import bridge from "@/assets/project-bridge.jpg";
import { Reveal } from "./Reveal";

const projects = [
  { img: commercial, cat: "Commercial", t: "Skyline Corporate Tower", d: "32-storey mixed-use development", span: "lg:col-span-2 lg:row-span-2" },
  { img: road, cat: "Infrastructure", t: "Regional Highway Expansion", d: "48km dual carriageway upgrade", span: "" },
  { img: residential, cat: "Residential", t: "Crescent Estates", d: "Premium gated community, 84 units", span: "" },
  { img: bridge, cat: "Civil Engineering", t: "River Crossing Bridge", d: "Twin-span concrete viaduct", span: "lg:col-span-2" },
  { img: industrial, cat: "Industrial", t: "Logistics Mega-Hub", d: "120,000 m² distribution facility", span: "" },
];

export function Projects() {
  return (
    <section id="projects" className="relative bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Featured Projects</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              A portfolio engineered for impact.
            </h2>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold">
            Discuss your project <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="mt-12 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.t} delay={i * 80} className={p.span}>
              <a
                href="#contact"
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-surface shadow-card-soft"
              >
                <img
                  src={p.img}
                  alt={p.t}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">{p.cat}</div>
                  <h3 className="mt-2 font-display text-xl font-bold md:text-2xl">{p.t}</h3>
                  <p className="mt-1 text-xs text-white/70">{p.d}</p>
                  <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all group-hover:bg-gold group-hover:text-gold-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
