import { useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { AddressInput } from "../../types";

interface AddressAutocompleteProps {
    onSelect: (address: AddressInput) => void;
    apiKey: string;
    defaultValue?: string;
}

export const AddressAutocomplete = ({
    onSelect,
    apiKey,
    defaultValue,
}: AddressAutocompleteProps) => {
    return (
        <APIProvider apiKey={apiKey} libraries={["places"]}>
            <AddressInputField onSelect={onSelect} defaultValue={defaultValue} />
        </APIProvider>
    );
};

const AddressInputField = ({
    onSelect,
    defaultValue = "",
}: {
    onSelect: (address: AddressInput) => void;
    defaultValue?: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [autocomplete, setAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const auto = new places.Autocomplete(inputRef.current, {
            fields: ["geometry", "address_components"],
            types: ["address"],
        });

        setAutocomplete(auto);
    }, [places]);

    useEffect(() => {
        if (!autocomplete) return;

        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.address_components || !place.geometry) return;

            const getComponent = (type: string) =>
                place.address_components?.find((c) => c.types.includes(type))
                    ?.long_name || "";

            const address: AddressInput = {
                country: getComponent("country"),
                administrative_area: getComponent(
                    "administrative_area_level_1"
                ),
                sub_administrative_area:
                    getComponent("administrative_area_level_2") || undefined,
                locality:
                    getComponent("locality") ||
                    getComponent("sublocality") ||
                    getComponent("sublocality_level_1"),
                postal_code: getComponent("postal_code"),
                street: `${getComponent("route")}`.trim(),
                premise:
                    getComponent("premise") ||
                    getComponent("street_number") ||
                    undefined,
                sub_premise: getComponent("subpremise") || undefined,
                latitude: place.geometry.location?.lat(),
                longitude: place.geometry.location?.lng(),
            };

            onSelect(address);
        });

        return () => listener.remove();
    }, [autocomplete, onSelect]);

    return (
        <input
            ref={inputRef}
            defaultValue={defaultValue}
            placeholder="Enter address"
            className="w-full border rounded px-3 py-2"
        />
    );
};
