import { useForm, SubmitHandler } from "react-hook-form";
import { ListingInput } from "../../types";

interface Props {
    onSubmit: SubmitHandler<ListingInput>;
    defaultValues?: Partial<ListingInput>;
}

export default function ListingForm({ onSubmit, defaultValues }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ListingInput>({ defaultValues });

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
                    <p className="text-red-500 text-sm">
                        {errors.price.message}
                    </p>
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

            {/* Image & Link */}
            <div>
                <label className="block mb-1">Image URL</label>
                <input
                    {...register("image_source")}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block mb-1">Realtor Link</label>
                <input
                    {...register("realtor_link")}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* Address sub-form */}
            <div>
                <label className="block mb-1">Street</label>
                <input
                    {...register("address.street", {
                        required: "Street is required",
                    })}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.address?.street && (
                    <p className="text-red-500 text-sm">
                        {errors.address.street.message}
                    </p>
                )}
            </div>
            <div>
                <label className="block mb-1">City</label>
                <input
                    {...register("address.locality", {
                        required: "City is required",
                    })}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.address?.locality && (
                    <p className="text-red-500 text-sm">
                        {errors.address.locality.message}
                    </p>
                )}
            </div>
            <div>
                <label className="block mb-1">Postal Code</label>
                <input
                    {...register("address.postal_code")}
                    className="w-full border rounded px-3 py-2"
                />
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
