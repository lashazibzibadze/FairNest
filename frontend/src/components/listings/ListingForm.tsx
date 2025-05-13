import { useForm, SubmitHandler } from "react-hook-form";
import { ListingInput } from "../../types";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface Props {
  onSubmit: SubmitHandler<ListingInput>;
  defaultValues?: Partial<ListingInput>;
}

export default function ListingForm({ onSubmit, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ListingInput>({ defaultValues });

  const handleAddressSelect = (address: ListingInput["address"]) => {
    setValue("address", address, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Price */}
      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          {...register("price", { required: "Price is required" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* Bedrooms / Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms")}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Bathrooms</label>
          <input
            step="0.1"
            type="number"
            {...register("bathrooms")}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Square Feet / Lot */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Square Feet</label>
          <input
            step="0.01"
            type="number"
            {...register("square_feet")}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Lot Size (acre)</label>
          <input
            step="0.01"
            type="number"
            {...register("acre_lot")}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Sale Status */}
      <div>
        <label className="block mb-1">Sale Status</label>
        <select
          {...register("sale_status", { required: "Select a status" })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">— choose —</option>
          <option value="for_sale">For Sale</option>
          <option value="sold">Sold</option>
        </select>
        {errors.sale_status && (
          <p className="text-red-500 text-sm">
            {errors.sale_status.message}
          </p>
        )}
      </div>

      {/* Tour Available */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("tour_available")}
          id="tourAvailable"
          className="mr-2"
        />
        <label htmlFor="tourAvailable">Tour Available</label>
      </div>

      {/* Image URL */}
      <div>
        <label className="block mb-1">Image URL</label>
        <input
          {...register("image_source")}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Address Autocomplete */}
      <div>
        <label className="block mb-1">Address</label>
        <AddressAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          onSelect={handleAddressSelect}
        />
        {errors.address?.street && (
          <p className="text-red-500 text-sm">Address is required</p>
        )}

        {/* Hidden fields to register address subfields */}
        <input type="hidden" {...register("address.country")} />
        <input type="hidden" {...register("address.administrative_area")} />
        <input type="hidden" {...register("address.sub_administrative_area")} />
        <input type="hidden" {...register("address.locality")} />
        <input type="hidden" {...register("address.postal_code")} />
        <input type="hidden" {...register("address.street")} />
        <input type="hidden" {...register("address.premise")} />
        <input type="hidden" {...register("address.sub_premise")} />
        <input type="hidden" {...register("address.latitude")} />
        <input type="hidden" {...register("address.longitude")} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Save Listing
      </button>
    </form>
  );
}
