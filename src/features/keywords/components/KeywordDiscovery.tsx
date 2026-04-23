import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Search as SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { KeywordConfigPanel } from './KeywordConfigPanel';
import { DiscoverySearchForm } from './DiscoverySearchForm';
import { DiscoveryResultsTable } from './DiscoveryResultsTable';
import { useKeywordDiscovery } from '../hooks/useKeywordDiscovery';
import { useProjects } from '../hooks/useProjects';
import type { DataForSeoLocation } from '../types/dataForSeo';

/**
 * KeywordDiscovery Component (Redesigned Flow)
 */
interface KeywordDiscoveryProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  onSwitchToMonitoring?: () => void;
}

/**
 * Atomic Component: Research Mode Banner
 */
function ResearchModeBanner() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary animate-in zoom-in-95 duration-500">
      <div className="p-2 rounded-xl bg-brand-primary/20">
        <SearchIcon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold">Modo Investigación Activo</p>
        <p className="text-xs opacity-80 text-balance">
          Estás explorando palabras clave sin asignarlas a un proyecto. Los resultados no se guardarán automáticamente.
        </p>
      </div>
    </div>
  );
}

/**
 * Atomic Component: Empty State for search
 */
function NoResultsView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="p-6 rounded-full bg-muted/20">
        <Info className="h-12 w-12 text-muted-foreground/30" />
      </div>
      <div>
        <h3 className="text-xl font-bold">Sin resultados</h3>
        <p className="text-muted-foreground">Intenta ajustando la ubicación o el término de búsqueda.</p>
      </div>
    </div>
  );
}

export function KeywordDiscovery({ selectedProjectId, setSelectedProjectId, onSwitchToMonitoring }: KeywordDiscoveryProps) {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<DataForSeoLocation | null>(null);
  const { projects } = useProjects(setSelectedProjectId, selectedProjectId);
  
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    savedKeywords, 
    searchKeywords, 
    saveKeyword,
    clearResults
  } = useKeywordDiscovery(selectedProjectId);

  // Sync location when project changes
  useEffect(() => {
    if (!selectedProjectId) return;

    const project = projects.find(p => p.id === selectedProjectId);
    if (project?.location_code && project?.location_name) {
      setSelectedLocation({
        location_code: project.location_code,
        location_name: project.location_name,
        country_iso_code: project.country_code || '',
        location_type: 'Unknown',
        location_code_parent: null
      });
    }
  }, [selectedProjectId, projects]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void searchKeywords(selectedLocation?.location_code);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!selectedProjectId && <ResearchModeBanner />}

      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-8">
          
          <KeywordConfigPanel 
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

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
              onClear={clearResults}
              hasResults={results.length > 0}
            />
          </div>
        </CardContent>
      </Card>

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
            onAddKeyword={(kw) => { void saveKeyword(kw); }}
            onViewMonitoring={onSwitchToMonitoring || (() => { navigate('/rank-tracker'); })}
          />
        </div>
      ) : !isLoading && query ? (
        <NoResultsView />
      ) : null}
    </div>
  );
}
