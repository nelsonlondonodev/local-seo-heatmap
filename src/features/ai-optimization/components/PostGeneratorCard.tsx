import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Check, MessageSquareMore, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiService } from '@/services/aiService';
import type { AITone, GeneratedGBPPost } from '@/features/ai-optimization/types';
import { toast } from 'sonner';

interface PostGeneratorCardProps {
  businessName: string;
  keyword: string;
  location: string;
}

export function PostGeneratorCard({ businessName, keyword, location }: PostGeneratorCardProps) {
  const [tone, setTone] = useState<AITone>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedGBPPost | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const response = await aiService.generateGBPPost({
      businessName,
      keyword,
      location,
      tone
    });

    if (response.data) {
      setGeneratedPost(response.data);
      toast.success('¡Contenido generado con éxito!');
    } else {
      toast.error(response.error || 'Error al generar contenido');
    }
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost.content);
    setCopied(true);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            AI Content Assistant
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
          Generador de Publicaciones GBP
        </CardTitle>
        <CardDescription>
          Crea contenido optimizado para mejorar tu visibilidad en el Local Pack basándote en este análisis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!generatedPost ? (
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tono de voz</label>
              <Select value={tone} onValueChange={(v) => setTone(v as AITone)}>
                <SelectTrigger className="w-full bg-background/50 border-primary/20 h-11">
                  <SelectValue placeholder="Selecciona un tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Profesional y Confiable</SelectItem>
                  <SelectItem value="friendly">Cercano y Amigable</SelectItem>
                  <SelectItem value="persuasive">Persuasivo (Ventas)</SelectItem>
                  <SelectItem value="informational">Informativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generar Post
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-inner relative group">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquareMore className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Sugerencia de Publicación</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{tone}</p>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {generatedPost.content}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {generatedPost.hashtags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-medium text-primary">#{tag}</span>
                ))}
              </div>

              <div className="absolute top-4 right-4 print:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyToClipboard}
                  className="h-8 w-8 rounded-full hover:bg-primary/20 text-primary transition-all shadow-sm active:scale-90"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
               <p className="text-[11px] text-muted-foreground italic flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Contenido optimizado para la palabra clave: <span className="font-bold text-foreground opacity-100">{keyword}</span>
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setGeneratedPost(null)}
                className="text-[11px] h-7 font-bold uppercase tracking-tight gap-1.5 hover:text-primary transition-colors pr-0"
              >
                <RefreshCw className="h-3 w-3" />
                Generar otro diferente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
