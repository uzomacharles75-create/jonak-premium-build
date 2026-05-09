import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { CheckCircle2 } from "lucide-react";

const stats = [
  { n: 15, s: "+", l: "Years of Experience" },
  { n: 120, s: "+", l: "Completed Projects" },
  { n: 350, s: "+", l: "Skilled Workforce" },
  { n: 98, s: "%", l: "Client Satisfaction" },
];

const reasons = [
  "Government-grade compliance and safety governance",
  "In-house fleet of haulage trucks and heavy equipment",
  "Certified civil, structural, and project engineers",
  "Transparent reporting and disciplined cost control",
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Why JONAK</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              The contractor major projects rely on.
            </h2>
            <p className="mt-5 max-w-md text-white/70 md:text-lg">
              We combine engineering rigor with operational discipline — the
              foundation for projects that finish on time, on budget, and built
              to last.
            </p>
            <ul className="mt-8 space-y-4">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {stats.map((s) => (
                <div key={s.l} className="bg-surface p-8 md:p-10">
                  <div className="font-display text-4xl font-bold text-gold md:text-5xl">
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
