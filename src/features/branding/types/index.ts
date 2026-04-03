import type { Database } from '@/types/database';

export type Agency = Database['public']['Tables']['agencies']['Row'];

/**
 * Visual configuration for the current agency or default brand.
 */
export interface BrandingConfig {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
}

/**
 * State managed by the BrandingProvider.
 */
export interface BrandingState {
  config: BrandingConfig;
  agency: Agency | null;
  isLoading: boolean;
  error: Error | null;
}
