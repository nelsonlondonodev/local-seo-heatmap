import { useState, useEffect } from 'react';
import { Info, Search as SearchIcon, MapPin, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectSelector } from './ProjectSelector';
import { LocationSelector } from './LocationSelector';
import { DiscoverySearchForm } from './DiscoverySearchForm';
import { DiscoveryResultsTable } from './DiscoveryResultsTable';
import { useKeywordDiscovery } from '../hooks/useKeywordDiscovery';
import { useProjects } from '../hooks/useProjects';

/**
 * KeywordDiscovery Component (Redesigned Flow)
 */
export function KeywordDiscovery() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  
  const { projects } = useProjects();
  
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    savedKeywords, 
    searchKeywords, 
    saveKeyword 
  } = useKeywordDiscovery(selectedProjectId);

  // Effect to load project location when project changes
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project?.location_code && project?.location_name) {
        setSelectedLocation({
          location_code: project.location_code,
          location_name: project.location_name
        });
      }
    }
  }, [selectedProjectId, projects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchKeywords(selectedLocation?.location_code);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Configuration Panel */}
      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-8">
          
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
                  currentLocationCode={selectedLocation?.location_code}
                  currentLocationName={selectedLocation?.location_name}
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
              />
              <p className="text-[10px] text-muted-foreground italic">Influye en el volumen y dificultad de búsqueda.</p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8">
            <div className="flex items-center gap-2 text-brand-primary mb-4">
              <SearchIcon className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Términos de Búsqueda</span>
            </div>
            <DiscoverySearchForm 
              query={query}
              setQuery={setQuery}
              isLoading={isLoading}
              onSearch={handleSearch}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-3xl" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <DiscoveryResultsTable 
            results={results}
            savedKeywords={savedKeywords}
            onAddKeyword={saveKeyword}
          />
        </div>
      ) : !isLoading && query && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 rounded-full bg-muted/20">
            <Info className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sin resultados</h3>
            <p className="text-muted-foreground">Intenta ajustando la ubicación o el término de búsqueda.</p>
          </div>
        </div>
      )}
    </div>
  );
}
