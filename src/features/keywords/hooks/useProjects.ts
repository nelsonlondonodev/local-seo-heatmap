import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import { toast } from 'sonner';

export function useProjects(onProjectSelect?: (id: string) => void) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('keyword_projects')
        .select('id, name, location_code, location_name, country_code')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setProjects(data || []);
      if (data && data.length > 0 && onProjectSelect) {
        onProjectSelect(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, onProjectSelect]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string, locationCode?: number, locationName?: string, countryCode?: string) => {
    if (!name.trim() || !user) return null;
    setIsLoading(true);
    try {
      const project = await keywordPersistenceService.createProject(user.id, name, undefined, locationCode, locationName, countryCode);
      toast.success('Proyecto creado correctamente');
      await fetchProjects();
      return project;
    } catch (error) {
      toast.error('No se pudo crear el proyecto');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    refreshProjects: fetchProjects
  };
}
