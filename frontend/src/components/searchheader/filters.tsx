import { useState } from "react";
import { Filters } from "../../types";
import "./filters.css";

// prop types for the SearchHeader component
interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onSearch: () => void;
}

const SearchHeader = ({ filters, setFilters }: Props) => {
  //state to manage the visibility of filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  //function to handle the reset of filters
  const handleReset = () => {
    setFilters({
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
  };

  return (
    <nav className="fixed top-[72px] left-0 w-full z-[9998] bg-[rgba(50,50,50,0)] backdrop-blur-md shadow-md text-white pt-5">
      <div className="flex sm:hidden justify-center px-4 py-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } sm:flex flex-wrap items-center justify-center gap-4 px-6 py-4`}
      >
        {/*search Bar for listings page */}
        <input
          type="text"
          placeholder="Address, neighborhood, city, ZIP"
          className="w-96 px-4 py-2 border border-gray-400 rounded-md bg-white placeholder-[#434344]"
          value={filters.addressQuery}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, addressQuery: e.target.value }))
          }
        />

        {/* Min Price for listings page*/}
        <input
          type="number"
          placeholder="Min Price"
          className="w-28 px-2 py-2 rounded-md border border-gray-400 placeholder-[#434344]"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
          }
        />

        {/* Max Price for listings page*/}
        <input
          type="number"
          placeholder="Max Price"
          className="w-28 px-2 py-2 rounded-md border border-gray-400 placeholder-[#434344]"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
        />

        {/* min Bedrooms for listings page*/}
        <select
          className="px-2 w-20 py-2 rounded-md border border-gray-400 text-[#434344] cursor-pointer"
          value={filters.bedrooms}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
          }
        >
          <option value="">Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        {/*min Bathrooms for listings page */}
        <select
          className="px-2 w-20 py-2 rounded-md border border-gray-400 text-[#434344] cursor-pointer"
          value={filters.bathrooms}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bathrooms: e.target.value }))
          }
        >
          <option value="">Baths</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        {/* Home Types for listingspage */}
        <select
          className="px-2 w-60 py-2 rounded-md border border-gray-400 text-[#434344] cursor-pointer"
          value={filters.homeType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, homeType: e.target.value }))
          }
        >
          <option value="">Home Type</option>
          <option value="Condo for sale">Condo for sale</option>
          <option value="Multi-family home for sale">
            Multi-family home for sale
          </option>
          <option value="House for sale">House for sale</option>
          <option value="Townhouse for sale">Townhouse for sale</option>
        </select>

        {/*reset button for listings page */}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Reset
        </button>
      </div>
    </nav>
  );
};

export default SearchHeader;
