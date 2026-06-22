import { Building2, Home, Hammer, Wrench, ClipboardList, Landmark, Layers, Briefcase, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const services = [
  { Icon: Building2, t: "Building Construction", d: "Full-cycle building delivery from foundation to finishing." },
  { Icon: Home, t: "Residential Projects", d: "Family homes, duplexes, and estates built to live in for generations." },
  { Icon: Landmark, t: "Commercial Projects", d: "Offices, retail, and mixed-use buildings finished to a high standard." },
  { Icon: Wrench, t: "Renovation & Remodelling", d: "Refurbishment, restructuring, and modernisation of existing properties." },
  { Icon: Hammer, t: "Civil Engineering Works", d: "Structural, drainage, and site civil works engineered with precision." },
  { Icon: ClipboardList, t: "Project Management", d: "End-to-end planning, costing, and supervision for stress-free delivery." },
  { Icon: Layers, t: "Structural Construction", d: "Reinforced concrete frames, slabs, and steelwork for durable structures." },
  { Icon: Briefcase, t: "Property Development", d: "Land acquisition, design, and turnkey development of investment assets." },
];

export function Services() {
  return (
    <section id="services" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">What We Do</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Construction services, engineered for trust.
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg">
            From your first sketch to handover, we operate as a single, disciplined partner —
            delivering quality construction across Lagos and beyond.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 60}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card-soft hover-lift">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-gold/10 transition-all duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold">{t}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d}</p>
                  <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Request a quote <ArrowUpRight className="h-3.5 w-3.5" />
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
