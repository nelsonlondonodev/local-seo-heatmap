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
