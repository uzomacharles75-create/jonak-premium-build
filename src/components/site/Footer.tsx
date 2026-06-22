import logo from "@/assets/jonak-logo.jpeg";
import { Facebook, Instagram, Linkedin, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface text-white">
      <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg ring-1 ring-white/20">
                <img src={logo} alt="Jonak Construction Limited" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-display text-base font-bold">JONAK</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Construction Limited</div>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm text-white/60">
              A trusted Lagos-based construction company building excellence with precision and integrity.
            </p>
            <div className="mt-4 text-xs text-white/50">RC 807655</div>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-gold hover:text-gold">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href="https://wa.me/2347052193488"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Quick Links</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {[
                { l: "About", h: "#about" },
                { l: "Services", h: "#services" },
                { l: "Video", h: "#video" },
                { l: "Projects", h: "#projects" },
                { l: "Contact", h: "#contact" },
              ].map((x) => (
                <li key={x.h}><a href={x.h} className="transition-colors hover:text-gold">{x.l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Services</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {["Building Construction","Residential Projects","Commercial Projects","Renovation","Civil Engineering","Project Management"].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Get in Touch</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>0913 706 1340<br />0705 219 3488<br />0817 457 8070</span>
              </li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> info@jonakconstruction.com</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>KM 36 Lekki-Epe Expressway,<br />Ibeju-Lekki, Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <div>© {new Date().getFullYear()} Jonak Construction Limited · RC 807655. All rights reserved.</div>
          <div className="flex gap-6"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}
