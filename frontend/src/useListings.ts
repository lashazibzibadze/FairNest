import { useQuery } from "@tanstack/react-query";
import { Filters } from "./types";

export const useListings = (currentPage: number, filters: Filters) => {
  const fetchListings = async () => {
    const limit = 24;
    const skip = (currentPage - 1) * limit;

    const params: Record<string, string> = {
      skip: skip.toString(),
      limit: limit.toString(),
    };

    //price filter
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;

    //filter for min bedrooms and bathrooms
    if (filters.bedrooms) params.min_bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.min_bathrooms = filters.bathrooms;

    //address Search (street, postal_code, locality all from addressQuery)
    if (filters.addressQuery) {
      const input= filters.addressQuery.trim();

      // regex to check if input is a zip code
      const isZipCode = /^\d+$/.test(input);
    
      // list of known boroughs in NYC for type matching, New York = Manhattan
      const knownBoroughs = ["Brooklyn", "Queens", "Manhattan", "Bronx", "New York", "Staten Island"];
    
      // check if input is a zip code or a borough name
      if (isZipCode) {
        params.postal_code = input;
      } else {
        const inputNormalized = input.toLowerCase();
        const normalizedBoroughs = knownBoroughs.map(b => b.toLowerCase());
    
        if (normalizedBoroughs.includes(inputNormalized)) {
          const matchedBorough = knownBoroughs.find(b => b.toLowerCase() === inputNormalized);
          if (matchedBorough) {
            params.locality = matchedBorough;
          }
        } else {
          //send street exactly how user typed
          params.street = input;
        }
      }
    }
    
  
    //filter for homeType "House", "Condo", "Apartment" and etc.
    if (filters.homeType) {
      params.sale_status = filters.homeType;
    }

    const queryString = new URLSearchParams(params).toString();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const url = `${backendURL}/listings?${queryString}`;

    const res = await fetch(url);
    const json = await res.json();

    // check if the response is ok
    // if (res.status === 401) {
    if (!res.ok) {
      console.error("Backend error:", res.status, json);
      throw new Error("Failed to fetch listings");
    }

    return json;
  };

  // useQuery to fetch listings
  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", currentPage, filters],
    queryFn: fetchListings,
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};