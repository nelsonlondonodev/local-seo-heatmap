import { useState } from 'react';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';
import type { AITone, GeneratedBio } from '../types';

interface UseLocalBioOptimizationProps {
  businessName: string;
  category?: string;
  keyword?: string;
}

/**
 * Hook to manage local bio optimization logic.
 */
export function useLocalBioOptimization({ businessName: initialName, category: initialCategory = '', keyword = '' }: UseLocalBioOptimizationProps) {
  const [businessName, setBusinessName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [tone, setTone] = useState<AITone>('professional');
  const [currentDescription, setCurrentDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<GeneratedBio | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateLocalBio({
        businessName,
        category,
        currentDescription,
        targetKeywords: keyword ? [keyword] : [],
        tone
      });

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        setGeneratedBio(response.data);
        toast.success('¡Bio optimizada con éxito!');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado al generar la Bio.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setGeneratedBio(null);
  };

  return {
    businessName,
    setBusinessName,
    category,
    setCategory,
    tone,
    setTone,
    currentDescription,
    setCurrentDescription,
    isGenerating,
    generatedBio,
    generate,
    reset
  };
}
