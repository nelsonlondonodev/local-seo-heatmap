import { Briefcase, MapPin } from 'lucide-react';
import { ProjectSelector } from './ProjectSelector';
import { LocationSelector } from './LocationSelector';

import type { DataForSeoLocation } from '../types/dataForSeo';

import type { KeywordProject } from '../types/keywords';

interface KeywordConfigPanelProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedLocation: DataForSeoLocation | null;
  setSelectedLocation: (loc: DataForSeoLocation | null) => void;
  projects: KeywordProject[];
}

export function KeywordConfigPanel({ 
  selectedProjectId, 
  setSelectedProjectId, 
  selectedLocation, 
  setSelectedLocation,
  projects
}: KeywordConfigPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
      {/* Filter Section: Project */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-brand-primary">
          <Briefcase className="h-4 w-4" />
          <span className="text-sm font-bold uppercase tracking-widest">Contexto de Proyecto</span>
        </div>
        <div className="w-full lg:w-auto">
          <ProjectSelector 
            onProjectSelect={setSelectedProjectId} 
            selectedProjectId={selectedProjectId} 
            projects={projects}
          />
        </div>
        <p className="text-[10px] text-muted-foreground italic">Las keywords se guardarán en este proyecto.</p>
      </div>

      {/* Filter Section: Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-brand-primary">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-bold uppercase tracking-widest">Ubicación de Google</span>
        </div>
        <LocationSelector 
          onLocationSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
          initialCountryCode={selectedLocation?.country_iso_code}
        />
        <p className="text-[10px] text-muted-foreground italic">Influye en el volumen y dificultad de búsqueda.</p>
      </div>
    </div>
  );
}
