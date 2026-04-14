export type AITone = 'professional' | 'friendly' | 'persuasive' | 'informational';

export interface PostPromptContent {
  businessName: string;
  keyword: string;
  location: string;
  tone: AITone;
  offer?: string;
  callToAction?: string;
  image?: string; // Base64 image string for vision analysis
}

export interface GeneratedGBPPost {
  id: string;
  content: string;
  hashtags: string[];
  optimizedFilename?: string; // SEO-friendly filename recommendation
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
