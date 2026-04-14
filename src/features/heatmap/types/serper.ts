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

export interface SerperAd {
  position: number;
  title: string;
  link: string;
  snippet?: string;
}

export interface SerperMapsResponse {
  places: SerperPlace[];
  credits?: number;
}

export interface SerperSearchResponse {
  ads?: SerperAd[];
  credits?: number;
}
