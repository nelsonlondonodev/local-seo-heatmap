/** OpenAI Chat Completion message roles */
export type ChatRole = 'system' | 'user' | 'assistant';

/** Multi-modal content part (text or image) */
export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

/** OpenAI Chat Completion message */
export interface ChatMessage {
  role: ChatRole;
  content: string | ContentPart[];
}

/** OpenAI API response shape (subset we use) */
export interface ChatCompletionResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: {
    total_tokens: number;
  };
}
