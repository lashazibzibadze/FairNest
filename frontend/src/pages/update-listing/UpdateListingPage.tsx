import { useNavigate } from "react-router-dom";
import ListingForm from "../../components/listings/ListingForm";
import { ListingInput } from "../../types";
import { NavbarWrapper } from "../../utils/NavbarWrapper";
import { useParams } from "react-router-dom";
import { useListing } from "../../hooks/useListing";
import { useEffect } from "react";

export default function UpdateListingPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    if (!id) {
        throw new Error("Listing ID is required");
    }
    const { getListing, getListingStatus, updateListing, refetchListing } =
        useListing(id);
    const { mutateAsync, status } = updateListing;
    const listing = getListing;

    useEffect(() => {
        refetchListing();
    }, [id]);
    
    const isLoading = status === "pending";
    const onSubmit = async (data: ListingInput) => {
        await mutateAsync({
            ...data,
            id: Number(id),
        });
        navigate("/my-listings");
    };

    if (getListingStatus === "success" && !listing) {
        navigate("/my-listings");
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <img
                    src="/error.png"
                    alt="Error"
                    className="w-72 h-72 object-contain"
                />
                <p className="text-red-600 text-lg">
                    Listing not found. Please check the listing ID.
                </p>
            </div>
        );
    }

    return (
        <NavbarWrapper>
            <section className="mt-12 p-6 max-w-2xl mx-auto bg-gray-300">
                <h1 className="text-3xl font-bold mb-4">
                    Update Current Listing
                </h1>
                {getListingStatus === "pending" && (
                    <div className="animate-pulse bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="w-full h-48 bg-gray-300" />
                        <div className="p-4 space-y-2">
                            <div className="w-24 h-4 bg-gray-300 rounded" />
                            <div className="w-32 h-5 bg-gray-300 rounded" />
                            <div className="w-40 h-4 bg-gray-300 rounded" />
                        </div>
                    </div>
                )}
                {getListingStatus === "error" && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                        <img
                            src="/error.png"
                            alt="Error"
                            className="w-72 h-72 object-contain"
                        />
                        <p className="text-red-600 text-lg">
                            An error occurred while fetching the listing. Please
                            try again later.
                        </p>
                    </div>
                )}
                {getListingStatus === "success" && listing && (
                    <ListingForm
                        mode="edit"
                        onSubmit={onSubmit}
                        isSaving={isLoading}
                        listing={{
                            ...listing,
                            address: {
                                ...listing.address,
                                latitude: listing.address.latitude
                                    ? Number(listing.address.latitude)
                                    : null,
                                longitude: listing.address.longitude
                                    ? Number(listing.address.longitude)
                                    : null,
                            },
                        }}
                    />
                )}
            </section>
        </NavbarWrapper>
    );
}
