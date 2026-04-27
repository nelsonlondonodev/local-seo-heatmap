import { useState } from 'react';
import { Plus as PlusIcon, Briefcase as ProjectIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { CreateProjectModal } from './CreateProjectModal';
import { useProjects } from '../hooks/useProjects';
import type { KeywordProject } from '../types/keywords';

interface ProjectSelectorProps {
  onProjectSelect: (id: string | null) => void;
  selectedProjectId?: string | null;
  projects: KeywordProject[];
}

export function ProjectSelector({ onProjectSelect, selectedProjectId, projects }: ProjectSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { isLoading } = useProjects();

  const handleProjectLink = (val: string) => {
    onProjectSelect(val === 'none' ? null : val);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
        Proyecto de Seguimiento
      </label>
      <div className="flex gap-2">
        <Select 
          value={selectedProjectId || "none"} 
          onValueChange={handleProjectLink}
        >
          <SelectTrigger className="h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50">
            <div className="flex items-center gap-2 overflow-hidden">
              <ProjectIcon className="h-4 w-4 text-brand-primary shrink-0" />
              <span className="truncate">
                {selectedProjectId 
                  ? (projects.find(p => p.id === selectedProjectId)?.name || 'Cargando...') 
                  : 'Selecciona un proyecto'
                }
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="none" className="rounded-lg text-brand-primary font-medium italic">
              Ninguno (Investigación)
            </SelectItem>
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
          onClick={() => setIsCreating(true)}
          className="rounded-xl border-2 hover:bg-brand-primary hover:text-primary-foreground transition-all px-4 flex gap-2 h-10 shrink-0"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nuevo</span>
        </Button>
      </div>

      <CreateProjectModal 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreated={(id) => onProjectSelect(id)}
      />
    </div>
  );
}
