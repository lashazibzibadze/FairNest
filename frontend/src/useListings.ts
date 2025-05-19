import { useQuery } from "@tanstack/react-query";
import { Filters } from "./types";

// main function to fetch listings from the backend + filtering
export const useListings = (currentPage: number, filters: Filters) => {
  const fetchListings = async () => {
    const limit = 24;
    const skip = (currentPage - 1) * limit;

    const params: Record<string, string> = {
      skip: skip.toString(),
      limit: limit.toString(),
    };

    // min and max prices
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;

    // min bedrooms and bathrooms
    if (filters.bedrooms) params.min_bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.min_bathrooms = filters.bathrooms;

    // address filters
    if (filters.postal_code) params.postal_code = filters.postal_code;
    if (filters.locality) params.locality = filters.locality;
    if (filters.street) params.street = filters.street;

    if (filters.premise) params.premise = filters.premise;

    // home type
    if (filters.homeType) {
      params.sale_status = filters.homeType;
    }

    const queryString = new URLSearchParams(params).toString();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const url = `${backendURL}/listings?${queryString}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      console.error("Backend error:", res.status, json);
      throw new Error("Failed to fetch listings");
    }

    return json;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", currentPage, filters],
    queryFn: fetchListings,
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
