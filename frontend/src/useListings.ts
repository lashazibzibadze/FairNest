import { useQuery } from "@tanstack/react-query";
import { Listing } from "./types";

export const fetchListings = async (
  skip = 0,
  limit = 10,
  country?: string,
  postal_code?: string,
  street?: string,
  administrative_area?: string,
  locality?: string
): Promise<{
  listings: Listing[];
  total_pages: number;
  current_page: number;
}> => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(country && { country }),
    ...(postal_code && { postal_code }),
    ...(street && { street }),
    ...(administrative_area && { administrative_area }),
    ...(locality && { locality }),
  }).toString();

  //returns { listings, total_pages, current_page }
  const res = await fetch(`http://127.0.0.1:8000/listings?${queryParams}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
};

export function useListings(
  skip = 0,
  limit = 10,
  country?: string,
  postal_code?: string,
  street?: string,
  administrative_area?: string,
  locality?: string
) {
  return useQuery({
    queryKey: [
      "listings",
      skip,
      limit,
      country,
      postal_code,
      street,
      administrative_area,
      locality,
    ],
    queryFn: () =>
      fetchListings(
        skip,
        limit,
        country,
        postal_code,
        street,
        administrative_area,
        locality
      ),
  });
}