import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Atomic Service to handle user profile data and role-based actions.
 */
export const profileService = {
  /**
   * Fetches a user profile by ID.
   */
  async getProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[PROFILE_SERVICE] Error fetching profile:', error.message);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Updates user profile fields.
   */
  async updateProfile(id: string, updates: ProfileUpdate): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
       console.error('[PROFILE_SERVICE] Error updating profile:', error.message);
       throw error;
    }

    return data as UserProfile;
  },

  /**
   * Links a user to an agency.
   */
  async linkToAgency(userId: string, agencyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ agency_id: agencyId } as ProfileUpdate)
      .eq('id', userId);

    if (error) {
      console.error('[PROFILE_SERVICE] Error linking to agency:', error.message);
      return false;
    }

    return true;
  }
};
