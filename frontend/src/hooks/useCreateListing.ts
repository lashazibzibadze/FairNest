import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListingService } from "../api/listingService";
import { ListingInput } from "../types";
import toast from "react-hot-toast";

export function useCreateListing() {
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub!;
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ListingInput) => {
      const token = await getAccessTokenSilently();
      try {
        return await ListingService.createListing(data, token);
      } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message;
        if (errorMsg.includes("address already exists")) {
          throw new Error("A listing with this address already exists.");
        }
        throw new Error(errorMsg);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userListings", userId] });
      toast.success("Listing created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
