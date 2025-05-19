import { useForm, SubmitHandler } from "react-hook-form";
import { ListingInput } from "../../types";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useEffect } from "react";

interface Props {
  mode: "edit" | "create";
  onSubmit: SubmitHandler<ListingInput>;
  defaultValues?: Partial<ListingInput>;
  isSaving: boolean;
  listing?: ListingInput;
}

export default function ListingForm({
  onSubmit,
  defaultValues,
  isSaving,
  mode,
  listing,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ListingInput>({ defaultValues });

  useEffect(() => {
    if (mode === "edit" && listing) {
      reset(listing); // populate all fields at once
    }
  }, [mode, listing, reset]);

  const handleAddressSelect = (address: ListingInput["address"]) => {
    setValue("address", address, { shouldValidate: true });
  };

  const address = listing?.address;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Address Autocomplete */}
      <div>
        <label className="block mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <AddressAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_API_KEY_2}
          onSelect={handleAddressSelect}
          defaultValue={
            address
              ? `${address.premise} ${address.street} ${address.locality}, ${address.administrative_area}, ${address.country}`
              : ""
          }
          disabled={mode === "edit"}
          className={`w-full px-3 py-2 rounded border ${
            mode === "edit"
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : ""
          }`}
        />

        {mode === "edit" && (
          <p className="text-sm text-gray-500 mt-1 italic">
            Address cannot be changed after listing is created.
          </p>
        )}

        {errors.address?.street && (
          <p className="text-red-500 text-sm">Address is required</p>
        )}
        {/* Hidden fields to register address subfields */}
        <input type="hidden" {...register("address.country")} />
        <input type="hidden" {...register("address.administrative_area")} />
        <input type="hidden" {...register("address.sub_administrative_area")} />
        <input type="hidden" {...register("address.locality")} />
        <input type="hidden" {...register("address.postal_code")} />
        <input
          type="hidden"
          {...register("address.street", { required: true })}
        />
        <input type="hidden" {...register("address.premise")} />
        <input type="hidden" {...register("address.sub_premise")} />
        <input type="hidden" {...register("address.latitude")} />
        <input type="hidden" {...register("address.longitude")} />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("price", {
            required: "Price is required",
            setValueAs: v =>
              v === "" ? undefined : parseInt(v as string, 10),
          })}
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
            {...register("bedrooms", {
              setValueAs: v => (v === "" ? undefined : parseInt(v as string, 10)),
            })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Bathrooms</label>
          <input
            step="0.1"
            type="number"
            {...register("bathrooms", {
              setValueAs: v => (v === "" ? undefined : parseFloat(v as string)),
            })}
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
            {...register("square_feet", {
              setValueAs: v =>
                v === ""
                  ? undefined
                  : parseFloat((parseFloat(v as string)).toFixed(2)),
            })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Lot Size (acre)</label>
          <input
            step="0.01"
            type="number"
            {...register("acre_lot", {
              setValueAs: v => (v === "" ? undefined : parseFloat(v as string)),
            })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Sale Status */}
      <div>
        <label className="block mb-1">
          Sale Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("sale_status", {
            required: "Select a status",
          })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">— choose —</option>
          <option value="for_sale">For Sale</option>
          <option value="sold">Sold</option>
        </select>
        {errors.sale_status && (
          <p className="text-red-500 text-sm">{errors.sale_status.message}</p>
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

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Listing"}
      </button>
    </form>
  );
}
