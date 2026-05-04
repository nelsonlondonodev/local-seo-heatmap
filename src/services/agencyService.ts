import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { UserProfile } from './profileService';

export type Agency = Database['public']['Tables']['agencies']['Row'];

export const agencyService = {
  /**
   * Obtiene la agencia basándose en el ID del propietario.
   */
  async getAgencyByOwnerId(ownerId: string): Promise<Agency | null> {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('owner_id', ownerId)
      .maybeSingle();
      
    if (error) {
      console.error('[AGENCY_SERVICE] Error fetching agency:', error);
      return null;
    }
    return data;
  },

  /**
   * Crea o actualiza la agencia del Owner (Upsert).
   * Si es la primera vez que la crea, actualiza su perfil para enlazarse a ella.
   */
  async upsertAgency(ownerId: string, name: string, logoUrl: string | null = null): Promise<Agency> {
    const existing = await this.getAgencyByOwnerId(ownerId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('agencies')
        .update({ name, logo_url: logoUrl })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw new Error('Error al actualizar la agencia');
      return data;
    } else {
      const { data, error } = await supabase
        .from('agencies')
        .insert({ owner_id: ownerId, name, logo_url: logoUrl })
        .select()
        .single();
        
      if (error) throw new Error('Error al crear la agencia');
      
      // Asegurar que el owner queda vinculado a su nueva agencia
      await supabase.from('profiles').update({ agency_id: data.id }).eq('id', ownerId);
      
      return data;
    }
  },

  /**
   * Obtiene todos los usuarios que pertenecen a una agencia específica.
   */
  async getAgencyUsers(agencyId: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AGENCY_SERVICE] Error fetching agency users:', error);
      return [];
    }

    return data as UserProfile[];
  }
};
