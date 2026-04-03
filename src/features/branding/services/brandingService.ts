import { supabase } from '@/lib/supabase';
import type { Agency } from '../types';

export const brandingService = {
  /**
   * Fetches agency data by ID
   */
  async getAgencyById(agencyId: string): Promise<Agency | null> {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', agencyId)
      .single();

    if (error) {
      console.error('[brandingService] Error fetching agency:', error);
      return null;
    }

    return data;
  },

  /**
   * (Optional) Fetches agency data by domain for public white-label landing pages
   */
  async getAgencyByDomain(_domain: string): Promise<Agency | null> {
    // This would require a 'domain' or 'subdomain' column in the agencies table.
    // For now, returning null as it's not implemented in the schema.
    console.warn('[brandingService] getAgencyByDomain not implemented in schema');
    return null;
  }
};
