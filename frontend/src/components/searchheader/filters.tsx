import { useState } from "react";

type Filters = {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  homeTypes: string[];
};

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const SearchHeader = ({ filters, setFilters }: Props) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleHomeTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      homeTypes: prev.homeTypes.includes(type)
        ? prev.homeTypes.filter((t) => t !== type)
        : [...prev.homeTypes, type],
    }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
  };

  return (
    <nav className="fixed top-[72px] left-0 w-full z-[9998] bg-[rgba(50,50,50,0.8)] backdrop-blur-md shadow-md text-white pt-5">
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
        <input
          type="text"
          placeholder="Address, neighborhood, city, ZIP"
          className="w-96 px-4 py-2 border border-gray-300 rounded-md bg-white text-black"
        />
        <input
          type="number"
          placeholder="Min Price"
          className="w-28 px-2 py-2 rounded-md text-black"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          className="w-28 px-2 py-2 rounded-md text-black"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
        />

        <select
          className="px-2 w-20 py-2 rounded-md text-black"
          value={filters.bedrooms}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
          }
        >
          <option value="">Beds</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <select
          className="px-2 w-20 py-2 rounded-md text-black"
          value={filters.bathrooms}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bathrooms: e.target.value }))
          }
        >
          <option value="">Baths</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <div className="flex gap-2 items-center">
          {["Condo", "Apartment", "Townhouse"].map((type) => (
            <label key={type} className="flex items-center text-sm gap-1">
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={filters.homeTypes.includes(type)}
                onChange={() => handleHomeTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm"
        >
          Search
        </button>
      </div>
    </nav>
  );
};

export default SearchHeader;
