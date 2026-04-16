import * as React from 'react';
import { useState } from 'react';
import { MessageSquare, RefreshCw, Wand2, Star, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReviewReplyGeneration } from '../hooks/useReviewReplyGeneration';
import { toast } from 'sonner';
import type { AITone } from '../types';

interface ReviewReplyCardProps {
  businessName: string;
}

/**
 * Sub-component for the card header.
 */
function ReviewReplyHeader() {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="h-3 w-3" />
          Review Reply Assistant AI 🤖
        </Badge>
      </div>
      <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
        Gestión de Reputación Local
      </CardTitle>
      <CardDescription>
        Pega la reseña de un cliente y la IA generará una respuesta profesional, empática y optimizada para tu negocio.
      </CardDescription>
    </CardHeader>
  );
}

/**
 * Sub-component for the review input form.
 */
function ReviewReplyForm({ 
  reviewText, setReviewText, rating, setRating, tone, setTone, isGenerating, onGenerate 
}: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">
          Texto de la Reseña
        </label>
        <Textarea 
          placeholder="Ej: 'Me encantó el servicio, muy profesionales y puntuales...'" 
          className="min-h-[120px] bg-background/50 border-primary/10 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          value={reviewText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">Calificación</label>
          <div className="flex gap-1 h-12 items-center bg-background/50 rounded-xl border border-primary/10 px-3 justify-between">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-90 hover:scale-110"
              >
                <Star 
                  className={`h-6 w-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-muted-foreground/70 ml-1 tracking-widest">Tono de respuesta</label>
          <Select value={tone} onValueChange={(v) => setTone(v as AITone)}>
            <SelectTrigger className="w-full bg-background/50 border-primary/10 h-12 rounded-xl shadow-sm">
              <SelectValue placeholder="Selecciona un tono" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profesional y Empático</SelectItem>
              <SelectItem value="friendly">Cercano y Amigable</SelectItem>
              <SelectItem value="persuasive">Persuasivo</SelectItem>
              <SelectItem value="informational">Informativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating || !reviewText.trim()}
        className="w-full h-12 px-8 gap-3 font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Redactando Respuesta...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Generar Respuesta sugerida
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Sub-component for the generated result view.
 */
function ReviewReplyResult({ content, rating, tone, copied, onCopy, onReset }: any) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="rounded-xl border-2 border-primary/10 bg-background/80 p-5 relative group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-3 w-3 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
            ))}
          </div>
          <Badge variant="secondary" className="capitalize text-[10px] font-black tracking-widest">
            {tone}
          </Badge>
        </div>
        
        <p className="text-sm font-medium leading-relaxed italic text-foreground/90 mb-4 whitespace-pre-wrap">
          {content}
        </p>

        <div className="flex gap-3 pt-4 border-t border-primary/5">
          <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-2 font-bold" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar Respuesta'}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg gap-2 text-muted-foreground hover:text-primary transition-colors font-bold" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            Nueva Respuesta
          </Button>
        </div>
      </div>

      <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10 flex items-start gap-3">
        <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Star className="h-3 w-3 text-blue-500 fill-blue-500" />
        </div>
        <p className="text-[11px] text-blue-700/80 leading-tight">
          <strong>Consejo de Reputación:</strong> Responder a todas las reseñas demuestra compromiso y mejora el SEO local.
        </p>
      </div>
    </div>
  );
}

/**
 * Main component for AI Review Reply Generation.
 */
export function ReviewReplyCard({ businessName }: ReviewReplyCardProps) {
  const {
    tone, setTone, rating, setRating, reviewText, setReviewText,
    isGenerating, generatedReply, generate, reset
  } = useReviewReplyGeneration({ businessName });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply.content);
      setCopied(true);
      toast.success('Respuesta copiada');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-secondary/5 overflow-hidden relative border-none shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <MessageSquare className="h-24 w-24 text-primary" />
      </div>

      <ReviewReplyHeader />

      <CardContent className="space-y-6">
        {!generatedReply ? (
          <ReviewReplyForm 
            {...{ reviewText, setReviewText, rating, setRating, tone, setTone, isGenerating }}
            onGenerate={generate}
          />
        ) : (
          <ReviewReplyResult 
            content={generatedReply.content}
            rating={rating}
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
