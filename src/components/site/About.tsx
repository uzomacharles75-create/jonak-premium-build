import { ShieldCheck, Award, HardHat, MapPin, Phone, FileCheck } from "lucide-react";
import about from "@/assets/projects/p10.jpeg.asset.json";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-elegant">
                <img src={about.url} alt="Completed residential project by Jonak Construction" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden rounded-2xl bg-surface p-6 text-white shadow-elegant md:block md:-right-8 md:p-8">
                <div className="font-display text-4xl font-bold text-gold">15+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/60">Years of Excellence</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">About Jonak Construction</div>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance md:text-4xl lg:text-5xl">
                A construction partner Lagos trusts to deliver.
              </h2>
              <p className="mt-6 text-base text-muted-foreground md:text-lg">
                Jonak Construction Limited is a Lagos-based construction company delivering quality
                workmanship across residential, commercial, and structural projects. With over a
                decade of hands-on experience, we combine engineering discipline with a relentless
                focus on client satisfaction — building work that lasts and relationships that endure.
              </p>

              <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-6 text-sm shadow-card-soft">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-4 w-4 text-gold" />
                  <span><span className="text-muted-foreground">RC Number:</span> <span className="font-semibold">807655</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                  <span><span className="text-muted-foreground">Address:</span> <span className="font-semibold">KM 36 Lekki-Epe Expressway, Ibeju-Lekki, Lagos, Nigeria</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <span className="font-semibold">0913 706 1340 · 0705 219 3488 · 0817 457 8070</span>
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {[
                  { Icon: ShieldCheck, t: "Reliability", d: "On-time delivery and transparent reporting." },
                  { Icon: Award, t: "Quality Built", d: "Engineered to spec, finished with craft." },
                  { Icon: HardHat, t: "Skilled Teams", d: "Experienced engineers and tradesmen." },
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
