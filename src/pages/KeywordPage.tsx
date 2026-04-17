import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, TrendingUp } from 'lucide-react';
import { KeywordDiscovery } from '@/features/keywords/components/KeywordDiscovery';

/**
 * Keyword Intelligence Page
 * Hub for keyword discovery and rank tracking.
 */
export function KeywordPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Keyword Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Descubre nuevas oportunidades y monitorea tu posicionamiento orgánico en tiempo real.
        </p>
      </div>

      <Tabs defaultValue="discovery" className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl h-auto">
          <TabsTrigger 
            value="discovery" 
            className="rounded-lg px-6 py-2.5 data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground flex gap-2 transition-all"
          >
            <Search className="h-4 w-4" />
            Descubrimiento
          </TabsTrigger>
          <TabsTrigger 
            value="monitoring" 
            className="rounded-lg px-6 py-2.5 data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground flex gap-2 transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            Monitoreo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Buscador de Palabras Clave</CardTitle>
              <CardDescription className="text-base text-muted-foreground/80">
                Analiza volúmenes de búsqueda, dificultad y CPC de cualquier término.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <KeywordDiscovery />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Seguimiento de Posiciones</CardTitle>
              <CardDescription>
                Proyectos y palabras clave en monitoreo constante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-3xl text-muted-foreground">
                Módulo de Monitoreo en construcción...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
