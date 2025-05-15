import { useNavigate } from "react-router-dom";
import { useCreateListing } from "../../hooks/useCreateListing";
import ListingForm from "../../components/listings/ListingForm";
import { ListingInput } from "../../types";
import { NavbarWrapper } from "../../utils/NavbarWrapper";
import { IoCreateSharp } from "react-icons/io5";

export default function CreateListing() {
  const navigate = useNavigate();
  const { mutateAsync, status } = useCreateListing();
  const isLoading = status === "pending";

  const onSubmit = async (data: ListingInput) => {
    // Clean up optional fields with blank values
    const cleanedData = JSON.parse(
      JSON.stringify(data, (_, value) => (value === "" ? undefined : value))
    ) as ListingInput;

    await mutateAsync(cleanedData);
    navigate("/my-listings");
  };

  return (
    <div className="bg-gray-300 min-h-screen pt-20">
      <NavbarWrapper>
        <section className="mt-12 p-6 max-w-2xl mx-auto bg-gray-400 border rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold mr-3 text-[#000000]">
              Create Listing
            </h1>
            <IoCreateSharp className="text-blue-600" size={30} />
          </div>
          <ListingForm mode="create" onSubmit={onSubmit} isSaving={isLoading} />
        </section>
      </NavbarWrapper>
    </div>
  );
}
