import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp } from 'lucide-react';
import { KeywordDiscovery } from '@/features/keywords/components/KeywordDiscovery';
import { MonitoringView } from '@/features/keywords/components/MonitoringView';

export function KeywordPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('discovery');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Keyword Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Descubre nuevas oportunidades y monitorea tu posicionamiento orgánico en tiempo real.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border p-1 rounded-2xl h-auto w-full lg:w-auto shadow-sm">
          <TabsTrigger 
            value="discovery" 
            className="rounded-xl px-10 py-3 data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground flex gap-2 transition-all font-bold"
          >
            <Search className="h-4 w-4" />
            Descubrimiento
          </TabsTrigger>
          <TabsTrigger 
            value="monitoring" 
            className="rounded-xl px-10 py-3 data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground flex gap-2 transition-all font-bold"
          >
            <TrendingUp className="h-4 w-4" />
            Monitoreo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="animate-in fade-in slide-in-from-left-4 duration-500 m-0">
          <KeywordDiscovery 
            selectedProjectId={selectedProjectId} 
            setSelectedProjectId={setSelectedProjectId} 
            onSwitchToMonitoring={() => setActiveTab('monitoring')}
          />
        </TabsContent>

        <TabsContent value="monitoring" className="animate-in fade-in slide-in-from-right-4 duration-500 m-0">
          <MonitoringView projectId={selectedProjectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
