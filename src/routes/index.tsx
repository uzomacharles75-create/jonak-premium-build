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
import { heroMedia } from "@/lib/siteContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jonak Construction Limited | Lagos Construction, Gates & Civil Works" },
      {
        name: "description",
        content:
          "Jonak Construction Limited (RC 807655) is a Lagos and Port Harcourt construction and fabrication company delivering custom gates, security doors, staircases, canopies, civil works, renovations, and building projects across Nigeria.",
      },
      {
        name: "keywords",
        content:
          "construction company Lagos, Port Harcourt construction company, Jonak Construction, custom gates Lagos, security doors Nigeria, spiral staircase fabricator, canopy installer, civil works Lagos, Lekki contractor, Ibeju-Lekki builder, residential construction Nigeria",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Jonak Construction Limited | Lagos Construction, Gates & Civil Works" },
      {
        property: "og:description",
        content:
          "Trusted construction and fabrication solutions for gates, doors, staircases, canopies, civil works, and residential projects in Lagos and Port Harcourt, Nigeria.",
      },
      { property: "og:image", content: heroMedia.url },
      { property: "og:image:alt", content: heroMedia.alt },
      { property: "og:site_name", content: "Jonak Construction Limited" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jonak Construction Limited | Lagos Construction, Gates & Civil Works" },
      {
        name: "twitter:description",
        content:
          "Custom gates, security doors, staircases, canopies, civil works, renovations, and building projects across Lagos and Port Harcourt, Nigeria.",
      },
      { name: "twitter:image", content: heroMedia.url },
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
