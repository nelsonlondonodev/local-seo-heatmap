import { motion } from 'framer-motion';
import { Sparkles, Search, MessageSquareMore, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAIHistory } from '@/features/ai-optimization/hooks/useAIHistory';
import { AIContentCard } from '@/features/ai-optimization/components/AIContentCard';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

/**
 * AI Content Library Page.
 */
export function AIHistoryPage() {
  const { user } = useAuth();
  const { filteredHistory, isLoading, searchTerm, setSearchTerm, deleteContent } = useAIHistory(user?.id);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    setIsDeleting(true);
    try {
      await deleteContent(idToDelete);
      setDeleteConfirmOpen(false);
      setIdToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Biblioteca de Contenidos IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y reutiliza todos los copies generados para tus fichas de Google
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por negocio, keyword o contenido..."
          className="pl-10 bg-background/50 border-primary/20 h-11 rounded-xl shadow-sm focus:ring-primary/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHistory.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <AIContentCard 
                item={item} 
                onDelete={() => handleDeleteClick(item.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[2rem] border-2 border-dashed border-border/40"
        >
          <div className="h-20 w-20 bg-background flex items-center justify-center rounded-3xl mb-5 shadow-xl shadow-primary/5">
            <MessageSquareMore className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Sin contenidos generados</h3>
          <p className="text-muted-foreground max-w-sm text-center mt-3 text-lg px-6 leading-relaxed">
            Aún no has generado copys con la IA. Realiza un análisis y usa el asistente para empezar tu biblioteca.
          </p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden rounded-[2rem]">
          <div className="bg-destructive/5 p-8 pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive animate-in zoom-in duration-300">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">¿Eliminar contenido?</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-3 font-medium leading-relaxed px-2">
                Esta acción es <span className="text-destructive font-bold">irreversible</span>. El contenido se borrará permanentemente de tu biblioteca.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <DialogFooter className="p-8 pt-4 flex flex-col gap-3 sm:flex-col sm:space-x-0">
            <Button
              className="w-full rounded-2xl h-14 font-black text-base bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Borrando de la nube...
                </>
              ) : (
                'Sí, eliminar para siempre'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="w-full rounded-2xl h-14 font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              disabled={isDeleting}
            >
              Cancelar, mantener copia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
