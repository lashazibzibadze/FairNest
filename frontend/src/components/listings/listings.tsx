import { useNavigate } from "react-router-dom";
import { Listing } from "../../types";
import { formatPrice } from "../../utils/formatprice";
// import { getRandomDealType } from "../../utils/random";
import "./listings.css";

type ListingsComponentProps = {
  listings: Listing[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  isLoading: boolean;
};

const ListingsComponent = ({
  listings,
  currentPage,
  setCurrentPage,
  totalPages,
  isLoading,
}: ListingsComponentProps) => {
  const navigate = useNavigate();

  // if listings are loading show a loading skeleton
  if (isLoading) {
    return (
      <div className="pb-16 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
    );
  }

  // if listings are empty show a message
  if (!isLoading && listings.length === 0) {
    return (
      <div className="pt-40 text-center text-gray-500 text-lg">
        No listings found.
      </div>
    );
  }

  return (
    <div className="pb-16 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => {
          // const dealType = getRandomDealType();
          const dealType = listing.fairness_rating ?? "No Rating";

          return (
            <div
              key={listing.id}
              onClick={() => navigate(`/listing/${listing.id}`)}
              className="cursor-pointer bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all"
            >
              <img
                src={listing.image_source || "/house/placeholder.jpeg"}
                className="w-full h-48 object-cover"
                alt={`Listing ${listing.id}`}
              />
              <div className="p-4 space-y-1">
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
                  {dealType.charAt(0).toUpperCase() + dealType.slice(1)} Deal
                </span>
                <h3 className="text-xl font-bold text-blue-600">
                  ${formatPrice(listing.price)}
                </h3>
                <p className="text-gray-600 text-sm">
                  {listing.address.street}, {listing.address.locality}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/*pagination controlls*/}
      <div className="mt-10 flex justify-center items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-semibold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingsComponent;
