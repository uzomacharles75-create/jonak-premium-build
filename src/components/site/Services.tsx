import { Building2, Hammer, Route, Truck, Briefcase, ClipboardList, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const services = [
  { Icon: Building2, t: "General Construction", d: "End-to-end building delivery for commercial and residential developments." },
  { Icon: Hammer, t: "Civil Engineering", d: "Structural, geotechnical, and civil works engineered to exacting standards." },
  { Icon: Route, t: "Road Construction", d: "Highways, access roads, and pavement systems built to last decades." },
  { Icon: Briefcase, t: "Procurement", d: "Strategic sourcing of materials, equipment, and specialist services." },
  { Icon: Truck, t: "Haulage & Logistics", d: "Heavy haulage and on-site logistics with a full owned fleet." },
  { Icon: ClipboardList, t: "Project Management", d: "Disciplined planning and delivery from feasibility to handover." },
];

export function Services() {
  return (
    <section id="services" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">What We Do</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Full-spectrum construction & engineering services.
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg">
            From breaking ground to ribbon cutting, we operate as a single integrated
            partner — engineered for scale, governed for trust.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card-soft hover-lift">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-gold/10 transition-all duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold">{t}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d}</p>
                  <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
