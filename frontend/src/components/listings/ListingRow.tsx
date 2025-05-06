import { useNavigate } from "react-router-dom";
import { Listing } from "../../types";

interface Props {
  listing: Listing;
}

export default function ListingRow({ listing }: Props) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="py-2 px-4">{listing.address.street}, {listing.address.locality}</td>
      <td className="py-2 px-4 text-right">${listing.price.toLocaleString()}</td>
      <td className="py-2 px-4 text-center">{listing.sale_status}</td>
      <td className="py-2 px-4 text-center">{listing.fairness_rating}</td>
    </tr>
  );
}
