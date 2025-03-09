import "./Search_bar.css";

const SearchBar = () => {
  return (
    <div className="flex w-full max-w-[500px] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] h-14 sm:h-12 border-2 border-white rounded-lg bg-[rgba(50,50,50,0.8)] overflow-hidden backdrop-blur-md shadow-lg">
      <input
        className="flex-1 p-4 text-white text-lg sm:text-base bg-transparent outline-none placeholder-white/70"
        type="text"
        placeholder="Enter an address, city, or ZIP code"
      />
      <button className="px-6 sm:px-4 bg-white text-black font-medium transition-all hover:bg-[rgba(131,192,217,0.8)]">
        <i className="fa-solid fa-magnifying-glass text-xl"></i>
      </button>
    </div>
  );
};

export default SearchBar;