import logo from "@/assets/jonak-logo.jpeg";
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface text-white">
      <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg ring-1 ring-white/20">
                <img src={logo} alt="JONAK Construction Limited" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-display text-base font-bold">JONAK</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Construction Limited</div>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm text-white/60">
              Building excellence with precision and integrity — trusted construction
              and engineering for landmark projects.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-gold hover:text-gold">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Quick Links</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {["About", "Services", "Projects", "Operations", "Contact"].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="transition-colors hover:text-gold">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Services</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {["General Construction","Civil Engineering","Road Construction","Procurement","Haulage & Logistics"].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold">Get in Touch</div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> 0817 457 8070</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> info@jonakconstruction.com</li>
              <li className="text-white/60">Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <div>© {new Date().getFullYear()} JONAK Construction Limited. All rights reserved.</div>
          <div className="flex gap-6"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}
