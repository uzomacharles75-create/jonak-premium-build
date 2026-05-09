import equipment from "@/assets/equipment-fleet.jpg";
import { Reveal } from "./Reveal";

const items = [
  { n: "40+", l: "Heavy Machines" },
  { n: "60+", l: "Haulage Trucks" },
  { n: "24/7", l: "Operations" },
  { n: "12", l: "Active Sites" },
];

export function Equipment() {
  return (
    <section id="equipment" className="relative isolate overflow-hidden bg-background py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Equipment & Operations</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Operationally capable. Built for scale.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-3xl shadow-elegant">
            <img src={equipment} alt="JONAK fleet of heavy equipment and haulage trucks" loading="lazy" className="h-[420px] w-full object-cover md:h-[560px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
              <div className="grid grid-cols-2 gap-6 text-white md:grid-cols-4 md:gap-10">
                {items.map((i) => (
                  <div key={i.l} className="border-l border-white/20 pl-4 md:pl-6">
                    <div className="font-display text-3xl font-bold text-gold md:text-5xl">{i.n}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-widest text-white/70 md:text-xs">{i.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
