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
        data.address.administrative_area = "NY";
        data.address.country = "US";
        console.log(data)
        await mutateAsync(data);
        navigate("/my-listings");
    };

    return (
        <NavbarWrapper>
            <section className="p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Create Listing</h1>
                <ListingForm onSubmit={onSubmit} />
                {isLoading && <p className="mt-2">Saving…</p>}
            </section>
        </NavbarWrapper>
    );
}
