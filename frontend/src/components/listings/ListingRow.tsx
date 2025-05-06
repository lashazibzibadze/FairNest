import { Listing } from "../../types";

interface Props {
    listing: Listing;
}

export default function ListingRow({ listing }: Props) {
    const { address } = listing;
    return (
        <tr className="border-t">
            <td className="py-2 px-4">
                {address.street}, {address.locality}
            </td>
            <td className="py-2 px-4 text-right">
                ${listing.price.toLocaleString()}
            </td>
            <td className="py-2 px-4 text-center">{listing.sale_status}</td>
            <td className="py-2 px-4 text-center">{listing.fairness_rating}</td>
        </tr>
    );
}
