/**
 * Supabase Database Types
 * Generated from your database schema
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 */

export interface Database {
  public: {
    Tables: {
      portfolio_content: {
        Row: {
          id: string;
          section_name: string;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_name: string;
          content: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_name?: string;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read_status: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read_status?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          read_status?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_all_portfolio_content: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_portfolio_section: {
        Args: { p_section: string };
        Returns: Json;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
