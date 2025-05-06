import { useNavigate } from "react-router-dom";
import "./Recommendation.css";
import Manhattan from "../../assets/Recommendation/Manhattan.jpg";
import Bronx from "../../assets/Recommendation/Bronx.jpg";
import Queens from "../../assets/Recommendation/Queens.jpg";
import Brooklyn from "../../assets/Recommendation/Brooklyn.jpg";
import StatenIsland from "../../assets/Recommendation/Staten_Island.jpg";

const recommendations = [
  { id: 1, title: "Manhattan", img: Manhattan },
  { id: 2, title: "Bronx", img: Bronx },
  { id: 3, title: "Queens", img: Queens },
  { id: 4, title: "Brooklyn", img: Brooklyn },
  { id: 5, title: "Staten Island", img: StatenIsland },
];

const Recommendation = () => {
  //using useNavigate to navigate user to prefilled search results (about page -> listings page)
  const navigate = useNavigate();
  const handleClick = (borough: string) => {
    navigate(`/listings?type=locality&value=${encodeURIComponent(borough)}`);
  };
  
  return (
    <div className="flex flex-col items-center p-10">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold pb-8">
          Explore NYC Neighborhoods
        </h2>
      </div>

      {/* Search Buttons */}
      <div className="flex flex-wrap justify-center gap-10 p-10 sm:gap-4 md:gap-10 pt-16">
        {recommendations.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.title)}
            className="w-[290px] h-[340px] md:w-80 md:h-96 flex flex-col items-center justify-center rounded-lg overflow-hidden transition-transform duration-500 ease-in-out hover:scale-110 hover:drop-shadow-[0px_4px_10px_rgba(0,0,0,0.5)] bg-white bg-opacity-75 hover:bg-opacity-100"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[95%] h-[85%] object-cover rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
            />
            <span className="mt-2 text-sm font-bold text-black sm:text-base hover:text-gray-900 hover:drop-shadow-none">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;