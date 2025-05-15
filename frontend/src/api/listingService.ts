import { Listing, ListingInput, PaginatedResponse } from "../types";

function buildQuery(params: Record<string, any>) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) qp.append(k, String(v));
  });
  return qp.toString();
}

export const ListingService = {
  fetchUserListings: async (
    userId: string,
    token: string,
    params: { skip?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<Listing>> => {
    const query = buildQuery(params);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/listings${
          query ? `?${query}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error fetching user listings";
      throw new Error(`ListingService.fetchUserListings: ${message}`);
    }
  },

  fetchListing: async (id: string, token: string): Promise<Listing> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/listings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error fetching listing";
      throw new Error(`ListingService.fetchListing: ${message}`);
    }
  },
  createListing: async (
    data: ListingInput,
    token: string
  ): Promise<Listing> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error(`Create failed: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error creating listing";
      throw new Error(`ListingService.createListing: ${message}`);
    }
  },
  updateListing: async (
    data: ListingInput & { id: number },
    token: string
  ): Promise<Listing> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/listings/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error(`Update failed: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error updating listing";
      throw new Error(`ListingService.updateListing: ${message}`);
    }
  },
  deleteListing: async (
    id: string,
    token: string
  ): Promise<void> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/listings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error deleting listing";
      throw new Error(`ListingService.deleteListing: ${message}`);
    }
  },
};
