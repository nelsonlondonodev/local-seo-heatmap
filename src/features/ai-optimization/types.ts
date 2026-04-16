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

export interface ReviewReplyPrompt {
  businessName: string;
  reviewText: string;
  rating: number;
  tone: AITone;
}

export interface GeneratedReviewReply {
  id: string;
  content: string;
  createdAt: string;
  metadata: {
    rating: number;
    tone: AITone;
  };
}

export interface AIResponse<T> {
  data?: T;
  error?: string;
  usage?: {
    totalTokens: number;
  };
}

export interface StoredAIContent {
  id: string;
  user_id: string;
  heatmap_id?: string;
  business_name: string;
  keyword: string;
  content: string;
  hashtags: string[];
  optimized_filename?: string;
  created_at: string;
}
