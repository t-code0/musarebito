export interface FoodInfo {
  restaurant: string;
  local_food: string[];
  nearby_spots: string[];
}

export interface CategorizedPhotos {
  exterior: string | null;
  interior: string | null;
  onsen: string | null;
  sauna: string | null;
  food: string | null;
  drink: string | null;
}

export function isCategorizedPhotos(photos: unknown): photos is CategorizedPhotos {
  return !!photos && typeof photos === "object" && !Array.isArray(photos) && "exterior" in photos;
}

export function getFirstPhoto(photos: string[] | CategorizedPhotos | null): string | null {
  if (!photos) return null;
  if (Array.isArray(photos)) return photos[0] || null;
  return photos.exterior || photos.interior || photos.onsen || photos.sauna || photos.food || photos.drink || null;
}

export interface Sauna {
  id: string;
  place_id: string;
  name: string;
  prefecture: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  phone: string | null;
  website: string | null;
  opening_hours: Record<string, string>[] | null;
  photos: string[] | CategorizedPhotos | null;
  google_reviews: GoogleReview[] | null;
  ai_summary: string | null;
  honmono_score: number | null;
  score_detail: ScoreDetail | null;
  food_info: FoodInfo | null;
  is_closed: boolean;
  cached_at: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

export interface ScoreDetail {
  water_bath: number;
  heat_quality: number;
  outside_air: number;
  cleanliness: number;
  authenticity: number;
  overall: number;
  explanation: string;
  [key: string]: number | string;
}

export interface Review {
  id: string;
  sauna_id: string;
  user_id: string;
  rating: number;
  body: string;
  photo_url: string | null;
  created_at: string;
}

export interface SearchParams {
  query?: string;
  prefecture?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
