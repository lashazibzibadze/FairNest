import "./Favorites.css";
import { useNavigate } from "react-router-dom";
import { useFavorites, useDeleteFavorite } from "../../hooks/useCreateFavorite";
import { formatPrice } from "../../utils/formatprice";
import { NavbarWrapper } from "../../utils/NavbarWrapper";
import { Listing } from "../../types";
import { RiDeleteBin6Line } from "react-icons/ri";
import BirdFavorite from "../../assets/bird-favorite.webp";
import { useState } from "react";

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const navigate = useNavigate();
  const deleteFavoriteMutation = useDeleteFavorite();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const listings: Listing[] =
    data?.map((fav) => fav.listing).filter(Boolean) || [];

  const handleDelete = (id: number) => {
    deleteFavoriteMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      <NavbarWrapper>
        <section className="p-6">
          <h1 className="text-2xl font-semibold mb-4 lg-shadow text-gray-600">
            My Favorites
          </h1>

          {/* Skeleton loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-white shadow-md rounded-xl overflow-hidden"
                >
                  <div className="w-full h-48 bg-gray-300" />
                  <div className="p-4 space-y-2">
                    <div className="w-24 h-4 bg-gray-300 rounded" />
                    <div className="w-32 h-5 bg-gray-300 rounded" />
                    <div className="w-40 h-4 bg-gray-300 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Listings saved */}
          {!isLoading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
              <img
                src={BirdFavorite}
                alt="No favorites"
                className="w-72 h-72 object-contain"
              />
              <p className="text-gray-600 text-lg">
                You have no favorites yet. Browse listings and save your
                favorites.
              </p>
            </div>
          )}

          {!isLoading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
              {data?.map((fav) => {
                const listing = fav.listing;
                const dealType = listing.fairness_rating ?? "No Rating";

                return (
                  <div
                    key={fav.id}
                    className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/*remove button with confirmation tooltip above */}
                    <div className="absolute top-2 right-2 z-10 flex flex-col items-end">
                      {confirmDeleteId === fav.id ? (
                        <div className="mb-1 bg-white shadow-lg border rounded px-3 py-2 text-sm text-gray-700">
                          <p className="mb-1">Are you sure?</p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleDelete(fav.id)}
                              className="text-red-600 font-semibold hover:underline"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-gray-500 hover:underline"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(fav.id)}
                          className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove from favorites"
                        >
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <img
                      src={listing.image_source || "/house/placeholder.jpeg"}
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="w-full h-48 object-cover cursor-pointer"
                      alt={`Listing ${listing.id}`}
                    />
                    <div
                      className="p-4 space-y-1 cursor-pointer"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${
                          dealType.toLowerCase() === "bad"
                            ? "bg-red-500 text-white"
                            : dealType.toLowerCase() === "fair"
                            ? "bg-yellow-100 text-yellow-600"
                            : dealType.toLowerCase() === "good"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dealType.charAt(0).toUpperCase() + dealType.slice(1)}{" "}
                        Deal
                      </span>
                      <h3 className="text-xl font-bold text-blue-600">
                        ${formatPrice(listing.price)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {listing.address?.premise} {listing.address?.street},{" "}
                        {listing.address?.locality}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </NavbarWrapper>
    </div>
  );
}
