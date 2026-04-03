import type { Database } from '@/types/database';

export type Agency = Database['public']['Tables']['agencies']['Row'];

export interface BrandingConfig {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
}

export interface BrandingState {
  config: BrandingConfig;
  agency: Agency | null;
  isLoading: boolean;
  error: Error | null;
}
