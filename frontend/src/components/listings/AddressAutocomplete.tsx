import { useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { AddressInput } from "../../types";

interface AddressAutocompleteProps {
  onSelect: (address: AddressInput) => void;
  apiKey: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export const AddressAutocomplete = ({
  onSelect,
  apiKey,
  defaultValue,
  disabled,
  className,
}: AddressAutocompleteProps) => {
  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <AddressInputField
        onSelect={onSelect}
        defaultValue={defaultValue}
        disabled={disabled}
        className={className}
      />
    </APIProvider>
  );
};

// normalize street suffixes to match the database format
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

const AddressInputField = ({
  onSelect,
  defaultValue = "",
  disabled = false,
  className = "",
}: {
  onSelect: (address: AddressInput) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current || disabled) return;

    const auto = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "address_components"],
      types: ["address"],
    });

    setAutocomplete(auto);
  }, [places, disabled]);

  useEffect(() => {
    if (!autocomplete || disabled) return;

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components || !place.geometry) return;

      const getComponent = (type: string) =>
        place.address_components?.find((c) => c.types.includes(type))?.long_name || "";

      // normalize street suffixes to match the database format
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

      // normalize The bronx to Bronx to match the database format
      let rawLocality =
        getComponent("locality") ||
        getComponent("sublocality") ||
        getComponent("neighborhood") ||
        getComponent("sublocality_level_1") ||
        "";

      if (rawLocality === "The Bronx") {
        rawLocality = "Bronx";
      }

      const address: AddressInput = {
        country: getComponent("country"),
        administrative_area: getComponent("administrative_area_level_1"),
        sub_administrative_area:
          getComponent("administrative_area_level_2") || undefined,
        locality: rawLocality,
        postal_code: getComponent("postal_code"),
        street: normalizedStreet.trim(),
        premise:
          getComponent("premise") || getComponent("street_number") || undefined,
        sub_premise: getComponent("subpremise") || undefined,
        latitude: place.geometry.location?.lat(),
        longitude: place.geometry.location?.lng(),
      };

      onSelect(address);
    });

    return () => listener.remove();
  }, [autocomplete, onSelect, disabled]);

  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      placeholder="Enter address"
      className={className}
      disabled={disabled}
    />
  );
};
