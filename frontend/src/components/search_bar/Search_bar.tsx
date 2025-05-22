import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import "./Search_bar.css";

// list of know boroughs in NYC manhattan is used as a fallback for New York
const knownBoroughs = [
  "Brooklyn",
  "Queens",
  "Manhattan",
  "Bronx",
  "New York",
  "Staten Island",
];

const suffixes: Record<string, string> = {
  Street: "St",
  Avenue: "Ave",
  Boulevard: "Blvd",
  Drive: "Dr",
  Road: "Rd",
  Parkway: "Pkwy",
  Place: "Pl",
  Court: "Ct",
  Lane: "Ln",
  Terrace: "Ter",
  Circle: "Cir",
  Square: "Sq",
  Trail: "Trl",
  Way: "Way",
  Highway: "Hwy",
  Center: "Ctr",
};

const InnerSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // using useEffect to initialize the autocomplete object
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const auto = new places.Autocomplete(inputRef.current, {
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["geocode"],
    });

    setAutocomplete(auto);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const getComponent = (type: string) =>
        place.address_components?.find((c) => c.types.includes(type))
          ?.long_name || "";

      const rawStreet = getComponent("route");

      let normalizedStreet = rawStreet;
      if (rawStreet) {
        const parts = rawStreet.trim().split(" ");
        const suffix = parts.pop();
        const base = parts.join(" ");
        const normalizedSuffix =
          suffix && suffixes[suffix] ? suffixes[suffix] : suffix;
        normalizedStreet = `${base} ${normalizedSuffix}`;
      }

      const postal_code = getComponent("postal_code");

      const rawLocality =
        getComponent("locality") ||
        getComponent("sublocality") ||
        getComponent("neighborhood") ||
        getComponent("sublocality_level_1") ||
        "";

      // normalize the locality to known boroughs for example in our database The Bronx is stored as Bronx
      const normalizedLocality =
        rawLocality === "The Bronx"
          ? "Bronx"
          : knownBoroughs.includes(rawLocality)
          ? rawLocality
          : rawLocality;

      if (normalizedStreet) {
        navigate(
          `/listings?type=street&value=${encodeURIComponent(normalizedStreet)}`
        );
      } else if (postal_code) {
        navigate(`/listings?type=postal_code&value=${postal_code}`);
      } else if (normalizedLocality) {
        navigate(`/listings?type=locality&value=${normalizedLocality}`);
      }
    });

    return () => listener.remove();
  }, [autocomplete, navigate]);

  return (
    <div className="flex w-full max-w-[500px] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] h-14 sm:h-12 border-2 border-white rounded-lg bg-[#434343] overflow-hidden backdrop-blur-md shadow-lg">
      <input
        ref={inputRef}
        className="flex-1 p-4 text-white text-lg sm:text-base bg-transparent outline-none placeholder-white/70"
        type="text"
        placeholder="Enter an address, city, or ZIP code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="px-6 sm:px-4 bg-white text-black font-medium transition-all hover:bg-gray-300"
        onClick={() => inputRef.current?.blur()}
      >
        <i className="fa-solid fa-magnifying-glass text-xl"></i>
      </button>
    </div>
  );
};

const SearchBar = () => {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_API_KEY_2}
      libraries={["places"]}
    >
      <InnerSearchBar />
    </APIProvider>
  );
};

export default SearchBar;
