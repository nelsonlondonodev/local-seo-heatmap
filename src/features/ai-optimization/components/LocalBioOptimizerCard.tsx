import * as React from 'react';
import { useState } from 'react';
import { 
  Sparkles, RefreshCw, 
  Copy, Check, FileText 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalBioOptimization } from '../hooks/useLocalBioOptimization';
import { toast } from 'sonner';
import type { AITone } from '../types';

interface LocalBioOptimizerCardProps {
  businessName: string;
  category?: string;
  keyword?: string;
}

/**
 * Sub-component for the card header.
 */
function BioHeader() {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          <FileText className="h-3 w-3" />
          Local Bio Optimizer AI ✨
        </Badge>
      </div>
      <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
        Optimización de Descripción GBP
      </CardTitle>
      <CardDescription>
        Mejora tu presencia en Google Maps con una descripción persuasiva y optimizada para SEO local.
      </CardDescription>
    </CardHeader>
  );
}

/**
 * Sub-component for the bio input form.
 */
function BioForm({ 
  currentDescription, setCurrentDescription, 
  businessName, setBusinessName,
  category, setCategory,
  tone, setTone, isGenerating, onGenerate 
}: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">
            Nombre del Negocio
          </label>
          <input 
            type="text"
            className="flex h-12 w-full rounded-xl border border-primary/10 bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">
            Categoría
          </label>
          <input 
            type="text"
            placeholder="Ej: Peluquería, Restaurante..."
            className="flex h-12 w-full rounded-xl border border-primary/10 bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">
          Descripción Actual o Instrucciones
        </label>
        <Textarea 
          placeholder="Pega aquí tu descripción o escribe algo como: 'Somos una peluquería en Madrid especializada en barbas'..." 
          className="min-h-[120px] bg-background/50 border-primary/10 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          value={currentDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">Tono Estratégico</label>
        <Select value={tone} onValueChange={(v) => setTone(v as AITone)}>
          <SelectTrigger className="w-full bg-background/50 border-primary/10 h-12 rounded-xl shadow-sm">
            <SelectValue placeholder="Selecciona un tono" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Profesional y Autoritativo</SelectItem>
            <SelectItem value="persuasive">Persuasivo (Enfocado en Ventas)</SelectItem>
            <SelectItem value="friendly">Cercano y Local</SelectItem>
            <SelectItem value="informational">Descriptivo / Informativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="w-full h-12 px-8 gap-3 font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-[0.98] bg-emerald-600 hover:bg-emerald-700 text-white border-none"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Optimizando Contenido...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generar Bio Optimizada
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Sub-component for the generated result view.
 */
function BioResult({ content, usedKeywords, tone, copied, onCopy, onReset }: any) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="rounded-xl border-2 border-primary/10 bg-background/80 p-5 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1.5">
            {usedKeywords.map((kw: string, i: number) => (
              <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold py-0 h-5">
                {kw}
              </Badge>
            ))}
          </div>
          <Badge variant="outline" className="capitalize text-[10px] font-black tracking-widest border-primary/20">
            {tone}
          </Badge>
        </div>
        
        <p className="text-sm font-medium leading-relaxed text-foreground/90 mb-4 whitespace-pre-wrap border-l-4 border-primary/20 pl-4 py-1">
          {content}
        </p>

        <div className="flex gap-3 pt-4 border-t border-primary/5">
          <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-2 font-bold" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar Bio'}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg gap-2 text-muted-foreground hover:text-primary transition-colors font-bold" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            Probar otro enfoque
          </Button>
        </div>
      </div>

      <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10 flex items-start gap-3">
        <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-3 w-3 text-amber-600 fill-amber-600" />
        </div>
        <p className="text-[11px] text-amber-700/80 leading-tight">
          <strong>Tip SEO:</strong> Asegúrate de que las palabras clave más importantes aparezcan en los primeros 150 caracteres de tu descripción para maximizar la relevancia en búsquedas móviles.
        </p>
      </div>
    </div>
  );
}

/**
 * Main component for Local Bio Optimizer.
 */
export function LocalBioOptimizerCard(props: LocalBioOptimizerCardProps) {
  const {
    businessName, setBusinessName, category, setCategory,
    tone, setTone, currentDescription, setCurrentDescription,
    isGenerating, generatedBio, generate, reset
  } = useLocalBioOptimization(props);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (generatedBio) {
      navigator.clipboard.writeText(generatedBio.content);
      setCopied(true);
      toast.success('Bio copiada');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-emerald-500/5 overflow-hidden relative border-none shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <FileText className="h-24 w-24 text-emerald-500" />
      </div>

      <BioHeader />

      <CardContent className="space-y-6">
        {!generatedBio ? (
          <BioForm 
            {...{ 
              currentDescription, setCurrentDescription, 
              businessName, setBusinessName,
              category, setCategory,
              tone, setTone, isGenerating 
            }}
            onGenerate={generate}
          />
        ) : (
          <BioResult 
            content={generatedBio.content}
            usedKeywords={generatedBio.usedKeywords}
            tone={tone}
            copied={copied}
            onCopy={handleCopy}
            onReset={reset}
          />
        )}
      </CardContent>
    </Card>
  );
}
