import { useListings } from "../../useListings";
import { formatPrice } from "../../utils/formatprice";
import { getRandomDealType } from "../../utils/random";

type Filters = {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  homeTypes: string[];
};

const ListingsComponent = ({ filters }: { filters: Filters }) => {
  const { data, error, isLoading } = useListings(0, 100, "", "", filters);

  if (isLoading)
    return <p className="animate-ping text-center py-10 text-lg">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 text-lg">Error loading listings</p>
    );

  return (
    <div className="container mx-auto px-4 py-6 drop-shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8">
        {data?.map((listing: any) => {
          const dealType = getRandomDealType();

          return (
            <div
              key={listing.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={listing.image_source || "/placeholder.jpg"}
                alt={`Listing ${listing.id}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  ${formatPrice(listing.price)}
                </h3>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-md text-sm font-semibold text-white ${
                    dealType === "Fraud"
                      ? "bg-red-500"
                      : dealType === "Fair"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {dealType} Deal
                </span>

                <p className="text-gray-700">{listing.sale_status}</p>
                <p className="text-gray-600 text-sm">
                  {listing.address.street}, {listing.address.locality}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListingsComponent;
