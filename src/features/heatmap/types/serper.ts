export interface SerperPlace {
  title: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  ratingCount?: number;
  category?: string;
  cid?: string;
  position?: number;
}

export interface SerperMapsResponse {
  places: SerperPlace[];
  credits?: number;
}
