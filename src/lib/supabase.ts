/**
 * Supabase Client Configuration
 * Single client instance for the entire application.
 *
 * Only public configuration belongs in this file. This module is bundled into
 * the browser, so never reference a Supabase secret/service-role key here or
 * in any VITE_* environment variable.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (see .env.example).",
  );
}

// Create typed client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Type exports
export type PortfolioContent = Database["public"]["Tables"]["portfolio_content"]["Row"];
export type PortfolioContentInsert = Database["public"]["Tables"]["portfolio_content"]["Insert"];
export type PortfolioContentUpdate = Database["public"]["Tables"]["portfolio_content"]["Update"];

// Section name type
export type SectionName =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "process"
  | "testimonials"
  | "navigation"
  | "socialLinks";

// Content type for each section (matches your existing CMS structure)
export interface SectionContentMap {
  hero: {
    tag: string;
    titleLines: string[];
    subtitleLines: string[];
    ctaText: string;
    secondaryCtaText: string;
  };
  about: {
    description1: string;
    description2: string;
    stats: Array<{ value: number; suffix: string; label: string }>;
  };
  services: {
    items: Array<{ icon: string; title: string; copy: string }>;
  };
  projects: Array<{ name: string; tag: string; desc: string; url?: string }>;
  process: {
    steps: Array<{ n: string; title: string; copy: string }>;
  };
  testimonials: {
    quotes: Array<{ quote: string; name: string; role: string }>;
  };
  navigation: Array<{ label: string; href: string }>;
  socialLinks: Array<{ icon: string; href: string; label: string }>;
}
