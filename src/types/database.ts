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
          created_at?: string;
        };
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
