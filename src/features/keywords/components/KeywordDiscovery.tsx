import { useState } from 'react';
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectSelector } from './ProjectSelector';
import { DiscoverySearchForm } from './DiscoverySearchForm';
import { DiscoveryResultsTable } from './DiscoveryResultsTable';
import { useKeywordDiscovery } from '../hooks/useKeywordDiscovery';

/**
 * KeywordDiscovery Component (Refactored)
 * Orchestrates the keyword discovery flow using atomic components and hooks.
 */
export function KeywordDiscovery() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    savedKeywords, 
    searchKeywords, 
    saveKeyword 
  } = useKeywordDiscovery(selectedProjectId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchKeywords();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search and Project Selection Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-end justify-between bg-muted/20 p-6 rounded-3xl border border-border/50">
        <DiscoverySearchForm 
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          onSearch={handleSearch}
        />

        <div className="w-full lg:w-auto">
          <ProjectSelector 
            onProjectSelect={setSelectedProjectId} 
            selectedProjectId={selectedProjectId} 
          />
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <DiscoveryResultsTable 
          results={results}
          savedKeywords={savedKeywords}
          onAddKeyword={saveKeyword}
        />
      ) : !isLoading && query && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 rounded-full bg-muted/20">
            <Info className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sin resultados</h3>
            <p className="text-muted-foreground">Intenta con otra búsqueda o parámetros.</p>
          </div>
        </div>
      )}
    </div>
  );
}
