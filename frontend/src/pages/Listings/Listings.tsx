import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchHeader from "../../components/searchheader/filters";
import ListingsComponent from "../../components/listings/listings";
import ListingMap from "../../components/Map/MapPins";
import { useListings } from "../../useListings";
import { Filters } from "../../types";
import "./Listings.css";
import { APIProvider } from "@vis.gl/react-google-maps";

const ListingsPage = () => {
  //get query params from URL
  //using useLocation from react-router-dom to access the current location object
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const value = queryParams.get("value");
  //state to manage filters for listings page
  const [filters, setFilters] = useState<Filters>({
    country: "",
    postal_code: "",
    street: "",
    administrative_area: "",
    locality: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    homeType: "",
    homeTypes: [],
    addressQuery: "",
  });

  //state to manage the current page of listings
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useListings(currentPage, filters);

  //useEffect to set filters based on query params
  useEffect(() => {
    if (type && value) {
      setFilters((prev) => ({
        ...prev,
        [type]: value,
        addressQuery: value,
      }));
    }
  }, [type, value]);

  const listings = data?.listings ?? [];
  const totalPages = data?.total_pages ?? 0;

  // error handling
  if (error)
    return (
      <div className="animate-pulse text-red-500">Something went wrong</div>
    );

  return (
    <div className="pt-44 bg-gray-300 min-h-screen relative">
      <Navbar />
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY_2}
        libraries={["places"]}
      >
        <SearchHeader
          filters={filters}
          setFilters={setFilters}
          onSearch={() => setCurrentPage(1)}
        />
      </APIProvider>

      {/*desktop - large screens layout */}
      <div className="hidden md:flex relative">
        <div className="top-[165px] w-1/2 h-[calc(100vh-165px)] fixed left-0 z-0 rounded-tr-3xl overflow-hidden">
          <ListingMap listings={listings} />
        </div>
        <div className="ml-auto w-1/2 relative z-10 overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
          <ListingsComponent
            listings={listings}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/*mobile layout */}
      <div className="md:hidden min-h-screen relative pb-[35vh]">
        <div className="overflow-y-auto px-4">
          <ListingsComponent
            listings={listings}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        </div>
        <div className="fixed bottom-0 left-0 w-full h-[25vh] z-10 border-t border-gray-300 bg-white">
          <ListingMap listings={listings} />
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
