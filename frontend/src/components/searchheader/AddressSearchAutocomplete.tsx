import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Filters } from "../../types";

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onSearch: () => void;
}

const knownBoroughs = [
  "Brooklyn",
  "Queens",
  "Manhattan",
  "Bronx",
  "New York",
  "Staten Island",
];

//Street suffixes mapping for normalization, this is becaus to match the database format
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

const AddressSearchAutocomplete = ({
  filters,
  setFilters,
  onSearch,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");

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

      const rawLocality =
        getComponent("locality") ||
        getComponent("sublocality") ||
        getComponent("neighborhood") ||
        getComponent("sublocality_level_1") ||
        "";

      const normalizedLocality =
        rawLocality === "The Bronx"
          ? "Bronx"
          : knownBoroughs.includes(rawLocality)
          ? rawLocality
          : rawLocality;

      const postal_code = getComponent("postal_code");
      const street_number = getComponent("street_number");
      const rawStreet = getComponent("route");

      // normalize street suffix
      let normalizedStreet = rawStreet;
      if (rawStreet) {
        const parts = rawStreet.trim().split(" ");
        const suffix = parts.pop();
        const base = parts.join(" ");
        const normalizedSuffix =
          suffix && suffixes[suffix] ? suffixes[suffix] : suffix;
        normalizedStreet = `${base} ${normalizedSuffix}`;
      }

      const formatted =
        place.formatted_address || rawLocality || postal_code || rawStreet;

      setFilters((prev) => ({
        ...prev,
        addressQuery: formatted,
        locality: normalizedLocality,
        postal_code,
        street: normalizedStreet,
        premise: street_number || "",
        administrative_area: "NY",
        country: "US",
      }));

      onSearch();
    });

    return () => listener.remove();
  }, [autocomplete, setFilters, onSearch]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Address, neighborhood, city, ZIP"
      className="w-96 px-4 py-2 border border-gray-400 rounded-md bg-white placeholder-[#434344] text-black"
      defaultValue={filters.addressQuery}
    />
  );
};

export default AddressSearchAutocomplete;
