import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { VideoShowcase } from "@/components/site/VideoShowcase";
import { Projects } from "@/components/site/Projects";
import { WhyUs } from "@/components/site/WhyUs";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jonak Construction Limited | Trusted Construction Company in Lagos, Nigeria" },
      { name: "description", content: "Jonak Construction Limited (RC 807655) — a trusted Lagos-based construction company delivering residential, commercial, civil engineering, renovation and property development projects across Nigeria. KM 36 Lekki-Epe Expressway, Ibeju-Lekki." },
      { name: "keywords", content: "construction company Lagos, Jonak Construction, Lekki construction, Ibeju-Lekki contractor, residential construction Nigeria, commercial builder Lagos, civil engineering Lagos, property development Nigeria" },
      { property: "og:title", content: "Jonak Construction Limited — Construction Company in Lagos" },
      { property: "og:description", content: "Trusted construction and engineering solutions — residential, commercial, renovation and civil works. Lagos, Nigeria." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <VideoShowcase />
        <Projects />
        <WhyUs />
        <Testimonials />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
