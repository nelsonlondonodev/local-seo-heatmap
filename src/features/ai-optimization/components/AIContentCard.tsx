import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Check, Copy, MessageSquareMore } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { StoredAIContent } from '../types';

interface AIContentCardProps {
  item: StoredAIContent;
}

/**
 * Reusable Card component for AI history items.
 */
export function AIContentCard({ item }: AIContentCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <Card className="h-full border-primary/10 hover:border-primary/30 transition-all hover:shadow-md group">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              {item.business_name}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(item.created_at)}
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-tight">
            {item.keyword}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col h-[calc(100%-80px)]">
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4 italic">
            "{item.content}"
          </p>
        </div>
        
        {item.optimized_filename && (
          <div className="mt-4 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 mb-4">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Archivo Optimizado:</p>
            <code className="text-[10px] text-blue-800 break-all">{item.optimized_filename}.jpg</code>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-1">
            {item.hashtags?.map((tag: string, idx: number) => (
              <span key={idx} className="text-[10px] text-primary font-medium">#{tag}</span>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
