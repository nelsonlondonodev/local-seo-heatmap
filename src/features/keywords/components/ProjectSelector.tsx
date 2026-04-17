import { useState } from 'react';
import { Plus as PlusIcon, Briefcase as ProjectIcon, Loader2 as Spinner, Check as CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '../hooks/useProjects';

interface ProjectSelectorProps {
  onProjectSelect: (id: string) => void;
  selectedProjectId?: string;
  currentLocationCode?: number;
  currentLocationName?: string;
}

export function ProjectSelector({ onProjectSelect, selectedProjectId, currentLocationCode, currentLocationName }: ProjectSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const { projects, isLoading, createProject } = useProjects(onProjectSelect);

  const handleCreate = async () => {
    const project = await createProject(newProjectName, currentLocationCode, currentLocationName);
    if (project) {
      setNewProjectName('');
      setIsCreating(false);
      onProjectSelect(project.id);
    }
  };

  const handleProjectLink = (val: string) => {
    onProjectSelect(val);
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
            <Button size="icon" onClick={handleCreate} disabled={isLoading} className="rounded-xl shrink-0">
              {isLoading ? <Spinner className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)} className="rounded-xl shrink-0">
              <PlusIcon className="h-4 w-4 rotate-45" />
            </Button>
          </div>
        ) : (
          <>
            <Select 
              value={selectedProjectId || ""} 
              onValueChange={handleProjectLink}
            >
              <SelectTrigger className="h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50">
                <div className="flex items-center gap-2">
                  <ProjectIcon className="h-4 w-4 text-brand-primary" />
                  <SelectValue placeholder="Selecciona un proyecto" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg">
                    {p.name}
                  </SelectItem>
                ))}
                {!isLoading && projects.length === 0 && (
                  <div className="p-2 text-xs text-center text-muted-foreground">
                    No hay proyectos
                  </div>
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsCreating(true)}
              className="rounded-xl border-2 hover:bg-brand-primary hover:text-primary-foreground transition-all shrink-0"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
