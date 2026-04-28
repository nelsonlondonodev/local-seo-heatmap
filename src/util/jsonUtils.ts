/**
 * Safely parses a JSON string into a specific type T.
 * Provides a fallback if parsing fails or the result is invalid.
 */
export function safeJsonParse<T>(text: string | null | undefined, fallback: T): T {
  if (!text) return fallback;
  
  try {
    const parsed = JSON.parse(text);
    
    // Ensure we don't return null if the fallback isn't null, 
    // and check if it's an object/array as expected for AI responses.
    if (parsed === null || typeof parsed !== 'object') {
      return fallback;
    }
    
    return parsed as T;
  } catch (error) {
    console.error('[JSON_PARSE_ERROR]: Failed to parse JSON string:', text);
    return fallback;
  }
}
