import { useQuery } from "@tanstack/react-query";
import { Listing } from "./types";

const fetchListings = async (
    skip = 0,
    limit = 10,
    country?: string,
    postal_code?: string,
    street?: string,
    administrative_area?: string,
    locality?: string
): Promise<Listing[]> => {
    const queryParams = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        ...(country && { country }),
        ...(postal_code && { postal_code }),
        ...(street && { street }),
        ...(administrative_area && { administrative_area }),
        ...(locality && { locality }),
    }).toString();

    const response = await fetch(
        `http://127.0.0.1:8000/listings?${queryParams}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch listings");
    }
    return response.json();
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
