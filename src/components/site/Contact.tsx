import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { useState } from "react";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-radial-glow opacity-60" />
      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Contact</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              Let's build your next landmark.
            </h2>
            <p className="mt-5 max-w-md text-white/70 md:text-lg">
              Tell us about your project. Our team responds to every inquiry
              within 24 hours.
            </p>

            <div className="mt-10 space-y-5">
              <a href="tel:08174578070" className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-gold/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-gradient text-gold-foreground"><Phone className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">Phone</div>
                  <div className="font-display text-lg font-semibold">0817 457 8070</div>
                </div>
              </a>
              <a href="mailto:info@jonakconstruction.com" className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-gold/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-gradient text-gold-foreground"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">Email</div>
                  <div className="font-display text-lg font-semibold">info@jonakconstruction.com</div>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-gradient text-gold-foreground"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">Headquarters</div>
                  <div className="font-display text-lg font-semibold">Lagos, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="JONAK Office Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.30%2C6.43%2C3.50%2C6.55&amp;layer=mapnik"
                className="h-56 w-full grayscale"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-10"
            >
              <h3 className="font-display text-2xl font-bold">Request a Quote</h3>
              <p className="mt-2 text-sm text-white/60">All fields required.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" />
                <Field label="Company" name="company" />
                <Field label="Email" name="email" type="email" />
                <Field label="Phone" name="phone" type="tel" />
              </div>
              <div className="mt-4">
                <Field label="Project type" name="type" />
              </div>
              <div className="mt-4">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/60">Project details</label>
                <textarea
                  rows={4}
                  required
                  className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold"
                  placeholder="Briefly describe scope, location, and timeline…"
                />
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] sm:w-auto"
              >
                {sent ? "Thank you — we'll be in touch" : "Send Inquiry"} <Send className="h-4 w-4" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/60">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
