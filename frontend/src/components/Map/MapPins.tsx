import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useState } from "react";
import { Listing } from "../../types";
import { getRandomDealType } from "../../utils/random";
import { formatPrice } from "../../utils/formatprice";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

//New York City coordinates for the map center
const center = {
  lat: 40.7128,
  lng: -74.006,
};

type MapProps = {
  listings: Listing[];
};

const ListingMap = ({ listings }: MapProps) => {
  //check if the Google Maps API is loaded
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env
      .VITE_GOOGLE_API_KEY_2_Developement as string,
  });
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Listing | null>(null);
  const dealType = getRandomDealType();

  //check if the listings are empty
  if (!isLoaded)
    return <div className="w-full h-full bg-gray-300">Loading map...</div>;
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {listings.map((listing) => {
        const lat = parseFloat(listing.address.latitude);
        const lng = parseFloat(listing.address.longitude);

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
            lat: parseFloat(selected.address.latitude),
            lng: parseFloat(selected.address.longitude),
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-sm w-48">
            <img
              src={selected.image_source || "/placeholder.jpg"}
              onClick={() => navigate(`/listing/${selected.id}`)}
              className="w-full h-24 object-cover mb-2 rounded hover:shadow-xl transition-all cursor-pointer"
              alt="preview"
            />
            <div
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${
                dealType === "Fraud"
                  ? "bg-red-100 text-red-600"
                  : dealType === "Fair"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {dealType} Deal
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