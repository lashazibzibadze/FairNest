import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { Favorite } from "../types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

//fetch all favorites
export const fetchFavorites = async (token: string): Promise<Favorite[]> => {
  const res = await fetch(`${API_BASE_URL}/favorites/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
};

// create favorite
export const createFavorite = async (listingId: number, token: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites/?listing_id=${listingId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create favorite");
  }

  return res.json();
};

// hook: delete favorite
export const deleteFavorite = async (favoriteId: number, token: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete favorite");
  }
};

// hook: fetch all favorites
export function useFavorites() {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchFavorites(token);
    },
  });
}

//hook: create favorit
export function useCreateFavorite() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: number) => {
      const token = await getAccessTokenSilently();
      return createFavorite(listingId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

 //hook: Delete Favorite
export function useDeleteFavorite() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (favoriteId: number) => {
      const token = await getAccessTokenSilently();
      await deleteFavorite(favoriteId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
