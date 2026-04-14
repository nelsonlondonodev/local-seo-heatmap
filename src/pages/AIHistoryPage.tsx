import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Copy, Check, MessageSquareMore, Calendar, Store, Tag, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function AIHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      setIsLoading(true);
      const response = await aiService.getUserContentHistory(user.id);
      if (response.data) {
        setHistory(response.data);
      } else {
        toast.error(response.error || 'Error al cargar el historial');
      }
      setIsLoading(false);
    }
    loadHistory();
  }, [user]);

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item => 
    item.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Biblioteca de Contenidos IA
          </h1>
          <p className="text-muted-foreground">
            Gestiona y reutiliza todos los copies generados para tus fichas de Google
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por negocio, keyword o contenido..."
          className="pl-10 bg-background/50 border-primary/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHistory.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
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
                      onClick={() => copyToClipboard(item.id, item.content)}
                      className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                    >
                      {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border/60">
          <div className="h-16 w-16 bg-secondary flex items-center justify-center rounded-2xl mb-4">
            <MessageSquareMore className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">Sin contenidos generados</h3>
          <p className="text-muted-foreground max-w-xs text-center mt-2">
            Aún no has generado copys con la IA. Realiza un análisis y usa el asistente para empezar tu biblioteca.
          </p>
        </div>
      )}
    </motion.div>
  );
}
