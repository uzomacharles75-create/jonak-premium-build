import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { WhyUs } from "@/components/site/WhyUs";
import { Equipment } from "@/components/site/Equipment";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JONAK Construction Limited — Engineering Excellence & Infrastructure" },
      { name: "description", content: "JONAK Construction Limited delivers world-class general construction, civil engineering, road construction, procurement, and haulage services for commercial, residential, and infrastructure projects." },
      { property: "og:title", content: "JONAK Construction Limited" },
      { property: "og:description", content: "Trusted construction and engineering solutions — built with precision and integrity." },
      { property: "og:type", content: "website" },
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
        <Projects />
        <WhyUs />
        <Equipment />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
