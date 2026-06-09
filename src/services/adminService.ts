import { supabase } from '@/lib/supabase';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

import type { UserProfile } from './profileService';
import type { UserRole } from '@/features/auth/types';

export interface ApiHealthStatus {
  status: 'ok' | 'error';
  latencyMs: number;
  message: string;
  balance?: number;
}

export interface SystemHealthResponse {
  serper: ApiHealthStatus;
  dataforseo: ApiHealthStatus;
  openai: ApiHealthStatus;
  google: ApiHealthStatus;
}

export interface SystemMetrics {
  users: number;
  heatmaps: number;
  agencies: number;
}

export const adminService = {
  /**
   * Obtiene métricas globales usando conteos optimizados
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: heatmapsCount, error: heatmapsError } = await supabase
      .from('heatmaps')
      .select('*', { count: 'exact', head: true });

    const { count: agenciesCount, error: agenciesError } = await supabase
      .from('agencies')
      .select('*', { count: 'exact', head: true });

    if (usersError || heatmapsError || agenciesError) {
      console.error('[ADMIN_SERVICE] Error fetching metrics:', { usersError, heatmapsError, agenciesError });
      throw new Error('No se pudieron cargar las métricas del sistema');
    }

    return {
      users: usersCount || 0,
      heatmaps: heatmapsCount || 0,
      agencies: agenciesCount || 0,
    };
  },

  /**
   * Obtiene la lista completa de perfiles de usuario
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN_SERVICE] Error fetching users:', error);
      throw new Error('Error al cargar la lista de usuarios');
    }

    return data as UserProfile[];
  },

  /**
   * Actualiza el rol de un usuario específico
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN_SERVICE] Error updating user role:', error);
      throw new Error('Error al actualizar el rol del usuario');
    }

    return data as UserProfile;
  },

  /**
   * Actualiza la cantidad de créditos de un usuario específico
   */
  async updateUserCredits(userId: string, newCredits: number): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN_SERVICE] Error updating user credits:', error);
      throw new Error('Error al actualizar los créditos del usuario');
    }

    return data as UserProfile;
  },

  /**
   * Consulta el estado de salud en tiempo real de las APIs de terceros
   */
  async getApiHealthStatus(): Promise<SystemHealthResponse> {
    return invokeEdgeFunction<SystemHealthResponse, Record<string, never>>(
      'admin-health-check',
      {}
    );
  }
};
