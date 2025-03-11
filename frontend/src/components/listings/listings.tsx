import { useListings } from "../../useListings";

const ListingsComponent = () => {
    const { data, error, isLoading } = useListings(0, 10, "US", "10019");

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading listings</p>;

    return (
        <ul>
            {data?.map((listing) => (
                <li key={listing.id}>
                    <strong>${listing.price}</strong> - {listing.sale_status}
                    <br />
                    {listing.address.street}, {listing.address.locality}
                </li>
            ))}
        </ul>
    );
};

export default ListingsComponent;