import { useNavigate } from "react-router-dom";
import { useCreateListing } from "../../hooks/useCreateListing";
import ListingForm from "../../components/listings/ListingForm";
import { ListingInput } from "../../types";
import { NavbarWrapper } from "../../utils/NavbarWrapper";

export default function CreateListing() {
    const navigate = useNavigate();
    const { mutateAsync, status } = useCreateListing();
    const isLoading = status === "pending";

    const onSubmit = async (data: ListingInput) => {
        console.log("CreateListing");

        // Clean up optional fields with blank values
        const cleanedData = JSON.parse(
            JSON.stringify(data, (_, value) =>
                value === "" ? undefined : value
            )
        ) as ListingInput;

        console.log(cleanedData);
        await mutateAsync(cleanedData);
        navigate("/my-listings");
    };

    return (
        <NavbarWrapper>
            <section className="mt-12 p-6 max-w-2xl mx-auto bg-gray-300">
                <h1 className="text-3xl font-bold mb-4">Create Listing</h1>
                <ListingForm onSubmit={onSubmit} isSaving={isLoading} />
            </section>
        </NavbarWrapper>
    );
}
