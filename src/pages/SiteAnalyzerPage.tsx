import { useState, useRef } from 'react';
import { toast } from 'sonner';

// Service & Types
import { dataForSeoService } from '@/features/keywords/services/dataForSeoService';
import type { DomainRankOverview, RankedKeywordItem } from '@/features/keywords/types/dataForSeo';

// Atomic Components
import { DomainSearchForm } from '@/features/keywords/components/site-analyzer/DomainSearchForm';
import { SiteOverviewCards } from '@/features/keywords/components/site-analyzer/SiteOverviewCards';
import { RankedKeywordsTable } from '@/features/keywords/components/site-analyzer/RankedKeywordsTable';
import { SiteAnalyzerEmptyState } from '@/features/keywords/components/site-analyzer/SiteAnalyzerEmptyState';

// Utils
import { cleanDomain } from '@/features/keywords/util/domainUtils';

export function SiteAnalyzerPage() {
  // State
  const [targetUrl, setTargetUrl] = useState('');
  const [locationCode, setLocationCode] = useState<number>(2724); // Default: Spain
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [overview, setOverview] = useState<DomainRankOverview | null>(null);
  const [keywords, setKeywords] = useState<RankedKeywordItem[]>([]);
  const isAnalyzingRef = useRef(false);

  /**
   * Triggers the domain analysis process.
   */
  const handleAnalyze = async () => {
    if (!targetUrl.trim() || isAnalyzing || isAnalyzingRef.current) {
      return;
    }

    const domain = cleanDomain(targetUrl);

    // Safety check for API consumption
    const confirmMsg = `¿Confirmas analizar el dominio "${domain}"? Esto consumirá créditos de la API de DataForSEO.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    // Lock sychronously
    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    setHasSearched(false);
    setOverview(null);
    setKeywords([]);

    try {
      // Execute requests in parallel for maximum performance
      const [overviewData, keywordsData] = await Promise.all([
        dataForSeoService.getDomainRankOverview(domain, locationCode),
        dataForSeoService.getDomainRankedKeywords(domain, locationCode)
      ]);

      setOverview(overviewData);
      setKeywords(keywordsData);
      
      toast.success('Análisis completado con éxito.');
    } catch (error) {
      console.error('[SITE_ANALYZER] Error analyzing domain:', error);
      toast.error('Hubo un error al analizar el dominio. Revisa la consola para más detalles.');
    } finally {
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
      setHasSearched(true);
    }
  };

  // Helper to check if results were found
  const hasResults = (overview?.metrics?.organic) || (keywords.length > 0);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Explorador de Dominios</h1>
        <p className="text-muted-foreground text-lg">
          Analiza cualquier sitio web para ver su tráfico estimado y las palabras clave por las que posiciona.
        </p>
      </div>

      {/* Main search form */}
      <DomainSearchForm 
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        locationCode={locationCode}
        setLocationCode={setLocationCode}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
      />

      {/* Results Section */}
      {overview && <SiteOverviewCards overview={overview} />}
      
      {keywords.length > 0 && <RankedKeywordsTable keywords={keywords} />}

      {/* Empty state fallback */}
      {hasSearched && !isAnalyzing && !hasResults && <SiteAnalyzerEmptyState />}
    </div>
  );
}
