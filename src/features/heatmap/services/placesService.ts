/**
 * Service to simulate Google Places Autocomplete and Details.
 * Ready for real API integration later.
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
    name: "Narbo's Salón & Spa",
    address: "Calle de la Moda 123, Chía, Colombia",
    lat: 4.8617,
    lng: -74.0531,
    rating: 4.8,
    userRatingsTotal: 156,
  },
  {
    placeId: "ChIJ_barber_2",
    name: "The Barber Shop Chía",
    address: "Av. Pradilla #45-12, Chía, Colombia",
    lat: 4.8589,
    lng: -74.0582,
    rating: 4.5,
    userRatingsTotal: 89,
  },
  {
    placeId: "ChIJ_beauty_3",
    name: "Beauty Center Profesional",
    address: "C.C. Fontanar Local 204, Chía, Colombia",
    lat: 4.8834,
    lng: -74.0512,
    rating: 4.9,
    userRatingsTotal: 432,
  },
];

export const placesService = {
  /**
   * Search for businesses based on query (mocked autocomplete)
   */
  async searchPlaces(query: string): Promise<PlaceSuggestion[]> {
    if (!query || query.length < 3) return [];
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const searchLower = query.toLowerCase();
    return MOCK_PLACES.filter(
      (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
    );
  },
};
