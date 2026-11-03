/**
 * Portfolio Page Hook - Public Content Fetching with Real-time Updates
 * Optimized for the main portfolio website with React Query integration
 */

import { useState, useEffect, useCallback } from "react";
import { supabase, type SectionName, type SectionContentMap } from "@/lib/supabase";
import { DEFAULT_CONTENT } from "@/admin/hooks/usePortfolioContent";

interface UsePortfolioDataReturn {
  // State
  data: Partial<Record<SectionName, SectionContentMap[SectionName]>>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  refetch: () => Promise<void>;
  refetchSection: (section: SectionName) => Promise<void>;
}

/**
 * Main portfolio data hook with real-time subscriptions
 * Uses efficient single-query fetch + real-time updates
 */
export function usePortfolioData(): UsePortfolioDataReturn {
  const [data, setData] = useState<Partial<Record<SectionName, SectionContentMap[SectionName]>>>(
    () => {
      // Initialize with defaults for SSR/initial render
      const initial: Partial<Record<SectionName, SectionContentMap[SectionName]>> = {};
      (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
        initial[key] = DEFAULT_CONTENT[key];
      });
      return initial;
    },
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch all content in a single query
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use RPC function for efficient single-call fetch
      const { data: rpcData, error: rpcError } = await supabase.rpc("get_all_portfolio_content");

      if (rpcError) {
        // Fallback to direct query if RPC not available
        const { data: directData, error: directError } = await supabase
          .from("portfolio_content")
          .select("section_name, content");

        if (directError) throw directError;

        const merged: Partial<Record<SectionName, SectionContentMap[SectionName]>> = {};
        (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
          const found = directData?.find((row) => row.section_name === key);
          merged[key] = (found?.content as SectionContentMap[SectionName]) || DEFAULT_CONTENT[key];
        });

        setData(merged);
        setLastUpdated(new Date());
      } else {
        // RPC returned aggregated JSON object
        setData(rpcData as Partial<Record<SectionName, SectionContentMap[SectionName]>>);
        setLastUpdated(new Date());
      }
    } catch (err) {
      // Fallback to defaults if Supabase unavailable
      console.warn("Supabase fetch failed, using defaults:", err);
      const merged: Partial<Record<SectionName, SectionContentMap[SectionName]>> = {};
      (Object.keys(DEFAULT_CONTENT) as SectionName[]).forEach((key) => {
        merged[key] = DEFAULT_CONTENT[key];
      });
      setData(merged);
      // Don't set error - silently fallback
      // setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single section
  const refetchSection = useCallback(async (section: SectionName) => {
    try {
      const { data: sectionData, error: fetchError } = await supabase.rpc("get_portfolio_section", {
        p_section: section,
      });

      if (fetchError && fetchError.code !== "PGRST116") {
        // Fallback
        const { data: directData, error: directError } = await supabase
          .from("portfolio_content")
          .select("content")
          .eq("section_name", section)
          .single();

        if (directError && directError.code !== "PGRST116") throw directError;

        if (directData) {
          setData((prev) => ({
            ...prev,
            [section]: directData.content as SectionContentMap[SectionName],
          }));
          setLastUpdated(new Date());
        }
      } else if (sectionData) {
        setData((prev) => ({
          ...prev,
          [section]: sectionData as SectionContentMap[SectionName],
        }));
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(`Failed to fetch ${section}:`, err);
    }
  }, []);

  // Main refetch function
  const refetch = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // Real-time subscription setup
  useEffect(() => {
    let mounted = true;

    const channel = supabase
      .channel("portfolio_public_changes")
      .on(
        "postgres_changes",
        {
          event: ["INSERT", "UPDATE"],
          schema: "public",
          table: "portfolio_content",
        },
        (payload) => {
          if (!mounted) return;

          const section = payload.new.section_name as SectionName;
          const newData = payload.new.content as SectionContentMap[SectionName];

          setData((prev) => ({
            ...prev,
            [section]: newData,
          }));
          setLastUpdated(new Date());

          // Optional: Show subtle notification
          console.log(`[Real-time] Updated: ${section}`);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Real-time] Portfolio subscription active");
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
    refetchSection,
  };
}

/**
 * Lightweight hook for a single section (for code-splitting)
 * Use when you only need one section on a page
 */
export function useSectionData<T extends SectionName>(
  section: T,
): {
  data: SectionContentMap[T] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<SectionContentMap[T] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sectionData, error: fetchError } = await supabase.rpc("get_portfolio_section", {
        p_section: section,
      });

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (sectionData) {
        setData(sectionData as SectionContentMap[T]);
      } else {
        // Fallback to defaults
        setData(DEFAULT_CONTENT[section] as SectionContentMap[T]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to load ${section}`;
      setError(message);
      // Fallback to defaults on error
      setData(DEFAULT_CONTENT[section] as SectionContentMap[T]);
    } finally {
      setLoading(false);
    }
  }, [section]);

  // Real-time for single section
  useEffect(() => {
    const channel = supabase
      .channel(`portfolio_${section}_changes`)
      .on(
        "postgres_changes",
        {
          event: ["INSERT", "UPDATE"],
          schema: "public",
          table: "portfolio_content",
          filter: `section_name=eq.${section}`,
        },
        (payload) => {
          const newData = payload.new.content as SectionContentMap[T];
          setData(newData);
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [section]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  return {
    data,
    loading,
    error,
    refetch: fetchSection,
  };
}
