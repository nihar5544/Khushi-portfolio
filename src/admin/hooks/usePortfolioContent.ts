/**
 * Admin Panel Hook - Portfolio Content Management
 * Handles CRUD operations for portfolio sections via Supabase
 */

import { useState, useCallback, useEffect } from "react";
import {
  supabase,
  type SectionName,
  type PortfolioContent,
  type SectionContentMap,
} from "@/lib/supabase";
import { toast } from "sonner";

// Default content fallback (matches your existing DEFAULT_CONTENT)
const DEFAULT_CONTENT: Record<SectionName, SectionContentMap[SectionName]> = {
  hero: {
    tag: "Available for freelance & collaborations — 2026",
    titleLines: [
      "I'm Khushi",
      'Rawat <span class="text-primary">&mdash;</span>',
      '<span class="text-primary">Brand Strategist</span>',
      "& Designer",
    ],
    subtitleLines: [
      "I build brands that stop the scroll.",
      "Brand strategy, identity, social media and UI design for founders who refuse to blend in.",
    ],
    ctaText: "View My Work",
    secondaryCtaText: "Let's Collaborate",
  },
  about: {
    description1:
      "I've spent the last 3+ years designing for brands, startups and growing businesses from brand identity and social media to websites and UI.",
    description2:
      "I like turning ideas into design that feels clear, memorable and actually useful. I work mainly in Figma, Canva and Adobe tools, and enjoy being involved from the first idea to the final visual.",
    stats: [
      { value: 3, suffix: "+", label: "Years Experience" },
      { value: 10, suffix: "+", label: "Brands Worked With" },
      { value: 50, suffix: "+", label: "Projects Delivered" },
    ],
  },
  services: {
    items: [
      {
        icon: "Compass",
        title: "Brand Strategy",
        copy: "Logos, visual identities, colour systems and brand assets that make a business recognizable.",
      },
      {
        icon: "Fingerprint",
        title: "Brand Identity & Logo Design",
        copy: "Logos, type, colour and full identity kits built to last beyond a trend cycle.",
      },
      {
        icon: "Instagram",
        title: "Social Media Design",
        copy: "Posts, carousels, stories and content systems that keep brands consistent and engaging.",
      },
      {
        icon: "LayoutGrid",
        title: "UI/UX Design",
        copy: "Websites, SaaS products, dashboards and interfaces designed around real user needs.",
      },
      {
        icon: "Layers",
        title: "Design Systems in Figma & Canva",
        copy: "Handoff-ready libraries your team can actually run with, solo or at scale.",
      },
    ],
  },
  projects: [
    {
      name: "Picsdrop",
      tag: "Branding / Social Media / Website Design",
      desc: "Built the visual direction for a photography business platform, from its brand presence and social content to the website experience.",
      url: "https://picsdrop.in",
    },
    {
      name: "Somenu Digital",
      tag: "Branding / Social Media / UI",
      desc: "Worked across the brand, social media and product interface to create a more consistent experience for a digital POS and menu platform.",
      url: "https://somenu.digital",
    },
    {
      name: "Spark Digishine",
      tag: "SOCIAL MEDIA / UI / WEBSITE DESIGN",
      desc: "Designed digital experiences and social content for a creative technology studio, keeping the work clear, modern and consistent across platforms.",
      url: "https://sparkdigishine.com",
    },
    {
      name: "Fishelly",
      tag: "UI / SOCIAL MEDIA",
      desc: "Designed the product experience and social visuals for a fish community platform, making complex features feel simple and approachable.",
      url: "https://fishelly.com",
    },
    {
      name: "Super Squirrels",
      tag: "Branding / Social Media",
      desc: "Created a playful visual direction across the brand and website, giving the initiative a more recognizable personality.",
      url: "https://supersquirrels.org",
    },
    {
      name: "ORIZA TEAS",
      tag: "WEBSITE DESIGN / PACKAGING DESIGN",
      desc: "Worked on the digital and packaging experience for a tea brand, bringing the products, visual identity and online presence together.",
      url: "",
    },
  ],
  process: {
    steps: [
      { n: "01", title: "Discover", copy: "Understand the business, audience and problem." },
      { n: "02", title: "Strategize", copy: "Find the right direction before designing." },
      { n: "03", title: "Design", copy: "Turn the direction into a clear visual experience." },
      { n: "04", title: "Deliver", copy: "Files, guidelines and handoff your team can run with." },
    ],
  },
  testimonials: {
    quotes: [
      {
        quote:
          "Placeholder testimonial — Khushi turned a vague idea into a brand our audience instantly recognised.",
        name: "Client Name",
        role: "Founder, Company",
      },
      {
        quote:
          "Placeholder testimonial — the social system she designed doubled how consistent our feed looks.",
        name: "Client Name",
        role: "Marketing Lead, Company",
      },
      {
        quote:
          "Placeholder testimonial — sharp strategy, fast execution, and files our team could actually use.",
        name: "Client Name",
        role: "Co-founder, Company",
      },
    ],
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  socialLinks: [
    { icon: "Mail", href: "mailto:rawatkhushi2910@gmail.com", label: "Email" },
    {
      icon: "Linkedin",
      href: "https://www.linkedin.com/in/khushi-rawat-712290208/",
      label: "LinkedIn",
    },
    { icon: "Phone", href: "tel:+916353561585", label: "Phone" },
  ],
};

interface UsePortfolioContentReturn {
  // State
  content: Record<SectionName, SectionContentMap[SectionName]>;
  loading: boolean;
  saving: Record<SectionName, boolean>;
  error: string | null;

  // Actions
  fetchAllContent: () => Promise<void>;
  fetchSection: (section: SectionName) => Promise<void>;
  saveSection: (section: SectionName, data: SectionContentMap[SectionName]) => Promise<boolean>;
  resetSection: (section: SectionName) => Promise<void>;
  resetAll: () => Promise<void>;

  // Real-time
  subscribeToChanges: (
    callback: (section: SectionName, data: SectionContentMap[SectionName]) => void,
  ) => () => void;
}

export function usePortfolioContent(): UsePortfolioContentReturn {
  const [content, setContent] = useState<Record<SectionName, SectionContentMap[SectionName]>>(
    () => {
      // Initialize with defaults for immediate render
      const initial: Record<SectionName, SectionContentMap[SectionName]> = {} as Record<
        SectionName,
        SectionContentMap[SectionName]
      >;
      (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
        initial[key] = DEFAULT_CONTENT[key];
      });
      return initial;
    },
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<SectionName, boolean>>(
    {} as Record<SectionName, boolean>,
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch all content from Supabase
  const fetchAllContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("portfolio_content")
        .select("section_name, content");

      if (fetchError) throw fetchError;

      // Merge fetched data with defaults
      const merged: Record<SectionName, SectionContentMap[SectionName]> = {} as Record<
        SectionName,
        SectionContentMap[SectionName]
      >;

      (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
        const found = data?.find((row) => row.section_name === key);
        merged[key] = (found?.content as SectionContentMap[SectionName]) || DEFAULT_CONTENT[key];
      });

      setContent(merged);
    } catch (err) {
      // Fallback to defaults if Supabase unavailable
      console.warn("Supabase fetch failed, using defaults:", err);
      setContent({ ...DEFAULT_CONTENT });
      // Don't set error - silently fallback for better UX
      // setError(err instanceof Error ? err.message : 'Failed to fetch content');
      // toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single section
  const fetchSection = useCallback(async (section: SectionName) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("portfolio_content")
        .select("content")
        .eq("section_name", section)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (data) {
        setContent((prev) => ({
          ...prev,
          [section]: data.content as SectionContentMap[SectionName],
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch ${section}`;
      setError(message);
      toast.error(message);
    }
  }, []);

  // Save section to Supabase (upsert)
  const saveSection = useCallback(
    async (section: SectionName, data: SectionContentMap[SectionName]): Promise<boolean> => {
      setSaving((prev) => ({ ...prev, [section]: true }));
      setError(null);

      try {
        const { error: upsertError } = await supabase.from("portfolio_content").upsert(
          {
            section_name: section,
            content: data as any,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "section_name",
          },
        );

        if (upsertError) throw upsertError;

        // Update local state immediately (optimistic update)
        setContent((prev) => ({
          ...prev,
          [section]: data,
        }));

        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully!`);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : `Failed to save ${section}`;
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setSaving((prev) => ({ ...prev, [section]: false }));
      }
    },
    [],
  );

  // Reset section to defaults
  const resetSection = useCallback(
    async (section: SectionName) => {
      await saveSection(section, DEFAULT_CONTENT[section]);
    },
    [saveSection],
  );

  // Reset all sections
  const resetAll = useCallback(async () => {
    setSaving((prev) => {
      const next = { ...prev };
      (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
        next[key] = true;
      });
      return next;
    });

    try {
      const operations = (Object.keys(DEFAULT_CONTENT) as SectionName[]).map((section) =>
        supabase.from("portfolio_content").upsert(
          {
            section_name: section,
            content: DEFAULT_CONTENT[section] as any,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "section_name" },
        ),
      );

      const results = await Promise.all(operations);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) throw errors[0].error;

      setContent({ ...DEFAULT_CONTENT });
      toast.success("All content reset to defaults");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset content";
      setError(message);
      toast.error(message);
    } finally {
      setSaving((prev) => {
        const next = { ...prev };
        (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
          next[key] = false;
        });
        return next;
      });
    }
  }, []);

  // Subscribe to real-time changes
  const subscribeToChanges = useCallback(
    (callback: (section: SectionName, data: SectionContentMap[SectionName]) => void) => {
      const channel = supabase
        .channel("portfolio_content_changes")
        .on(
          "postgres_changes",
          {
            event: ["INSERT", "UPDATE"],
            schema: "public",
            table: "portfolio_content",
          },
          (payload) => {
            const section = payload.new.section_name as SectionName;
            const newData = payload.new.content as SectionContentMap[SectionName];

            // Update local state
            setContent((prev) => ({
              ...prev,
              [section]: newData,
            }));

            // Notify callback
            callback(section, newData);
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    [],
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  return {
    content,
    loading,
    saving,
    error,
    fetchAllContent,
    fetchSection,
    saveSection,
    resetSection,
    resetAll,
    subscribeToChanges,
  };
}

// Export defaults for use in components
export { DEFAULT_CONTENT };
export type { SectionContentMap };
