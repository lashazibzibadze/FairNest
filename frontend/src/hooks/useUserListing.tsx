import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { ListingService } from "../api/listingService";
import { PaginatedResponse, Listing } from "../types";

export function useUserListings(skip = 0, limit = 10) {
    const { user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub!;
    return useQuery<PaginatedResponse<Listing>>({
        queryKey: ["userListings", userId, skip, limit],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return ListingService.fetchUserListings(userId, token, {
                skip,
                limit,
            });
        },
        enabled: !!userId,
    });
}
