import { Phone, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import { getQuoteLink } from "@/lib/siteContent";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-surface px-6 py-14 text-white shadow-elegant md:px-16 md:py-20">
            <div className="absolute inset-0 bg-radial-glow opacity-50" />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Let's Build</div>
                <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                  Ready to start your construction project?
                </h2>
                <p className="mt-5 max-w-xl text-white/70 md:text-lg">
                  Speak with our team today for a transparent quote, professional advice, and a
                  delivery plan tailored to your vision and budget.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <a
                  href="tel:09137061340"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href={getQuoteLink("my construction project")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4" /> Request a Quote
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
