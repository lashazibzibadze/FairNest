import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchHeader from "../../components/searchheader/filters";
import ListingsComponent from "../../components/listings/listings";
import ListingMap from "../../components/Map/MapPins";
import { useListings } from "../../useListings";

const ListingsPage = () => {

  //filters for the listings
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    homeTypes: [] as string[],
  });

  //pagination, each page shows 10 listings
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const skip = (currentPage - 1) * limit;
  const { data, isLoading, error } = useListings(skip, limit);

  //error handling
  if (!data) return null;
  if (error)
    return (
      <div className="animate-pulse text-red-500">Something went wrong</div>
    );

  return (
    <div className="pt-44 flex relative min-h-screen bg-gray-200">
      <Navbar />
      <SearchHeader filters={filters} setFilters={setFilters} />

      {/*map*/}
      <div className="top-[175px] w-1/2 h-[calc(100vh-200px)] fixed left-0 z-0">
        <ListingMap listings={data.listings} />
      </div>

      {/*listings*/}
      <div className="ml-auto w-1/2 relative z-10 overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
        <ListingsComponent
          listings={data.listings}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={data.total_pages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ListingsPage;
