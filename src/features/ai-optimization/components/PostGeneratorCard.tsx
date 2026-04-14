import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIContentGeneration } from '../hooks/useAIContentGeneration';
import { ImageUploader } from './ImageUploader';
import { GeneratedPostResult } from './GeneratedPostResult';
import type { AITone } from '../types';

interface PostGeneratorCardProps {
  businessName: string;
  keyword: string;
  location: string;
  heatmapId?: string;
}

/**
 * Main component for AI Post Generation.
 * Refactored with the precision of a surgeon:
 * - Logic extracted to useAIContentGeneration hook.
 * - Image uploading decoupled to ImageUploader.
 * - Results rendering decoupled to GeneratedPostResult.
 */
export function PostGeneratorCard(props: PostGeneratorCardProps) {
  const {
    tone, setTone, isGenerating, generatedPost, imagePreview,
    handleImageSelect, removeImage, generate, reset
  } = useAIContentGeneration(props);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden relative border-none shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            AI Local Vision Assistant 👁️
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
          Generador Multimedia de Posts
        </CardTitle>
        <CardDescription>
          Sube una foto de tu negocio y la IA analizará su contenido para crear el copy perfecto y un nombre de archivo optimizado.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!generatedPost ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploader 
                imagePreview={imagePreview} 
                onImageSelect={handleImageSelect} 
                onRemove={removeImage} 
              />

              <div className="flex flex-col justify-end gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">Tono de voz</label>
                  <Select value={tone} onValueChange={(v) => setTone(v as AITone)}>
                    <SelectTrigger className="w-full bg-background/50 border-primary/20 h-12 rounded-xl shadow-sm">
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
                  onClick={generate} 
                  disabled={isGenerating}
                  className="h-12 px-8 gap-3 font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analizando y Generando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Procesar con IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <GeneratedPostResult 
            content={generatedPost.content}
            hashtags={generatedPost.hashtags}
            optimizedFilename={generatedPost.optimizedFilename}
            tone={tone}
            keyword={props.keyword}
            onReset={reset}
          />
        )}
      </CardContent>
    </Card>
  );
}
