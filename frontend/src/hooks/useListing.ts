import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListingService } from "../api/listingService";
import { ListingInput } from "../types";

export function useListing(listingId: string) {
    const { user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub!;
    const qc = useQueryClient();

    const updateListing = useMutation({
        mutationFn: async (data: ListingInput & { id: number }) => {
            const token = await getAccessTokenSilently();
            return ListingService.updateListing(data, token);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["listing", listingId] });
            qc.invalidateQueries({ queryKey: ["userListings", userId] });
        },
    });

    const getListing = useQuery({
        queryKey: ["userListings", listingId],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return ListingService.fetchListing(listingId, token);
        },
        enabled: false,
    });

    return {
        updateListing,
        getListing: getListing.data,
        getListingStatus: getListing.status,
        refetchListing: getListing.refetch,
    };
}
