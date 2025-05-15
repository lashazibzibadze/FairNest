import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/listings/${listingId}`, {
      method: "DELETE",
    });

      if (!res.ok) {
        throw new Error("Failed to delete the listing");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
    },
  });
}
