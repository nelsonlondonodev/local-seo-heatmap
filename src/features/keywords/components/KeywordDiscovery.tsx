import { useState, useEffect, type FormEvent } from 'react';
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
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  onSwitchToMonitoring?: () => void;
}

export function KeywordDiscovery({ selectedProjectId, setSelectedProjectId, onSwitchToMonitoring }: KeywordDiscoveryProps) {
  const [selectedLocation, setSelectedLocation] = useState<DataForSeoLocation | null>(null);
  
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
      
      // Robust Type Narrowing: Extract to constants to satisfy TS
      const code = project?.location_code;
      const name = project?.location_name;
      const country = project?.country_code;

      if (code && name) {
        setSelectedLocation({
          location_code: code,
          location_name: name,
          country_iso_code: country || '',
          location_type: 'Unknown',
          location_code_parent: null
        });
      }
    }
  }, [selectedProjectId, projects]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchKeywords(selectedLocation?.location_code);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Configuration Panel */}
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
            onViewMonitoring={onSwitchToMonitoring}
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
