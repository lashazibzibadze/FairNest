import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchHeader from "../../components/searchheader/filters";
import ListingsComponent from "../../components/listings/listings";


const GoogleMap = () => (
  <div className="w-1/2 h-full fixed top-[200px] left-0 z-0">
    <iframe
      title="Map"
      width="100%"
      height="100%"
      loading="lazy"
      allowFullScreen
      className="rounded-none border-none"
      src={import.meta.env.VITE_GOOGLE_API_KEY}
    />
  </div>
);

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    homeTypes: [] as string[],
  });

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <SearchHeader filters={filters} setFilters={setFilters} />

      <div className="pt-44 flex relative min-h-screen">
        {/*Googlemap left side*/}
        <GoogleMap />

        {/*Search listings right side*/}
        <div className="ml-auto w-1/2 relative z-10 overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
          <ListingsComponent filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;