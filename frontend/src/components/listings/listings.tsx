import { useListings } from "../../useListings";

const ListingsComponent = () => {
    const { data, error, isLoading } = useListings(0, 2000, "US", "10019");

    if (isLoading) return <p className="animate-spin text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-500">Error loading listings</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-16">
                {data?.map((listing) => (
                    <div key={listing.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img 
                            src={listing.image_source || " "} 
                            alt={`Listing ${listing.id}`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">${listing.price}</h3>
                            <p className="text-gray-700">{listing.sale_status}</p>
                            <p className="text-gray-600 text-sm">
                                {listing.address.street}, {listing.address.locality}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingsComponent;