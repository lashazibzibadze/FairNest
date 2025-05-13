export interface Address {
  id: number;
  country: string;
  administrative_area: string;
  sub_administrative_area?: string | null;
  locality: string;
  postal_code: string;
  street: string;
  premise?: string | null;
  sub_premise?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Listing {
  id: number
  user_id: string
  price: number
  bedrooms?: number | null
  bathrooms?: number | null
  square_feet?: number | null
  sale_status: string
  acre_lot?: number | null
  tour_available: boolean
  image_source?: string | null;
  date_posted?: string | null;
  realtor_link?: string | null;
  fairness_rating?: FairnessRating | null;
  fairness_rating_updated_at?: string
  created_at?: string
  updated_at?: string
  address: Address
}

export interface ListingsResponse {
  listings: Listing[];
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface Filters {
  country?: string;
  postal_code?: string;
  street?: string;
  administrative_area?: string;
  locality?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  homeType?: string;
  homeTypes?: string[];
  addressQuery?: string;
}

export interface AddressInput {
  country: string;
  administrative_area: string;
  sub_administrative_area?: string;
  locality: string;
  postal_code: string;
  street: string;
  premise?: string;
  sub_premise?: string;
  latitude?: number;
  longitude?: number;
}

export interface ListingInput {
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  sale_status: string;
  acre_lot?: number;
  tour_available: boolean;
  image_source?: string;
  realtor_link?: string;
  address: AddressInput;
}

export type FairnessRating = "fraud" | "bad" | "fair" | "good"

export interface PaginatedResponse<T> {
  listings: T[]
  total_records: number
  total_pages: number
  current_page: number
  page_size: number
}

export type Favorite = {
  id: number;
  user_id: string;
  listing_id: number;
  created_at: string;
  updated_at: string;
  listing: Listing;
};
