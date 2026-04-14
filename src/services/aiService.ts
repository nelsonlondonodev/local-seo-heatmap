import { supabase } from '@/lib/supabase';
import type { AIResponse, GeneratedGBPPost, PostPromptContent, StoredAIContent } from '@/features/ai-optimization/types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Service to handle AI-powered local SEO optimizations.
 */
export const aiService = {
  /**
   * Generates a Google Business Profile post based on provided business context.
   */
  async generateGBPPost(prompt: PostPromptContent): Promise<AIResponse<GeneratedGBPPost>> {
    if (!OPENAI_API_KEY) {
      return { error: '⚠️ Por favor, configura VITE_OPENAI_API_KEY en tu archivo .env para usar esta función.' };
    }
    try {
      const messages: any[] = [
        {
          role: 'system',
          content: `Eres un consultor experto en SEO Local y Vision AI. 
          Tu objetivo es crear publicaciones para el perfil de Google Business (GBP) que aumenten el CTR y mejoren el posicionamiento local.
          Reglas:
          - Tono: ${prompt.tone}.
          - Usa emojis relevantes.
          - Integra la palabra clave "${prompt.keyword}" de forma natural.
          - Si se proporciona una imagen, analízala detalladamente para que el copy mencione elementos reales y específicos que se ven en ella. No seas genérico.
          - Incluye un Call to Action (CTA) potente.
          - Genera un "optimizedFilename" que sea una cadena de texto (slug) optimizada para SEO local (ej: peluqueria-madrid-balayage-oferta).
          - Formato de respuesta: Devuelve solo un objeto JSON con los campos: "content" (texto del post), "hashtags" (array), "optimizedFilename" (string).`
        }
      ];

      const userContent: any[] = [
        {
          type: "text",
          text: `Genera una publicación para el negocio "${prompt.businessName}" ubicado en "${prompt.location}". 
          Palabra clave objetivo: "${prompt.keyword}". 
          ${prompt.offer ? `Incluye esta oferta: ${prompt.offer}` : ''}`
        }
      ];

      if (prompt.image) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: prompt.image // Base64 data:image/...
          }
        });
      }

      messages.push({
        role: 'user',
        content: userContent
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API de OpenAI');
      }

      const rawData = await response.json();
      const aiContent = JSON.parse(rawData.choices[0].message.content);

      const post: GeneratedGBPPost = {
        id: crypto.randomUUID(),
        content: aiContent.content,
        hashtags: aiContent.hashtags || [],
        optimizedFilename: aiContent.optimizedFilename,
        createdAt: new Date().toISOString(),
        metadata: {
          tone: prompt.tone,
          keyword: prompt.keyword
        }
      };

      return { 
        data: post,
        usage: { totalTokens: rawData.usage?.total_tokens || 0 }
      };
    } catch (error: any) {
      console.error('[AI_SERVICE_ERROR]:', error);
      return { error: error.message || 'No se pudo conectar con el motor de IA. Revisa tu clave de API.' };
    }
  },

  /**
   * Persists generated AI content to Supabase database.
   */
  async saveGeneratedContent(data: {
    userId: string;
    heatmapId?: string;
    businessName: string;
    keyword: string;
    content: string;
    hashtags: string[];
    optimizedFilename?: string;
  }): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from('ai_generated_content')
        .insert([{
          user_id: data.userId,
          heatmap_id: data.heatmapId,
          business_name: data.businessName,
          keyword: data.keyword,
          content: data.content,
          hashtags: data.hashtags,
          optimized_filename: data.optimizedFilename
        }]);

      if (error) throw error;
      return {};
    } catch (error: any) {
      console.error('[SAVE_AI_CONTENT_ERROR]:', error);
      return { error: 'No se pudo guardar el contenido en el historial.' };
    }
  },

  /**
   * Fetches history of AI-generated content for a specific user.
   */
  async getUserContentHistory(userId: string): Promise<AIResponse<StoredAIContent[]>> {
    try {
      const { data, error } = await supabase
        .from('ai_generated_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as StoredAIContent[] };
    } catch (error: any) {
      console.error('[GET_AI_HISTORY_ERROR]:', error);
      return { error: 'No se pudo cargar el historial de contenidos.' };
    }
  }
};
