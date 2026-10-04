import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Services } from "@/components/portfolio/Services";
import { Work } from "@/components/portfolio/Work";
import { Process } from "@/components/portfolio/Process";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { Marquee } from "@/components/portfolio/Marquee";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { cms, cmsReady } from "@/lib/cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Khushi Rawat — Brand Strategist & Designer" },
      {
        name: "description",
        content:
          "Khushi Rawat builds brands that stop the scroll. Brand strategy, identity, social media and UI design with 3+ years of experience in Figma and Canva.",
      },
      { property: "og:title", content: "Khushi Rawat — Brand Strategist & Designer" },
      {
        property: "og:description",
        content:
          "Bold brand strategy, identity, social media and UI design for founders who refuse to blend in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [cmsData, setCmsData] = useState(cms.getState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    cmsReady.then(() => {
      setReady(true);
      setCmsData(cms.getState());
      const unsubscribe = cms.subscribe(() => {
        setCmsData(cms.getState());
      });
      return unsubscribe;
    });
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <CustomCursor />
      <Navbar />
      <Hero cms={cmsData.hero} />
      <About cms={cmsData.about} />
      <Services cms={cmsData.services} />
      <Work cms={cmsData.projects} />
      <Marquee inverted speed={36} />
      <Process cms={cmsData.process} />
      <Testimonials cms={cmsData.testimonials} />
      <Contact />
      <Footer />
      <Toaster />
    </main>
  );
}
