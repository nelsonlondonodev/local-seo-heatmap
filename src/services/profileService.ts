import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

/**
 * Atomic service to manage User Profiles and multi-tenant data.
 * Refactored to handle initial profile creation for new registrations.
 */
export const profileService = {
  /**
   * Fetches the user profile from the database.
   */
  async getProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.warn('[PROFILE_SERVICE] Profile not found or error:', error.message);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Creates a default profile for a newly registered user.
   * Useful when the database trigger is not configured or in case of race conditions.
   */
  async createInitialProfile(id: string, email: string, fullName: string): Promise<UserProfile | null> {
    
    const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
      id,
      email,
      full_name: fullName,
      role: 'owner',
      plan: 'free',
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      // If it exists already (trigger worked), we just return it
      if (error.code === '23505') { 
        return this.getProfile(id);
      }
      console.error('[PROFILE_SERVICE] Hard failure creating profile:', error.message);
      return null;
    }

    return data;
  },
};
