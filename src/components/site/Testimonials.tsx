import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    q: "Jonak delivered our family home ahead of schedule with finishing that exceeded our expectations. Professional from day one.",
    n: "Adebayo O.",
    r: "Homeowner, Lekki",
  },
  {
    q: "Transparent costing, disciplined site management, and superb workmanship. They are now our default contractor for new builds.",
    n: "Hauwa I.",
    r: "Director, Meridian Properties",
  },
  {
    q: "The team handled our renovation with care and skill — the result completely transformed the property. Highly recommended.",
    n: "Chuka E.",
    r: "Investor, Ibeju-Lekki",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Client Testimonials</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Trusted by clients across Lagos.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.n} delay={i * 100}>
              <figure className="relative h-full rounded-2xl border border-border bg-card p-8 shadow-card-soft hover-lift">
                <Quote className="h-8 w-8 text-gold" />
                <blockquote className="mt-5 text-base leading-relaxed text-foreground">"{t.q}"</blockquote>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <div className="font-display font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
