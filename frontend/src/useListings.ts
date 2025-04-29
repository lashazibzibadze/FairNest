import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Listing } from "./types";

export interface ListingsResponse {
  listings: Listing[];
  total_pages: number;
  total_records: number;
  current_page: number;
  page_size: number;
}

export const useListings = (
  skip: number,
  limit: number
): UseQueryResult<ListingsResponse, Error> => {
  return useQuery<ListingsResponse, Error>({
    queryKey: ["listings", skip, limit],
    queryFn: async (): Promise<ListingsResponse> => {
      const res = await fetch(`http://127.0.0.1:8000/listings?skip=${skip}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 1,
  });
};