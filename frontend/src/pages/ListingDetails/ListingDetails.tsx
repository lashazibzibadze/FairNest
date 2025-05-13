import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/navbar/Navbar";
// import { getRandomDealType } from "../../utils/random";
import { formatPrice } from "../../utils/formatprice";
import { Listing } from "../../types";
import BronxImg from "/ListingDetails/The_Bronx.png";
import BrooklynImg from "/ListingDetails/Brooklyn.png";
import QueensImg from "/ListingDetails/Queens.png";
import ManhattanImg from "/ListingDetails/Manhattan.webp";
import StatenIslandImg from "/ListingDetails/Staten Island.png";
import { FcCalendar, FcRuler, FcSalesPerformance } from "react-icons/fc";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTree,
  FaHeart,
} from "react-icons/fa";
import "./ListingDetails.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatString } from "../../utils/formatString";

//backgrounds by locality
const backgroundMap: Record<string, string> = {
  bronx: BronxImg,
  brooklyn: BrooklynImg,
  queens: QueensImg,
  manhattan: ManhattanImg,
  new_york: ManhattanImg,
  staten_island: StatenIslandImg,
};

//function to get the background image based on locality
const getBackground = (locality: string = "") => {
  const key = locality.toLowerCase().replace(/\s+/g, "_");
  return backgroundMap[key] || "/Backgrounds/Default.png";
};

//function to fetch listing details by ID
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const fetchListing = async (id: string): Promise<Listing> => {
  const res = await fetch(`${API_BASE_URL}/listings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch listing details");
  return res.json();
};

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id!),
    enabled: !!id,
  });
  // const dealType = getRandomDealType();

  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const token = await getAccessTokenSilently();

      const res = await fetch(`${API_BASE_URL}/favorites/?listing_id=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add favorite");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert("Listing saved to favorites!");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      alert("Could not save listing to favorites.");
    },
  });


  if (isLoading) {
    return (
      <div className="text-center pt-20 text-lg animate-pulse">Loading...</div>
    );
  }

  //error handling
  if (error || !data) {
    return (
      <div className="text-center pt-20 text-red-500">Listing not found.</div>
    );
  }

  const { address } = data;

  // Dummy data (for demonstration purposes)
  const neighborhoodAvgPrice = 1000000;
  const neighborhoodAvgSqft = 1000;

  const daysOnMarket = Math.floor(
    (new Date().getTime() - new Date(data.created_at || "").getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const pricePercentBelowAvg = Math.round(
    ((neighborhoodAvgPrice - data.price) / neighborhoodAvgPrice) * 100
  );
  const sqftDiff = (data.square_feet ?? 0) - neighborhoodAvgSqft;
  //

  const dealType = data.fairness_rating ?? "No Rating";

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${getBackground(address.locality)})`,
      }}
    >
      <Navbar />

      <div className="backdrop-blur-sm bg-white/45 min-h-screen pt-28 px-4 md:px-10 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-6 block"
        >
          ← Go Back
        </button>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/*left side: image & map */}
          <div className="md:w-1/2 flex flex-col gap-7 h-fit">
            <div className="rounded-lg border-4 border-white shadow-xl overflow-hidden h-[500px]">
              <img
                src={data.image_source || "/house/placeholder.jpeg"}
                alt="Listing"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Location on Map</h2>
              <iframe
                title="Google Map"
                className="rounded-md w-full h-64 border-none"
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${
                  import.meta.env.VITE_GOOGLE_API_KEY_2
                }&q=${encodeURIComponent(
                  `${address.latitude},${address.longitude}`
                )}&zoom=15`}
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/*right column: details*/}
          <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md space-y-6 h-fit">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold text-blue-600">
                ${formatPrice(data.price)}
              </h1>
            </div>

            {/*deal type & save listings */}
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${
                  dealType.toLowerCase() === "bad"
                    ? "bg-red-500 text-white"
                    : dealType.toLowerCase() === "fair"
                    ? "bg-yellow-100 text-yellow-600"
                    : dealType.toLowerCase() === "good"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {dealType.charAt(0).toUpperCase() + dealType.slice(1)} Deal
              </span>
              <button
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition"
                onClick={() => favoriteMutation.mutate()}
              >
                <FaHeart /> Save Listing
              </button>
            </div>

            {/*listings information */}
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-base">
              <div className="flex items-center gap-2">
                <FaBed className="text-blue-500" />
                {data.bedrooms ?? "N/A"} Bedrooms
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-blue-500" />
                {data.bathrooms ?? "N/A"} Bathrooms
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="text-blue-500" />
                {data.square_feet ?? "N/A"} Sq Ft
              </div>
              <div className="flex items-center gap-2">
                <FaTree className="text-green-600" />
                {data.acre_lot ?? "N/A"} Acres
              </div>
              <div className="col-span-2">
                <strong>Status:</strong> {formatString(data.sale_status)}
              </div>
              <div className="col-span-2">
                <strong>Tour Available:</strong>{" "}
                {data.tour_available ? "Yes" : "No"}
              </div>
              <div className="col-span-2">
                <strong>Date Posted:</strong>{" "}
                {new Date(data.created_at || "").toLocaleDateString()}
              </div>
            </div>

            {/*address*/}
            <div className="pt-4">
              <h2 className="text-lg font-semibold">Address</h2>
              <p className="text-gray-600">{address.street}</p>
              <p className="text-gray-600">
                {address.locality}, {address.administrative_area}
              </p>
              <p className="text-gray-600">{address.postal_code}</p>
              <p className="text-gray-600">{address.country}</p>
            </div>

            {/*STatistics */}
            <div className="bg-gray-50 p-4 rounded-lg border shadow-sm space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Statistics
              </h3>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <FcSalesPerformance />
                  Listed <strong>{pricePercentBelowAvg}%</strong> below average
                  price in {address.locality}
                </li>
                <li className="flex items-center gap-2">
                  <FcRuler /> Has <strong>{sqftDiff} sq ft</strong> more than
                  local average
                </li>
                <li className="flex items-center gap-2">
                  <FcCalendar /> On the market for{" "}
                  <strong>{daysOnMarket} days</strong>
                </li>
              </ul>
            </div>

            {/* Listing History */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Listing History
              </h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>
                  <strong>Created:</strong>{" "}
                  {data.address.created_at
                    ? new Date(data.address.created_at).toLocaleDateString()
                    : "N/A"}
                </li>
                <li>
                  <strong>Updated:</strong>{" "}
                  {data.address.updated_at
                    ? new Date(data.address.updated_at).toLocaleDateString()
                    : "N/A"}
                </li>
                <li>
                  {data.realtor_link ? (
                    <a
                      href={data.realtor_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium"
                    >
                      View on Realtor
                    </a>
                  ) : (
                    <span className="block w-fit text-gray-500 bg-gray-200 px-4 py-2 rounded-lg font-medium">
                      Source not available
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingDetails;
