import { invokeEdgeFunction } from '@/lib/edgeFunctions';

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

const MOCK_PLACES: PlaceSuggestion[] = [
  {
    placeId: "ChIJ_narbo_1",
    name: "Narbo's Salón & Spa (Demo)",
    address: "Calle de la Moda 123, Chía, Colombia",
    lat: 4.8617,
    lng: -74.0531,
    rating: 4.8,
    userRatingsTotal: 156,
  },
  {
    placeId: "ChIJ_barber_2",
    name: "The Barber Shop Chía (Demo)",
    address: "Av. Pradilla #45-12, Chía, Colombia",
    lat: 4.8589,
    lng: -74.0582,
    rating: 4.5,
    userRatingsTotal: 89,
  },
];

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
      return MOCK_PLACES.filter(
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
