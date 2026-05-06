import { useState } from 'react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { fileToBase64, validateImageSize } from '@/util/imageUtils';
import type { AITone, GeneratedGBPPost } from '../types';
import { toast } from 'sonner';

interface UseAIContentGenerationProps {
  businessName: string;
  keyword: string;
  location: string;
  heatmapId?: string;
}

/**
 * Custom hook to encapsulate the AI content generation lifecycle.
 * Atomic, specific, and decoupled from the UI.
 */
export function useAIContentGeneration({ businessName, keyword, location, heatmapId }: UseAIContentGenerationProps) {
  const { user } = useAuth();
  const [tone, setTone] = useState<AITone>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedGBPPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    if (!validateImageSize(file)) {
      toast.error('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (err) {
      toast.error('Error al procesar la imagen');
    }
  };

  const removeImage = () => setImagePreview(null);

  const reset = () => {
    setGeneratedPost(null);
    setImagePreview(null);
  };

  const generate = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para generar contenido');
      return;
    }

    setIsGenerating(true);
    try {
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
        
        // Auto-save logic
        await aiService.saveGeneratedContent({
          userId: user.id,
          heatmapId,
          businessName: businessName,
          keyword,
          content: response.data.content,
          hashtags: response.data.hashtags,
          optimizedFilename: response.data.optimizedFilename
        });
        toast.success('Guardado en el historial');
      } else {
        toast.error(response.error || 'Error al generar contenido');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    tone,
    setTone,
    isGenerating,
    generatedPost,
    imagePreview,
    handleImageSelect,
    removeImage,
    generate,
    reset
  };
}
