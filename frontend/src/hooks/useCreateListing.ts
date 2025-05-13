import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListingService } from "../api/listingService";
import { ListingInput } from "../types";

export function useCreateListing() {
    const { user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub!;
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (data: ListingInput) => {
            const token = await getAccessTokenSilently();
            return ListingService.createListing(data, token);
          },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["userListings", userId] });
        },
    });
}
