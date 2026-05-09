import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/jonak-logo.jpeg";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#equipment", label: "Operations" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-surface/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/20 md:h-11 md:w-11">
            <img src={logo} alt="JONAK Construction Limited" className="h-full w-full object-cover" width={44} height={44} />
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold tracking-wide text-white md:text-base">JONAK</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/60 md:text-[11px]">Construction Limited</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium text-white/80 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:08174578070"
            className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur transition-all hover:border-gold hover:text-gold md:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            0817 457 8070
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-105 lg:inline-block"
          >
            Get a Quote
          </a>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-surface transition-all duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 md:h-20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/20">
              <img src={logo} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="font-display text-sm font-bold text-white">JONAK</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-5 pt-8">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 font-display text-2xl font-semibold text-white transition-colors hover:text-gold"
              style={{
                transitionDelay: `${i * 60}ms`,
                transform: open ? "translateY(0)" : "translateY(20px)",
                opacity: open ? 1 : 0,
                transition: "transform 0.5s var(--transition-smooth), opacity 0.5s var(--transition-smooth)",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 inline-block rounded-full bg-gold-gradient px-6 py-4 text-center font-semibold text-gold-foreground shadow-gold"
          >
            Get a Quote
          </a>
          <a
            href="tel:08174578070"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-white"
          >
            <Phone className="h-4 w-4" /> 0817 457 8070
          </a>
        </nav>
      </div>
    </header>
  );
}
