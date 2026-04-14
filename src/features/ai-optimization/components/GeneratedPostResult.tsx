import { Check, Copy, FileSearch, MessageSquareMore, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface GeneratedPostResultProps {
  content: string;
  hashtags: string[];
  optimizedFilename?: string;
  tone: string;
  keyword: string;
  onReset: () => void;
}

/**
 * Atomic component to display the AI generated result.
 */
export function GeneratedPostResult({ 
  content, hashtags, optimizedFilename, tone, keyword, onReset 
}: GeneratedPostResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {optimizedFilename && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-4">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <FileSearch className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase text-blue-700 tracking-wider">Tip de SEO Local: Renombrar Imagen</p>
            <p className="text-xs mt-1 text-blue-800">
              Antes de subir tu foto a Google, cámbiale el nombre a: 
              <code className="block mt-1 p-2 bg-blue-100 rounded text-[11px] font-mono border border-blue-200 select-all cursor-copy">
                {optimizedFilename}.jpg
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
          {content}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
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
          onClick={onReset}
          className="text-[11px] h-7 font-bold uppercase tracking-tight gap-1.5 hover:text-primary transition-colors pr-0"
        >
          <RefreshCw className="h-3 w-3" />
          Analizar otra foto
        </Button>
      </div>
    </div>
  );
}
