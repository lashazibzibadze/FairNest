import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search_bar.css";

// search bar component for the home page
const SearchBar = () => {
  // using useState to manage the state of the search bar input
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    //if the input is empty, do not perform any action
    if (!query.trim()) return;

    // trim the input to remove leading and trailing spaces
    const input = query.trim();
    // regex to check if input is a zip code
    const isZipCode = /^\d+$/.test(input);
    // list of known boroughs in NYC for type matching, New York = Manhattan
    const knownBoroughs = [
      "Brooklyn",
      "Queens",
      "Manhattan",
      "Bronx",
      "New York",
      "Staten Island",
    ];

    let type = "";
    let value = "";

    // check if input is a zip code or a borough name
    if (isZipCode) {
      type = "postal_code";
      value = input;
    } else {
      const inputNormalized = input.toLowerCase();
      const normalizedBoroughs = knownBoroughs.map((b) => b.toLowerCase());

      if (normalizedBoroughs.includes(inputNormalized)) {
        const matchedBorough = knownBoroughs.find(
          (b) => b.toLowerCase() === inputNormalized
        );
        if (matchedBorough) {
          type = "locality";
          value = matchedBorough;
        }
      } else {
        type = "street";
        value = input;
      }
    }
    // navigate to the listings page with the type and value as query parameters
    if (type && value) {
      navigate(`/listings?type=${type}&value=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="flex w-full max-w-[500px] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] h-14 sm:h-12 border-2 border-white rounded-lg bg-[rgba(50,50,50,0.8)] overflow-hidden backdrop-blur-md shadow-lg">
      <input
        className="flex-1 p-4 text-white text-lg sm:text-base bg-transparent outline-none placeholder-white/70"
        type="text"
        placeholder="Enter an address, city, or ZIP code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button
        className="px-6 sm:px-4 bg-white text-black font-medium transition-all hover:bg-[rgba(131,192,217,0.8)]"
        onClick={handleSearch}
      >
        <i className="fa-solid fa-magnifying-glass text-xl"></i>
      </button>
    </div>
  );
};

export default SearchBar;
