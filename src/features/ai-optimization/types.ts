export type AITone = 'professional' | 'friendly' | 'persuasive' | 'informational';

export interface PostPromptContent {
  businessName: string;
  keyword: string;
  location: string;
  tone: AITone;
  offer?: string;
  callToAction?: string;
}

export interface GeneratedGBPPost {
  id: string;
  content: string;
  hashtags: string[];
  createdAt: string;
  metadata: {
    tone: AITone;
    keyword: string;
  };
}

export interface AIResponse<T> {
  data?: T;
  error?: string;
  usage?: {
    totalTokens: number;
  };
}
