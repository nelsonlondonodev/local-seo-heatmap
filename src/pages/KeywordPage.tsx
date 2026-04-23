import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp } from 'lucide-react';
import { KeywordDiscovery } from '@/features/keywords/components/KeywordDiscovery';
import { MonitoringView } from '@/features/keywords/components/MonitoringView';
import { useProjects } from '@/features/keywords/hooks/useProjects';
import { useEffect } from 'react';

interface KeywordPageProps {
  initialTab?: 'discovery' | 'monitoring';
}

export function KeywordPage({ initialTab = 'discovery' }: KeywordPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProjectId = searchParams.get('projectId');
  const { projects, refreshProjects, updateProjectLocal } = useProjects();
  
  const setSelectedProjectId = (id: string | null) => {
    if (id) {
      searchParams.set('projectId', id);
    } else {
      searchParams.delete('projectId');
    }
    setSearchParams(searchParams);
  };

  const isMonitoring = initialTab === 'monitoring';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isMonitoring ? 'Rastreador de Posiciones Orgánicas' : 'Analizador de Mercado & Discovery'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isMonitoring 
            ? 'Monitorea el posicionamiento de tus activos digitales en tiempo real.' 
            : 'Explora nuevas oportunidades, nichos y tendencias de búsqueda.'
          }
        </p>
      </div>

      <div className="animate-in fade-in duration-500">
        {!isMonitoring ? (
          <KeywordDiscovery 
            selectedProjectId={selectedProjectId} 
            setSelectedProjectId={setSelectedProjectId}
            projects={projects}
          />
        ) : (
          <MonitoringView 
            projectId={selectedProjectId} 
            onProjectSelect={setSelectedProjectId}
            projects={projects}
            onProjectUpdate={updateProjectLocal}
            onProjectsRefresh={refreshProjects}
          />
        )}
      </div>
    </div>
  );
}
