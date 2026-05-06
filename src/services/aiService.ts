import { supabase } from '@/lib/supabase';
import { getErrorMessage } from '@/lib/errors';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { safeJsonParse } from '@/util/jsonUtils';
import type { AIResponse, GeneratedGBPPost, PostPromptContent, StoredAIContent, ReviewReplyPrompt, GeneratedReviewReply, BioOptimizerPrompt, GeneratedBio } from '@/features/ai-optimization/types';
import type { ChatMessage, ContentPart, ChatCompletionResponse } from '@/types/openai';
import type { OpenAiProxyRequest } from '@/types/edge-functions';

/**
 * Internal helper to call OpenAI API via Supabase Edge Function proxy.
 */
async function callOpenAI(messages: ChatMessage[], responseFormat: "json_object" | "text" = "json_object"): Promise<ChatCompletionResponse> {
  return invokeEdgeFunction<ChatCompletionResponse, OpenAiProxyRequest>('proxy-openai', {
    messages,
    response_format: { type: responseFormat },
  });
}

/**
 * Service to handle AI-powered local SEO optimizations.
 */
export const aiService = {
  /**
   * Generates a professional reply to a customer review.
   */
  async generateReviewReply(prompt: ReviewReplyPrompt): Promise<AIResponse<GeneratedReviewReply>> {
    try {
      const messages = [
        {
          role: 'system',
          content: `Eres un experto en atención al cliente y reputación online para negocios locales. 
          Tu objetivo es redactar respuestas a reseñas de clientes que mejoren la imagen del negocio "${prompt.businessName}".
          
          Reglas según la puntuación (${prompt.rating} estrellas):
          - 4-5 estrellas: Agradece sinceramente, muestra entusiasmo y refuerza positivamente la experiencia.
          - 3 estrellas: Sé neutral, agradece el feedback y pregunta sutilmente cómo mejorar.
          - 1-2 estrellas: Sé extremadamente empático y profesional. Nunca seas defensivo. Pide disculpas sinceramente y propón seguir la conversación de forma privada.
          
          Reglas generales:
          - Tono: ${prompt.tone}.
          - IMPORTANTE: Usa un lenguaje natural, cálido y humano. Evita sonar como un bot (ej: usa "Agradecemos tu paciencia" en lugar de "Apreciaremos").
          - Mantén la respuesta breve y concisa.
          - Formato de respuesta: Devuelve solo un objeto JSON con el campo: "content" (texto de la respuesta).`
        },
        {
          role: 'user',
          content: `Reseña del cliente (${prompt.rating} estrellas): "${prompt.reviewText}"`
        }
      ];

      const rawData = await callOpenAI(messages);
      const aiContent = safeJsonParse<{ content: string }>(
        rawData.choices[0].message.content, 
        { content: '' }
      );

      return { 
        data: {
          id: crypto.randomUUID(),
          content: aiContent.content,
          createdAt: new Date().toISOString(),
          metadata: { rating: prompt.rating, tone: prompt.tone }
        },
        usage: { totalTokens: rawData.usage?.total_tokens || 0 }
      };
    } catch (error: unknown) {
      console.error('[AI_REPLY_ERROR]:', error);
      return { error: getErrorMessage(error) || 'No se pudo generar la respuesta a la reseña.' };
    }
  },

  /**
   * Generates an SEO-optimized business description (Bio) for GBP.
   */
  async generateLocalBio(prompt: BioOptimizerPrompt): Promise<AIResponse<GeneratedBio>> {
    try {
      const messages = [
        {
          role: 'system',
          content: `Eres un experto en Copywriting y SEO Local para perfiles de Google Business (GBP). 
          Tu objetivo es redactar la descripción perfecta para el negocio "${prompt.businessName}" (Categoría: "${prompt.category}").
          
          Reglas:
          - Longitud máxima: 750 caracteres.
          - Tono: ${prompt.tone}.
          - Integra de forma orgánica las palabras clave: ${prompt.targetKeywords?.join(', ') || 'relevantes al sector'}.
          - No seas genérico. Enfócate en la propuesta de valor.
          - Si se proporciona una "descripción actual", mejórala pero mantén la esencia del negocio.
          - Formato de respuesta: Devuelve solo un objeto JSON con los campos: "content" (texto de la bio) y "usedKeywords" (array de las keywords integradas).`
        },
        {
          role: 'user',
          content: `Descripción actual: "${prompt.currentDescription || 'No proporcionada'}"`
        }
      ];

      const rawData = await callOpenAI(messages);
      const aiContent = safeJsonParse<{ content: string; usedKeywords?: string[] }>(
        rawData.choices[0].message.content, 
        { content: '', usedKeywords: [] }
      );

      return { 
        data: {
          id: crypto.randomUUID(),
          content: aiContent.content,
          usedKeywords: aiContent.usedKeywords || [],
          createdAt: new Date().toISOString(),
          metadata: { tone: prompt.tone }
        },
        usage: { totalTokens: rawData.usage?.total_tokens || 0 }
      };
    } catch (error: unknown) {
      console.error('[AI_BIO_ERROR]:', error);
      return { error: getErrorMessage(error) || 'No se pudo generar la descripción optimizada.' };
    }
  },

  /**
   * Generates a Google Business Profile post based on provided business context.
   */
  async generateGBPPost(prompt: PostPromptContent): Promise<AIResponse<GeneratedGBPPost>> {
    try {
      const userContent: ContentPart[] = [
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
          image_url: { url: prompt.image }
        });
      }

      const messages = [
        {
          role: 'system',
          content: `Eres un consultor experto en SEO Local y Vision AI. 
          Tu objetivo es crear publicaciones para GBP que aumenten el CTR.
          Reglas:
          - Tono: ${prompt.tone}.
          - Integra la palabra clave "${prompt.keyword}" de forma natural.
          - Analiza la imagen si existe para ser específico.
          - Genera un "optimizedFilename" (slug SEO).
          - Formato de respuesta: Devuelve solo un objeto JSON con los campos: "content", "hashtags", "optimizedFilename".`
        },
        {
          role: 'user',
          content: userContent
        }
      ];

      const rawData = await callOpenAI(messages);
      const aiContent = safeJsonParse<{ content: string; hashtags?: string[]; optimizedFilename?: string }>(
        rawData.choices[0].message.content, 
        { content: '', hashtags: [], optimizedFilename: '' }
      );

      return { 
        data: {
          id: crypto.randomUUID(),
          content: aiContent.content,
          hashtags: aiContent.hashtags || [],
          optimizedFilename: aiContent.optimizedFilename,
          createdAt: new Date().toISOString(),
          metadata: { tone: prompt.tone, keyword: prompt.keyword }
        },
        usage: { totalTokens: rawData.usage?.total_tokens || 0 }
      };
    } catch (error: unknown) {
      console.error('[AI_POST_ERROR]:', error);
      return { error: getErrorMessage(error) || 'Error al generar el post.' };
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('[GET_AI_HISTORY_ERROR]:', error);
      return { error: 'No se pudo cargar el historial de contenidos.' };
    }
  },

  /**
   * Deletes a specific AI-generated content entry.
   */
  async deleteGeneratedContent(contentId: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from('ai_generated_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      return {};
    } catch (error: unknown) {
      console.error('[DELETE_AI_CONTENT_ERROR]:', error);
      return { error: 'No se pudo eliminar el contenido del historial.' };
    }
  }
};
