import { Phone, MessageCircle } from "lucide-react";
import hero from "@/assets/projects/p6.jpeg.asset.json";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-surface text-white">
      <img
        src={hero.url}
        alt="Premium security gate fabricated and installed by Jonak Construction Limited"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-overlay-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface/85 via-surface/50 to-surface/10" />
      <div className="absolute inset-0 bg-radial-glow opacity-60" />

      <div className="container-px relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end pb-20 pt-32 md:justify-center md:pb-0">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Jonak Construction Limited · RC 807655
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Building Excellence
            <br />
            With <span className="text-shimmer">Precision</span> & Integrity
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
            A trusted Lagos-based construction company delivering residential, commercial, and
            structural projects with uncompromising craftsmanship and reliability.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="tel:09137061340"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a
              href="https://wa.me/2347052193488"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>

          <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { v: "15+", l: "Years Experience" },
              { v: "120+", l: "Projects Delivered" },
              { v: "100%", l: "Client Commitment" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-bold text-gold md:text-3xl">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-white/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="h-10 w-6 rounded-full border border-white/30 p-1">
          <div className="mx-auto h-2 w-px animate-bounce bg-white/60" />
        </div>
      </div>
    </section>
  );
}
