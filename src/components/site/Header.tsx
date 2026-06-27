import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, LockKeyhole, Menu, Phone, MessageCircle } from "lucide-react";
import logo from "@/assets/jonak-logo.jpeg";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { fetchCurrentUser } from "@/lib/api";
import { getQuoteLink } from "@/lib/siteContent";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#video", label: "Showcase" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const quoteHref = getQuoteLink("my construction project");

  const currentUserQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await fetchCurrentUser()).user,
    staleTime: 60 * 1000,
    retry: false,
    enabled: typeof window !== "undefined",
  });

  const isAdmin = currentUserQuery.data?.role === "admin";

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
            <div className="flex items-center gap-2">
              <div className="font-display text-sm font-bold tracking-wide text-white md:text-base">JONAK</div>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
                RC 807655
              </span>
            </div>
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
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="relative flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/admin"
              className="relative flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              <LockKeyhole className="h-4 w-4" />
              Admin Login
            </Link>
          )}
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
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-105 lg:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Get a Quote
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 shadow-sm backdrop-blur transition-all hover:border-gold hover:bg-white/10 hover:text-gold lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <SheetContent side="right" className="w-[88vw] border-l border-white/10 bg-surface p-0 text-white sm:max-w-sm">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/20">
                      <img src={logo} alt="JONAK Construction Limited" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-display text-sm font-bold tracking-wide text-white">JONAK</div>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/70">
                          RC 807655
                        </span>
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Construction Limited</div>
                    </div>
                  </Link>
                </div>

                <div className="flex-1 px-6 py-8">
                  <nav className="space-y-1">
                    {links.map((l, i) => (
                      <SheetClose asChild key={l.href}>
                        <a
                          href={l.href}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-display text-xl font-semibold text-white transition-colors hover:border-gold hover:text-gold"
                          style={{
                            transitionDelay: `${i * 50}ms`,
                            transform: open ? "translateY(0)" : "translateY(18px)",
                            opacity: open ? 1 : 0,
                            transition:
                              "transform 0.45s var(--transition-smooth), opacity 0.45s var(--transition-smooth)",
                          }}
                        >
                          {l.label}
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">0{i + 1}</span>
                        </a>
                      </SheetClose>
                    ))}
                    {isAdmin ? (
                      <SheetClose asChild>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setOpen(false)}
                          className="mt-3 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/10 px-4 py-4 font-display text-xl font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/15 hover:text-white"
                          style={{
                            transitionDelay: `${links.length * 50}ms`,
                            transform: open ? "translateY(0)" : "translateY(18px)",
                            opacity: open ? 1 : 0,
                            transition:
                              "transform 0.45s var(--transition-smooth), opacity 0.45s var(--transition-smooth)",
                          }}
                        >
                          <span className="flex items-center gap-3">
                            <LayoutDashboard className="h-5 w-5" />
                            Admin Dashboard
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Admin</span>
                        </Link>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to="/admin"
                          onClick={() => setOpen(false)}
                          className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-display text-xl font-semibold text-white/70 transition-colors hover:border-gold hover:text-gold"
                          style={{
                            transitionDelay: `${links.length * 50}ms`,
                            transform: open ? "translateY(0)" : "translateY(18px)",
                            opacity: open ? 1 : 0,
                            transition:
                              "transform 0.45s var(--transition-smooth), opacity 0.45s var(--transition-smooth)",
                          }}
                        >
                          <span className="flex items-center gap-3">
                            <LockKeyhole className="h-5 w-5" />
                            Admin Login
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Sign in</span>
                        </Link>
                      </SheetClose>
                    )}
                  </nav>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Quick Contact</div>
                    <a
                      href="tel:08174578070"
                      className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm font-medium text-white transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <Phone className="h-4 w-4" />
                      0817 457 8070
                    </a>
                    <a
                      href={quoteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-3 rounded-2xl bg-gold-gradient px-4 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.01]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Request a Quote on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
