import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';
import { Plus, Briefcase, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import { toast } from 'sonner';

interface ProjectSelectorProps {
  onProjectSelect: (id: string) => void;
  selectedProjectId?: string;
}

export function ProjectSelector({ onProjectSelect, selectedProjectId }: ProjectSelectorProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('keyword_projects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setProjects(data || []);
      if (data && data.length > 0 && !selectedProjectId) {
        onProjectSelect(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;
    setIsLoading(true);
    try {
      const project = await keywordPersistenceService.createProject(user.id, newProjectName);
      toast.success('Proyecto creado correctamente');
      setNewProjectName('');
      setIsCreating(false);
      await fetchProjects();
      onProjectSelect(project.id);
    } catch (error) {
      toast.error('No se pudo crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
        Proyecto de Seguimiento
      </label>
      <div className="flex gap-2">
        {isCreating ? (
          <div className="flex gap-2 w-full animate-in slide-in-from-right-2 duration-300">
            <Input 
              placeholder="Nombre del proyecto..." 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="h-10 rounded-xl"
              autoFocus
            />
            <Button size="icon" onClick={handleCreateProject} disabled={isLoading} className="rounded-xl shrink-0">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)} className="rounded-xl shrink-0">
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </div>
        ) : (
          <>
            <Select value={selectedProjectId} onValueChange={onProjectSelect}>
              <SelectTrigger className="h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-primary" />
                  <SelectValue placeholder="Selecciona un proyecto" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg">{p.name}</SelectItem>
                ))}
                {projects.length === 0 && (
                  <div className="p-2 text-xs text-center text-muted-foreground">No hay proyectos</div>
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsCreating(true)}
              className="rounded-xl border-2 hover:bg-brand-primary hover:text-primary-foreground transition-all shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
