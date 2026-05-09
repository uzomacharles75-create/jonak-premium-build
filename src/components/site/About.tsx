import { ShieldCheck, Award, HardHat } from "lucide-react";
import about from "@/assets/about-engineers.jpg";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-elegant">
                <img src={about} alt="Engineers reviewing blueprints" loading="lazy" width={1280} height={1280} className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden rounded-2xl bg-surface p-6 text-white shadow-elegant md:block md:-right-8 md:p-8">
                <div className="font-display text-4xl font-bold text-gold">15+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/60">Years of Excellence</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">About JONAK</div>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance md:text-4xl lg:text-5xl">
                Engineering trusted infrastructure for the next generation.
              </h2>
              <p className="mt-6 text-base text-muted-foreground md:text-lg">
                JONAK Construction Limited delivers world-class construction, civil
                engineering, and infrastructure services. We combine decades of
                technical expertise with uncompromising safety standards to build
                projects that endure.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {[
                  { Icon: ShieldCheck, t: "Safety First", d: "ISO-aligned safety protocols on every site." },
                  { Icon: Award, t: "Quality Built", d: "Engineered to spec, delivered on schedule." },
                  { Icon: HardHat, t: "Skilled Teams", d: "Certified engineers and seasoned crews." },
                ].map(({ Icon, t, d }) => (
                  <div key={t} className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 font-display text-sm font-bold">{t}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
