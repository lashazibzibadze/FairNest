import "./Search_bar.css";

const Search_bar = () => {
  return (
    <div className="hero-search-container">
      <input
        className="hero-search-input"
        type="text"
        placeholder="Enter an address, city, or ZIP code"
      />
      <button className="hero-search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
    </div>
  );
};

export default Search_bar;
