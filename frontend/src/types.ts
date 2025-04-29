export interface Address {
  country: string;
  administrative_area: string;
  sub_administrative_area?: string;
  locality: string;
  postal_code: string;
  street: string;
  premise?: string;
  sub_premise?: string;
  latitude: string;
  longitude: string;
  id: number;
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
  created_at?: string;
}