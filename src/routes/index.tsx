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
import { usePortfolioData } from "@/hooks/usePortfolioData";

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
  const { data: cmsData, loading, error, lastUpdated } = usePortfolioData();

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </main>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load portfolio</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
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
      <Work cms={{ projects: cmsData.projects }} />
      <Marquee inverted speed={36} />
      <Process cms={cmsData.process} />
      <Testimonials cms={cmsData.testimonials} />
      <Contact cms={{ socialLinks: cmsData.socialLinks }} />
      <Footer />
      <Toaster />
    </main>
  );
}
