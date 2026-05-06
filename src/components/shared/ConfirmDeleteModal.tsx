import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Sí, eliminar permanentemente',
  cancelText = 'Cancelar',
  loadingText = 'Eliminando...',
}: ConfirmDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('[CONFIRM_DELETE_MODAL] Error during confirmation:', error);
      // Keep modal open so user can see error toast (handled by parent/hook)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onOpenChange(open)}>
      <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden rounded-[2rem] bg-background/95 backdrop-blur-xl">
        <div className="bg-destructive/5 p-8 pb-4">
          <AnimatePresence mode="wait">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
            >
              <AlertTriangle className="h-8 w-8" />
            </motion.div>
          </AnimatePresence>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-3 font-medium leading-relaxed px-2">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <DialogFooter className="p-8 pt-4 flex flex-col gap-3 sm:flex-col sm:space-x-0">
          <Button
            className="w-full rounded-2xl h-14 font-black text-base bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-2xl h-14 font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
