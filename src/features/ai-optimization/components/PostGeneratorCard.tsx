import { useState, useRef } from 'react';
import { Sparkles, Copy, RefreshCw, Check, MessageSquareMore, Wand2, ImagePlus, X, FileSearch } from 'lucide-react';
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
  
  // Image handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('La imagen es demasiado grande. Máximo 10MB.');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const response = await aiService.generateGBPPost({
      businessName,
      keyword,
      location,
      tone,
      image: imagePreview || undefined
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image Upload Area */}
              <div 
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all h-[180px] p-4 relative cursor-pointer
                  ${imagePreview ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40 hover:bg-primary/5'}`}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">Sube una foto real</p>
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">Analizaremos lo que hay en ella para el copy</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Tone Selection */}
              <div className="flex flex-col justify-end gap-4">
                <div className="space-y-2">
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
                  className="h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20 w-full"
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
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* AI SEO Recommendation Section */}
            {generatedPost.optimizedFilename && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <FileSearch className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase text-blue-700 tracking-wider">Tip de SEO Local: Renombrar Imagen</p>
                  <p className="text-xs mt-1 text-blue-800">
                    Antes de subir tu foto a Google, cámbiale el nombre a: 
                    <code className="block mt-1 p-2 bg-blue-100 rounded text-[11px] font-mono border border-blue-200 select-all cursor-copy">
                      {generatedPost.optimizedFilename}.jpg
                    </code>
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-inner relative group">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquareMore className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Copy Optimizado por Visión IA</p>
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
                Basado en tu foto y la palabra clave: <span className="font-bold text-foreground opacity-100">{keyword}</span>
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setGeneratedPost(null)}
                className="text-[11px] h-7 font-bold uppercase tracking-tight gap-1.5 hover:text-primary transition-colors pr-0"
              >
                <RefreshCw className="h-3 w-3" />
                Anlizar otra foto
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
