import { useUserListings } from "../../hooks/useUserListing";
import { formatPrice } from "../../utils/formatprice";
import { NavbarWrapper } from "../../utils/NavbarWrapper";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import BirdFavorite from "../../assets/bird-favorite.webp";

export default function MyListings() {
    const { data, isLoading, error } = useUserListings(0, 10);
    const navigate = useNavigate();

    return (
        <div className="bg-gray-300 min-h-screen">
            <NavbarWrapper>
                <section className="p-6">
                    <h1 className="text-3xl font-semibold mb-4 lg-shadow text-gray-600">
                        My Listings{" "}
                        {data && data.listings.length > 0 && (
                            <>
                                {" "}
                                <a
                                    href="/create-listing"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    Create Listing
                                </a>
                            </>
                        )}
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

                    {/* Error state */}
                    {error && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                            <img
                                src="/error.png"
                                alt="Error"
                                className="w-72 h-72 object-contain"
                            />
                            <p className="text-red-600 text-lg">
                                An error occurred while fetching your listings.
                                Please try again later.
                            </p>
                        </div>
                    )}
                    {/* No Listings saved */}
                    {!isLoading && (!data || data.listings.length == 0) ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                            <img
                                src={BirdFavorite}
                                alt="No favorites"
                                className="w-72 h-72 object-contain"
                            />
                            <p className="text-gray-600 text-lg">
                                You have no listings yet.{" "}
                                <a
                                    href="/create-listing"
                                    className="text-blue-600"
                                >
                                    Create one
                                </a>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
                            {data?.listings.map((listing) => {
                                const dealType =
                                    listing.fairness_rating ?? "No Rating";

                                return (
                                    <div
                                        key={listing.id}
                                        className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all"
                                    >
                                        {/* Remove button */}
                                        <button
                                            onClick={() => {
                                                // deleteFavoriteMutation.mutate(
                                                //     listing.id
                                                // )
                                            }}
                                            className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            title="Remove from favorites"
                                        >
                                            <RiDeleteBin6Line className="w-4 h-4" />
                                        </button>

                                        <img
                                            src={
                                                listing.image_source ||
                                                "/house/placeholder.jpeg"
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/listing/${listing.id}`
                                                )
                                            }
                                            className="w-full h-48 object-cover cursor-pointer"
                                            alt={`Listing ${listing.id}`}
                                        />
                                        <div
                                            className="p-4 space-y-1 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/listing/${listing.id}`
                                                )
                                            }
                                        >
                                            <span
                                                className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${
                                                    dealType.toLowerCase() ===
                                                    "bad"
                                                        ? "bg-red-500 text-white"
                                                        : dealType.toLowerCase() ===
                                                          "fair"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : dealType.toLowerCase() ===
                                                          "good"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {dealType
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    dealType.slice(1)}{" "}
                                                Deal
                                            </span>
                                            <h3 className="text-xl font-bold text-blue-600">
                                                ${formatPrice(listing.price)}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {listing.address?.street},{" "}
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
