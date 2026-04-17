/**
 * Database types placeholder.
 * Replace with auto-generated types from Supabase CLI:
 * npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          owner_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'super-admin' | 'owner' | 'admin' | 'staff' | 'client';
          agency_id: string | null;
          plan: 'free' | 'pro' | 'enterprise';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'super-admin' | 'owner' | 'admin' | 'staff' | 'client';
          agency_id?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'super-admin' | 'owner' | 'admin' | 'staff' | 'client';
          agency_id?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
        };
        Relationships: [];
      };
      heatmaps: {
        Row: {
          id: string;
          user_id: string;
          agency_id: string | null;
          keyword: string;
          business_name: string;
          place_id: string;
          grid_size: string;
          radius_km: number;
          center_lat: number;
          center_lng: number;
          points: Json;
          results_summary: Json | null;
          prospect_name: string | null;
          prospect_email: string | null;
          advertisers: Json | null;
          competitors: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agency_id?: string | null;
          keyword: string;
          business_name: string;
          place_id: string;
          grid_size: string;
          radius_km: number;
          center_lat: number;
          center_lng: number;
          points: Json;
          results_summary?: Json | null;
          prospect_name?: string | null;
          prospect_email?: string | null;
          advertisers?: Json | null;
          competitors?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agency_id?: string | null;
          keyword?: string;
          business_name?: string;
          place_id?: string;
          grid_size?: string;
          radius_km?: number;
          center_lat?: number;
          center_lng?: number;
          points?: Json;
          results_summary?: Json | null;
          prospect_name?: string | null;
          prospect_email?: string | null;
          advertisers?: Json | null;
          competitors?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_generated_content: {
        Row: {
          id: string;
          user_id: string;
          heatmap_id: string | null;
          business_name: string;
          keyword: string;
          content: string;
          hashtags: string[] | null;
          optimized_filename: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          heatmap_id?: string | null;
          business_name: string;
          keyword: string;
          content: string;
          hashtags?: string[] | null;
          optimized_filename?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          heatmap_id?: string | null;
          business_name?: string;
          keyword?: string;
          content?: string;
          hashtags?: string[] | null;
          optimized_filename?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      keyword_projects: {
        Row: {
          id: string;
          user_id: string;
          agency_id: string | null;
          name: string;
          target_url: string | null;
          location_code: number | null;
          language_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agency_id?: string | null;
          name: string;
          target_url?: string | null;
          location_code?: number | null;
          language_code?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agency_id?: string | null;
          name?: string;
          target_url?: string | null;
          location_code?: number | null;
          language_code?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tracked_keywords: {
        Row: {
          id: string;
          project_id: string;
          keyword: string;
          search_engine: string;
          status: 'active' | 'paused';
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          keyword: string;
          search_engine?: string;
          status?: 'active' | 'paused';
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          keyword?: string;
          search_engine?: string;
          status?: 'active' | 'paused';
          created_at?: string;
        };
        Relationships: [];
      };
      keyword_history: {
        Row: {
          id: string;
          keyword_id: string;
          rank: number | null;
          rank_change: number;
          search_volume: number | null;
          results_json: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          keyword_id: string;
          rank?: number | null;
          rank_change?: number;
          search_volume?: number | null;
          results_json?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          keyword_id?: string;
          rank?: number | null;
          rank_change?: number;
          search_volume?: number | null;
          results_json?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: 'free' | 'pro' | 'enterprise';
      grid_size: '3x3' | '5x5' | '7x7';
    };
  };
}
