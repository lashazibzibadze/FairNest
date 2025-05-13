import { Listing } from "../../types";
import ListingRow from "./ListingRow";

interface Props {
    listings: Listing[];
}

export default function ListingTable({ listings }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 text-left">Address</th>
                        <th className="py-2 px-4 text-right">Price</th>
                        <th className="py-2 px-4 text-center">Status</th>
                        <th className="py-2 px-4 text-center">Fairness</th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((l) => (
                        <ListingRow key={l.id} listing={l} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
