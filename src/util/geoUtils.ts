/**
 * Helper to check if the browser environment is running in Spanish.
 */
export function isSpanishBrowser(): boolean {
  if (typeof navigator === 'undefined') return true;
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
  return lang.toLowerCase().startsWith('es');
}

/**
 * Returns the default country ISO code ('es' or 'us').
 */
export function getDefaultCountryCode(): string {
  return isSpanishBrowser() ? 'es' : 'us';
}

/**
 * Returns the default DataForSEO location code (2724 for Spain, 2840 for USA).
 */
export function getDefaultLocationCode(): number {
  return isSpanishBrowser() ? 2724 : 2840;
}

interface GeoPlaceholders {
  city: string;
  domain: string;
  project: string;
  addressCity: string;
}

/**
 * Returns neutral, locale-adapted placeholder strings.
 */
export function getGeoPlaceholders(): GeoPlaceholders {
  const isEs = isSpanishBrowser();
  return {
    city: isEs ? 'Madrid' : 'New York',
    domain: isEs ? 'ej: amazon.es, tudominio.es...' : 'e.g. amazon.com, yourdomain.com...',
    project: isEs ? 'Peluquería Gran Vía' : 'Central Park Barber Shop',
    addressCity: isEs ? 'Madrid, España' : 'New York, NY, USA',
  };
}
