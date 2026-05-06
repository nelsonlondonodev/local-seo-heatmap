import { motion } from 'framer-motion';
import { Sparkles, Search, MessageSquareMore, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAIHistory } from '@/features/ai-optimization/hooks/useAIHistory';
import { AIContentCard } from '@/features/ai-optimization/components/AIContentCard';
import { useState } from 'react';
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal';

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

      <ConfirmDeleteModal 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (idToDelete) {
            await deleteContent(idToDelete);
            setIdToDelete(null);
          }
        }}
        title="¿Eliminar contenido?"
        description={
          <>
            Esta acción es <span className="text-destructive font-bold">irreversible</span>. El contenido se borrará permanentemente de tu biblioteca.
          </>
        }
        confirmText="Sí, eliminar para siempre"
        loadingText="Borrando de la nube..."
      />
    </motion.div>
  );
}
