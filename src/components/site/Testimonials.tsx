import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    q: "JONAK delivered our corporate headquarters ahead of schedule and within budget. Their engineering discipline is second to none.",
    n: "Adebayo O.",
    r: "Director, Meridian Holdings",
  },
  {
    q: "From procurement to final handover, the team operated with precision. A true infrastructure partner we trust on every contract.",
    n: "Hauwa I.",
    r: "PM, Federal Roads Authority",
  },
  {
    q: "Their fleet and logistics capabilities allowed us to scale the project across three sites simultaneously. Outstanding execution.",
    n: "Chuka E.",
    r: "CEO, Northstar Industries",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Client Testimonials</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Trusted by serious clients.
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
