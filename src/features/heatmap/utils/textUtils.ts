/**
 * Normalizes text for fuzzy matching: lowercase, removes accents, trims.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if a search result matches the configured business based on name or CID.
 */
export function isBusinessMatch(
  configName: string,
  resultTitle: string,
  configPlaceId?: string,
  resultCid?: string
): boolean {
  const normConfig = normalizeText(configName);
  const normResult = normalizeText(resultTitle);

  // Match by CID if available
  const cidMatch = configPlaceId && resultCid && String(configPlaceId).includes(String(resultCid));

  // Match by partial name
  return normResult.includes(normConfig) || normConfig.includes(normResult) || !!cidMatch;
}

/**
 * Checks if a business title matches any of the detected advertiser titles.
 */
export function isAdvertiser(
  businessTitle: string,
  advertisers: string[]
): boolean {
  if (!advertisers.length) return false;
  
  const normTitle = normalizeText(businessTitle);
  
  return advertisers.some(adTitle => {
    const normAd = normalizeText(adTitle);
    // Fuzzy match: either one contains the other
    return normTitle.includes(normAd) || normAd.includes(normTitle);
  });
}

/**
 * Surgically cleans business names by removing common SEO suffixes.
 * e.g. "Malanga del trópico | Medellín" -> "Malanga del trópico"
 */
export function cleanBusinessName(name: string): string {
  if (!name) return '';
  
  // 1. Split by common separators and take the first part
  const separators = [' | ', ' - ', ' – ', ' l ', ' : '];
  let cleaned = name;
  
  for (const sep of separators) {
    if (cleaned.includes(sep)) {
      cleaned = cleaned.split(sep)[0];
    }
  }

  // 2. Remove city/airport suffixes often used in SEO (e.g., .mde, .bog, .mad)
  // Logic: a dot followed by 3 letters at the end of a word
  cleaned = cleaned.replace(/\.[a-z]{3}\b/gi, '');
  
  // 3. Remove trailing location indicators (accent-insensitive)
  const locations = ['poblado', 'medellin', 'bogota', 'madrid', 'barcelona'];
  for (const loc of locations) {
    // We normalize the end of the string to check for the location without accents
    const parts = cleaned.split(' ');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (normalizeText(lastPart) === loc) {
        parts.pop();
        cleaned = parts.join(' ');
      }
    }
  }
  
  return cleaned.trim();
}
