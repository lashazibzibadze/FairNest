import "./Recommendation.css"
import Manhattan from "../../assets/Recommendation/Manhattan.jpg"
import Bronx from "../../assets/Recommendation/Bronx.jpg"
import Queens from "../../assets/Recommendation/Queens.jpg"
import Brooklyn from "../../assets/Recommendation/Brooklyn.jpg"
import StatenIsland from "../../assets/Recommendation/Staten_island.jpg"

const recommendations = [
  { id: 1, title: "Manhattan", img: Manhattan },
  { id: 2, title: "Bronx", img: Bronx },
  { id: 3, title: "Queens", img: Queens },
  { id: 4, title: "Brooklyn", img: Brooklyn },
  { id: 5, title: "Staten Island", img: StatenIsland },
];

const Recommendation: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-10">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white drop-shadow-[0px_4px_8px_black]">
          Explore NYC Neighborhoods
        </h2>
      </div>

      {/* Search Buttons */}
      <div className="flex flex-wrap justify-center gap-10 p-10 sm:gap-6 sm:p-5">
        {recommendations.map((item) => (
          <button
            key={item.id}
            className="w-[340px] h-[400px] flex flex-col items-center justify-center rounded-lg overflow-hidden transition-transform duration-500 ease-in-out hover:scale-110 hover:bg-gradient-to-b from-[rgba(255,255,255,0.25)] to-white"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[95%] h-[85%] object-cover rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
            />
            <span className="mt-2 text-sm font-bold text-white drop-shadow-[0px_3px_8px_black] sm:text-base hover:text-gray-900 hover:drop-shadow-none">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;