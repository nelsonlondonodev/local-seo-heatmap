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
  icon: any; 
  title: string; 
  description: string; 
  type?: 'info' | 'warning' | 'success';
}) {
  const styles = {
    info: "bg-blue-500/5 border-blue-500/20 text-blue-400",
    warning: "bg-rose-500/5 border-rose-500/20 text-rose-400",
    success: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
  };

  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm", styles[type])}>
      <div className="h-8 w-8 rounded-lg bg-current opacity-20 flex items-center justify-center shrink-0">
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
  const isWeakened = competitors.some(c => c.rank === 1 && c.reviews_count < 20);

  return (
    <motion.div 
      variants={itemVariants} 
      className="space-y-6 pt-8 border-t-2 border-zinc-800/50 mt-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Centro de Estrategia Dorado
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
              Inteligencia competitiva para cerrar a {businessName}
            </p>
          </div>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 font-black text-[10px] tracking-widest shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
          MODO CIERRE ACTIVADO ⚡
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
          <Card className="bg-zinc-950/40 border-zinc-800 shadow-2xl overflow-hidden">
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
          <div className="bg-primary/5 rounded-2xl p-1 border border-primary/20 shadow-xl backdrop-blur-sm">
            <div className="p-4 pb-2">
              <h3 className="text-[11px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Kit de Persuasión IA
              </h3>
            </div>
            
            <Tabs defaultValue="posts" className="w-full">
              <div className="px-3">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-zinc-950/50 p-1 border border-zinc-800">
                  <TabsTrigger value="posts" className="flex gap-2 items-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all h-8">
                    <Megaphone className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex gap-2 items-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all h-8">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase">Reseñas</span>
                  </TabsTrigger>
                  <TabsTrigger value="bio" className="flex gap-2 items-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all h-8">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase">BIO</span>
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

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-inner">
            <p className="text-[10px] leading-relaxed text-zinc-400 font-medium italic">
              <strong className="text-primary not-italic">Tip de Cierre:</strong> Utiliza el "Punto Ciego" para generar urgencia. Muestra cómo sus clientes están terminando en la competencia por falta de optimización local.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
