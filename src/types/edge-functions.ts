import type { ChatMessage } from './openai.ts';

/**
 * Shared Request/Response contracts for Supabase Edge Functions.
 * These ensure the frontend and backend proxies are perfectly synced.
 */

/**
 * proxy-openai Contract
 */
export interface OpenAiProxyRequest {
  messages: ChatMessage[];
  response_format?: { type: 'json_object' | 'text' };
  model?: string;
  temperature?: number;
}

/**
 * proxy-dataforseo Contract
 */
export interface DataForSeoProxyRequest {
  endpoint: string;
  payload?: unknown;
  method?: 'GET' | 'POST';
}

/**
 * proxy-serper Contract
 */
export interface SerperProxyRequest {
  q: string;
  gl?: string;
  hl?: string;
  type?: 'search' | 'places';
  location?: string;
  num?: number;
}

/**
 * proxy-places Contract (Google Places API)
 */
export interface PlacesProxyRequest {
  input: string;
  location?: { lat: number; lng: number };
  radius?: number;
}
