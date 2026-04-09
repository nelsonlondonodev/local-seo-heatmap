const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

export const placesService = {
  /**
   * Search for businesses using Google Places API (New V1 version) or Mock
   */
  async searchPlaces(query: string): Promise<PlaceSuggestion[]> {
    if (!query || query.length < 3) return [];

    // Fallback if no API Key provided
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_google_maps_api_key_here') {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const searchLower = query.toLowerCase();
      return MOCK_PLACES.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
      );
    }

    try {
      // Using Google Places API (New Search v1)
      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
          },
          body: JSON.stringify({
            textQuery: query,
            maxResultCount: 5,
          }),
        }
      );

      if (!response.ok) throw new Error('Error en Google Places API');

      const data = await response.json();
      
      // Define a loose but strict-friendly type for the Google API response chunk we care about
      interface GooglePlaceResult {
        id: string;
        displayName?: { text: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
        rating?: number;
        userRatingCount?: number;
      }

      // Transform V1 response to our domain model
      return (data.places || []).map((place: GooglePlaceResult) => ({
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
