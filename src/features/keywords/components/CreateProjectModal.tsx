import { useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocationSelector } from './LocationSelector';
import { useProjects } from '../hooks/useProjects';
import type { DataForSeoLocation } from '../types/dataForSeo';
import { toast } from 'sonner';
import { getGeoPlaceholders } from '@/util/geoUtils';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreated }: CreateProjectModalProps) {
  const { createProject, isLoading } = useProjects();
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [location, setLocation] = useState<DataForSeoLocation | null>(null);

  const cleanUrl = (input: string) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('El nombre del proyecto es obligatorio.');
      return;
    }
    if (!location) {
      toast.error('Debes seleccionar una ubicación para el SEO Local.');
      return;
    }

    const project = await createProject(
      name.trim(),
      location.location_code,
      location.location_name,
      location.country_iso_code,
      cleanUrl(targetUrl)
    );

    if (project) {
      setName('');
      setTargetUrl('');
      setLocation(null);
      onCreated(project.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-brand-primary" />
            Nuevo Proyecto
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define los detalles de tu nuevo cliente para el rastreo SEO y SEO Local.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Nombre del Proyecto / Cliente
            </label>
            <Input
              placeholder={`ej: ${getGeoPlaceholders().project}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-2 bg-background/50 focus-visible:ring-brand-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Sitio Web (Opcional pero recomendado)
            </label>
            <Input
              placeholder="ej: misitio.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="h-11 rounded-xl border-2 bg-background/50 focus-visible:ring-brand-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Ubicación Geográfica (Requerida)
            </label>
            <div className="p-4 bg-muted/30 rounded-2xl border-2 border-transparent focus-within:border-brand-primary/20 transition-all">
              <LocationSelector 
                onLocationSelect={setLocation}
                selectedLocation={location}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 italic px-1 text-balance">
              Define el país o ciudad base para el análisis del volumen y posicionamiento.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isLoading || !name.trim() || !location}
            className="rounded-xl px-8 font-bold shadow-lg shadow-brand-primary/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Proyecto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
