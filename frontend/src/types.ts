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
    address: Address;
}