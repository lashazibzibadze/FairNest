import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useState } from "react";
import { Listing } from "../../types";
import { formatPrice } from "../../utils/formatprice";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// New York City coordinates for the map center
const center = {
  lat: 40.7128,
  lng: -74.006,
};

type MapProps = {
  listings: Listing[];
};

const ListingMap = ({ listings }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env
      .VITE_GOOGLE_API_KEY_2_Developement as string,
  });

  const navigate = useNavigate();
  const [selected, setSelected] = useState<Listing | null>(null);

  if (!isLoaded)
    return <div className="w-full h-full bg-gray-300">Loading map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {listings.map((listing) => {
        const latStr = listing.address?.latitude ?? "0";
        const lngStr = listing.address?.longitude ?? "0";

        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <MarkerF
            key={listing.id}
            position={{ lat, lng }}
            onClick={() => setSelected(listing)}
          />
        );
      })}

      {selected && (
        <InfoWindowF
          position={{
            lat: parseFloat(selected.address?.latitude ?? "0"),
            lng: parseFloat(selected.address?.longitude ?? "0"),
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-sm w-48">
            <img
              src={selected.image_source || "/house/placeholder.jpeg"}
              onClick={() => navigate(`/listing/${selected.id}`)}
              className="w-full h-24 object-cover mb-2 rounded hover:shadow-xl transition-all cursor-pointer"
              alt="preview"
            />
            <div
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${
                selected.fairness_rating?.toLowerCase() === "bad"
                  ? "bg-red-500 text-white"
                  : selected.fairness_rating?.toLowerCase() === "fair"
                  ? "bg-yellow-100 text-yellow-600"
                  : selected.fairness_rating?.toLowerCase() === "good"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {selected.fairness_rating
                ? selected.fairness_rating.charAt(0).toUpperCase() +
                  selected.fairness_rating.slice(1).toLowerCase()
                : "No Rating"}{" "}
              Deal
            </div>

            <div className="text-xl font-bold text-blue-600">
              ${formatPrice(selected.price)}
            </div>
            <p className="text-gray-600 text-sm">
              {selected.address.street}, {selected.address.locality}
            </p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default ListingMap;
