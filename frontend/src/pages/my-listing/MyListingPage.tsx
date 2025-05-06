import { useUserListings } from "../../hooks/useUserListing";
import ListingTable from "../../components/listings/ListingTable";
import { NavbarWrapper } from "../../utils/NavbarWrapper";

export default function MyListings() {
    const { data, isLoading, error } = useUserListings(0, 10);
    console.log("MyListings");
    console.log(data);
    console.log(isLoading);
    console.log(error);
    return (
        <NavbarWrapper>
            {isLoading && <p>Loading your listings…</p>}
            {error && <p>Error: {(error as Error).message}</p>}
            {data && (
                <section className="p-6">
                    <h1 className="text-3xl font-bold mb-4">My Listings</h1>
                    {data.listings.length > 0 ? (
                        <ListingTable listings={data.listings} />
                    ) : (
                        <p>
                            You have no listings yet.{" "}
                            <a href="/create-listing" className="text-blue-600">
                                Create one
                            </a>
                            .
                        </p>
                    )}
                </section>
            )}
        </NavbarWrapper>
    );
}
