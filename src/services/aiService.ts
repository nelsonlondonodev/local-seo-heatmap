import type { AIResponse, GeneratedGBPPost, PostPromptContent } from '@/features/ai-optimization/types';

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres un consultor experto en SEO Local y Copywriting Persuasivo. 
              Tu objetivo es crear publicaciones para el perfil de Google Business (GBP) que aumenten el CTR y mejoren el posicionamiento local.
              Reglas:
              - Tono: ${prompt.tone}.
              - Máximo 1500 caracteres pero idealmente entre 300-600.
              - Usa emojis relevantes.
              - Integra la palabra clave "${prompt.keyword}" de forma natural.
              - Incluye un Call to Action (CTA) potente.
              - Formato de respuesta: Devuelve solo un objeto JSON con los campos: "content" (string con el texto), "hashtags" (array de 4-6 strings).`
            },
            {
              role: 'user',
              content: `Genera una publicación para el negocio "${prompt.businessName}" ubicado en "${prompt.location}". 
              Palabra clave objetivo: "${prompt.keyword}". 
              ${prompt.offer ? `Incluye esta oferta: ${prompt.offer}` : ''}`
            }
          ],
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
  }
};
