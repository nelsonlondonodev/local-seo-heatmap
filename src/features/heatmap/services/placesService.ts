import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { getGeoPlaceholders } from '@/util/geoUtils';

/**
 * Service to handle Google Places Autocomplete and Details.
 * Connects to real Google API if key is available, else falls back to mock.
 */
export interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
}

function getMockPlaces(): PlaceSuggestion[] {
  const ph = getGeoPlaceholders();
  const isEs = ph.addressCity.includes('España');
  return [
    {
      placeId: "ChIJ_demo_1",
      name: `${ph.project} (Demo)`,
      address: `Calle de la Moda 123, ${ph.addressCity}`,
      lat: isEs ? 40.4167 : 40.7128,
      lng: isEs ? -3.7037 : -74.0060,
      rating: 4.8,
      userRatingsTotal: 156,
    },
    {
      placeId: "ChIJ_demo_2",
      name: isEs ? "Peluquería & Barbería (Demo)" : "The Barber Shop (Demo)",
      address: `Av. Principal #45-12, ${ph.addressCity}`,
      lat: isEs ? 40.4200 : 40.7150,
      lng: isEs ? -3.7050 : -74.0100,
      rating: 4.5,
      userRatingsTotal: 89,
    },
  ];
}

/**
 * Type for the Google Places API response forwarded by the Edge Function.
 */
interface GooglePlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
}

interface GooglePlacesResponse {
  places?: GooglePlaceResult[];
}

export const placesService = {
  /**
   * Search for businesses using Google Places API (via Edge Function proxy) or Mock.
   */
  async searchPlaces(query: string): Promise<PlaceSuggestion[]> {
    if (!query || query.length < 3) return [];

    // Fallback if demo mode is enabled
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const searchLower = query.toLowerCase();
      return getMockPlaces().filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
      );
    }

    try {
      const data = await invokeEdgeFunction<GooglePlacesResponse>('proxy-places', {
        textQuery: query,
        maxResultCount: 5,
      });

      // Transform V1 response to our domain model
      return (data.places || []).map((place) => ({
        placeId: place.id,
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0,
        rating: place.rating,
        userRatingsTotal: place.userRatingCount,
      }));

    } catch (error) {
      console.error('PLACES_API_ERROR:', error);
      return [];
    }
  },
};
