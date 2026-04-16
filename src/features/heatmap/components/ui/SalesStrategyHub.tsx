import { motion } from 'framer-motion';
import { Trophy, Sparkles, Megaphone, MessageSquare, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitorsTable } from './CompetitorsTable';
import { PostGeneratorCard, ReviewReplyCard, LocalBioOptimizerCard } from '@/features/ai-optimization';
import { cleanBusinessName } from '../../utils/textUtils';
import type { Database } from '@/types/database';
import type { CompetitorStat } from '@/types';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];

interface SalesStrategyHubProps {
  heatmap: HeatmapRecord;
  competitors: CompetitorStat[];
  itemVariants: any;
}

/**
 * A unified hub for competitive intelligence and AI-powered sales tools.
 * Grouped to provide a better sales experience for the consultant.
 */
export function SalesStrategyHub({ heatmap, competitors, itemVariants }: SalesStrategyHubProps) {
  const businessName = cleanBusinessName(heatmap.business_name);

  return (
    <motion.div 
      variants={itemVariants} 
      className="space-y-6 pt-6 border-t-2 border-primary/10 mt-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
              Centro de Estrategia & Cierre de Ventas
            </h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Usa estos datos y herramientas para demostrar valor y cerrar el trato con {businessName}
            </p>
          </div>
        </div>
        <Badge className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-bold animate-pulse">
          MODO PROSPECCIÓN ACTIVO 🚀
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Competitive Intelligence (Table) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <CompetitorsTable 
            competitors={competitors}
            targetBusinessName={heatmap.business_name}
            targetPlaceId={heatmap.place_id}
            keyword={heatmap.keyword}
          />
        </div>

        {/* AI Sales Assistant (Toolkit) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bg-primary/5 rounded-2xl p-1 border border-primary/10 shadow-sm border-dashed">
            <div className="p-4 pb-2">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Asistente de Propuestas IA
              </h3>
            </div>
            
            <Tabs defaultValue="posts" className="w-full">
              <div className="px-3">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-background/50">
                  <TabsTrigger value="posts" title="Publicaciones">
                    <Megaphone className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="reviews" title="Reseñas">
                    <MessageSquare className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="bio" title="Bio SEO">
                    <FileText className="h-4 w-4" />
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
                <ReviewReplyCard 
                  businessName={businessName}
                />
              </TabsContent>

              <TabsContent value="bio" className="mt-0">
                <LocalBioOptimizerCard 
                  businessName={businessName}
                  keyword={heatmap.keyword}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
            <p className="text-[11px] leading-relaxed text-muted-foreground italic">
              <strong>Tip de Venta:</strong> Muestra la tabla de competidores al prospecto y usa el generador de posts para demostrar cómo podrías mejorar su visibilidad hoy mismo.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
