import { motion, type Variants } from 'framer-motion';
import { Trophy, Sparkles, Megaphone, MessageSquare, FileText, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CompetitorsTable } from './CompetitorsTable';
import { PostGeneratorCard, ReviewReplyCard, LocalBioOptimizerCard } from '@/features/ai-optimization';
import { cleanBusinessName } from '../../utils/textUtils';
import type { Database } from '@/types/database';
import type { CompetitorStat } from '@/types';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];

interface SalesStrategyHubProps {
  heatmap: HeatmapRecord;
  competitors: CompetitorStat[];
  itemVariants: Variants;
}

/**
 * Intelligence Insight Pill
 */
function InsightPill({ 
  icon: Icon, 
  title, 
  description, 
  type = 'info' 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  type?: 'info' | 'warning' | 'success';
}) {
  const styles = {
    info: "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950",
    warning: "border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-500 bg-white dark:bg-zinc-950",
    success: "border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-500 bg-white dark:bg-zinc-950"
  };

  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl shadow-none", styles[type])}>
      <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0 text-zinc-950 dark:text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h4 className="text-[11px] font-black uppercase tracking-wider text-foreground mb-1">{title}</h4>
        <p className="text-[10px] opacity-80 leading-tight font-medium">{description}</p>
      </div>
    </div>
  );
}

export function SalesStrategyHub({ heatmap, competitors, itemVariants }: SalesStrategyHubProps) {
  const businessName = cleanBusinessName(heatmap.business_name);
  
  // Intelligence Logic
  const leader = competitors[0];
  const totalCompetitors = competitors.length;

  return (
    <motion.div 
      variants={itemVariants} 
      className="space-y-6 pt-8 border-t-2 border-zinc-800/50 mt-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
            <Trophy className="h-6 w-6 text-zinc-950 dark:text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Centro de Estrategia
            </h2>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-[0.2em] mt-0.5">
              Inteligencia competitiva para cerrar a {businessName}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 px-4 py-1.5 font-bold text-[10px] tracking-widest shadow-none">
          MODO CIERRE ACTIVADO
        </Badge>
      </div>

      {/* Intelligence Pills Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightPill 
          type="warning"
          icon={Sparkles}
          title="Punto Ciego Detectado"
          description="Existe una brecha crítica de visibilidad en el sector periférico del grid. Los clientes potenciales no te encuentran fuera del núcleo."
        />
        <InsightPill 
          type="info"
          icon={Megaphone}
          title="Oportunidad de Oro"
          description={`${leader?.name || 'El líder'} domina el centro, pero su volumen de reseñas es vulnerable. Una campaña agresiva podría superarlo.`}
        />
        <InsightPill 
          type="success"
          icon={Target}
          title="Fuerza de Marca"
          description={`Hemos analizado ${totalCompetitors} competidores. Tu potencial de conversión es alto si optimizamos el Local Pack.`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Competitive Intelligence (Table) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden rounded-xl">
            <CompetitorsTable 
              competitors={competitors}
              targetBusinessName={heatmap.business_name}
              targetPlaceId={heatmap.place_id}
              keyword={heatmap.keyword}
            />
          </Card>
        </div>

        {/* AI Sales Assistant (Toolkit) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bg-white dark:bg-zinc-950 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800 shadow-none">
            <div className="p-4 pb-2">
              <h3 className="text-[11px] font-semibold uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Kit de Persuasión IA
              </h3>
            </div>
            
            <Tabs defaultValue="posts" className="w-full">
              <div className="px-3">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-zinc-50 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <TabsTrigger value="posts" className="flex gap-2 items-center rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white transition-all h-8 shadow-none border border-transparent data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800">
                    <Megaphone className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex gap-2 items-center rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white transition-all h-8 shadow-none border border-transparent data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase">Reseñas</span>
                  </TabsTrigger>
                  <TabsTrigger value="bio" className="flex gap-2 items-center rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white transition-all h-8 shadow-none border border-transparent data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase">BIO</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posts" className="mt-0">
                <PostGeneratorCard 
                  businessName={businessName}
                  keyword={heatmap.keyword}
                  location="tu zona local"
                  heatmapId={heatmap.id}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ReviewReplyCard businessName={businessName} />
              </TabsContent>

              <TabsContent value="bio" className="mt-0">
                <LocalBioOptimizerCard 
                  businessName={businessName}
                  keyword={heatmap.keyword}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 shadow-none">
            <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic">
              <strong className="text-zinc-950 dark:text-white not-italic font-semibold">Tip de Cierre:</strong> Utiliza el "Punto Ciego" para generar urgencia. Muestra cómo sus clientes están terminando en la competencia por falta de optimización local.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
