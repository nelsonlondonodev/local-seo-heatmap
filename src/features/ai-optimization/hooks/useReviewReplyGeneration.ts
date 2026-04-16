import { useState } from 'react';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';
import type { AITone, GeneratedReviewReply } from '../types';

interface UseReviewReplyGenerationProps {
  businessName: string;
}

/**
 * Hook to manage review reply generation logic.
 */
export function useReviewReplyGeneration({ businessName }: UseReviewReplyGenerationProps) {
  const [tone, setTone] = useState<AITone>('professional');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<GeneratedReviewReply | null>(null);

  const generate = async () => {
    if (!reviewText.trim()) {
      toast.error('Por favor, pega el texto de la reseña.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateReviewReply({
        businessName,
        reviewText,
        rating,
        tone
      });

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        setGeneratedReply(response.data);
        toast.success('¡Respuesta generada con éxito!');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado al generar la respuesta.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setGeneratedReply(null);
    setReviewText('');
    setRating(5);
  };

  return {
    tone,
    setTone,
    rating,
    setRating,
    reviewText,
    setReviewText,
    isGenerating,
    generatedReply,
    generate,
    reset
  };
}
