import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

export function useDeleteListing() {
  const { user, getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
          throw new Error("Failed to delete the listing");
      }
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userListings"] });
    },
  });
}
