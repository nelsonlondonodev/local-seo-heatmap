import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import { toast } from 'sonner';
import type { KeywordProject } from '../types/keywords';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<KeywordProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('keyword_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const typedData = data as KeywordProject[] | null;
      setProjects(typedData || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string, locationCode?: number, locationName?: string, countryCode?: string, targetUrl?: string) => {
    if (!name.trim() || !user) return null;
    setIsLoading(true);
    try {
      const project = await keywordPersistenceService.createProject(user.id, name, targetUrl, locationCode, locationName, countryCode);
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

  const updateProjectLocal = useCallback((projectId: string, updates: Partial<KeywordProject>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ));
  }, []);

  return {
    projects,
    isLoading,
    createProject,
    refreshProjects: fetchProjects,
    updateProjectLocal
  };
}
