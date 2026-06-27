import { useEffect, useRef, useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import { getWhatsAppLink } from "@/lib/siteContent";

const phones = ["0913 706 1340", "0705 219 3488", "0817 457 8070"];
const phoneTel = ["09137061340", "07052193488", "08174578070"];

export function Contact() {
  const [sent, setSent] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const message = [
      "Hello Jonak Construction, I would like a quote from your website.",
      "",
      `Name: ${String(data.get("name") ?? "")}`,
      `Company: ${String(data.get("company") ?? "")}`,
      `Email: ${String(data.get("email") ?? "")}`,
      `Phone: ${String(data.get("phone") ?? "")}`,
      `Project type: ${String(data.get("type") ?? "")}`,
      `Project details: ${String(data.get("details") ?? "")}`,
    ].join("\n");

    window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    form.reset();
    setSent(true);
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-radial-glow opacity-60" />
      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Contact</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              Let's build your next project.
            </h2>
            <p className="mt-5 max-w-md text-white/70 md:text-lg">
              Reach our team directly - by phone, WhatsApp, email, or the form. We respond to every
              inquiry within 24 hours and can continue the conversation on WhatsApp.
            </p>

            <div className="mt-10 space-y-5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-gradient text-gold-foreground"><Phone className="h-5 w-5" /></div>
                  <div className="text-xs uppercase tracking-widest text-white/50">Phone</div>
                </div>
                <div className="mt-4 grid gap-2">
                  {phones.map((p, i) => (
                    <a key={p} href={`tel:${phoneTel[i]}`} className="block font-display text-lg font-semibold transition-colors hover:text-gold">
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/2347052193488"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-[#25D366]/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#25D366] text-white"><MessageCircle className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">WhatsApp</div>
                  <div className="font-display text-lg font-semibold">0705 219 3488</div>
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
                  <div className="text-xs uppercase tracking-widest text-white/50">Head Office</div>
                  <div className="font-display text-base font-semibold">KM 36 Lekki-Epe Expressway,<br />Ibeju-Lekki, Lagos, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Jonak Construction — KM 36 Lekki-Epe Expressway"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.85%2C6.40%2C4.05%2C6.55&amp;layer=mapnik&amp;marker=6.475,3.95"
                className="h-56 w-full grayscale"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={handleSubmit}
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
                  name="details"
                  className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold"
                  placeholder="Briefly describe scope, location, and timeline…"
                />
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] sm:w-auto"
              >
                {sent ? "WhatsApp opened" : "Request via WhatsApp"} <MessageCircle className="h-4 w-4" />
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
