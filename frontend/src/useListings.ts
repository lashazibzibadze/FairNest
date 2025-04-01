import { useQuery } from "@tanstack/react-query";

interface Filters {
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  homeTypes?: string[];
}

export const useListings = (
  skip = 0,
  limit = 10,
  country?: string,
  postal_code?: string,
  filters?: Filters
) => {
  return useQuery({
    queryKey: ["listings", skip, limit, country, postal_code, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        ...(country && { country }),
        ...(postal_code && { postal_code }),
        ...(filters?.minPrice && { min_price: filters.minPrice }),
        ...(filters?.maxPrice && { max_price: filters.maxPrice }),
        ...(filters?.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters?.bathrooms && { bathrooms: filters.bathrooms }),
        ...(filters?.homeTypes?.length && {
          home_types: filters.homeTypes.join(","),
        }),
      });

      const res = await fetch(`http://127.0.0.1:8000/listings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });
};
