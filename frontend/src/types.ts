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
  id: number;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  sale_status: string;
  acre_lot?: number | null;
  tour_available: boolean;
  image_source?: string | null;
  date_posted?: string | null;
  realtor_link?: string | null;
  address: Address;
  fairness_rating?: string | null;
  created_at?: string;
  updated_at?: string;
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