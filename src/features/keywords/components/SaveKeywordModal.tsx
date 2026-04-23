import { useState } from 'react';
import { Check, Search, FolderPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProjects } from '../hooks/useProjects';

interface SaveKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  onSave: (projectId: string) => Promise<void>;
}

export function SaveKeywordModal({ isOpen, onClose, keyword, onSave }: SaveKeywordModalProps) {
  const { projects, isLoading } = useProjects();
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (projectId: string) => {
    setIsSaving(true);
    try {
      await onSave(projectId);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FolderPlus className="h-6 w-6 text-brand-primary" />
            Guardar en Proyecto
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecciona el proyecto donde quieres añadir la palabra clave: <span className="text-foreground font-bold italic">"{keyword}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyecto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-2 bg-background/50 focus-visible:ring-brand-primary/20"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No se encontraron proyectos.
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    disabled={isSaving}
                    onClick={() => handleSave(project.id)}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-brand-primary transition-colors">
                        {project.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.location_name || 'Sin ubicación'}
                      </span>
                    </div>
                    <Check className="h-4 w-4 text-brand-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
