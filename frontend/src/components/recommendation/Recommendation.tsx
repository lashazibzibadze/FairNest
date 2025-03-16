import "./Recommendation.css";
import Manhattan from "../../assets/Recommendation/Manhattan.jpg";
import Bronx from "../../assets/Recommendation/Bronx.jpg";
import Queens from "../../assets/Recommendation/Queens.jpg";
import Brooklyn from "../../assets/Recommendation/Brooklyn.jpg";
import StatenIsland from "../../assets/Recommendation/Staten_island.jpg";

const recommendations = [
  { id: 1, title: "Manhattan", img: Manhattan },
  { id: 2, title: "Bronx", img: Bronx },
  { id: 3, title: "Queens", img: Queens },
  { id: 4, title: "Brooklyn", img: Brooklyn },
  { id: 5, title: "Staten Island", img: StatenIsland },
];

const Recommendation = () => {
  return (
    <div className="flex flex-col items-center p-10">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl font-semibold" style={{textShadow: "1px 1px 2px black"}}>
          Explore NYC Neighborhoods
        </h2>
      </div>

      {/* Search Buttons */}
      <div className="flex flex-wrap justify-center gap-10 p-10 sm:gap-4 sm:p-5">
        {recommendations.map((item) => (
          <button
            key={item.id}
            className="w-[290px] h-[340px] flex flex-col items-center justify-center rounded-lg overflow-hidden transition-transform duration-500 ease-in-out hover:scale-110 hover:bg-blue-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[95%] h-[85%] object-cover rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
            />
            <span className="mt-2 text-sm font-bold text-white sm:text-base hover:text-gray-900 hover:drop-shadow-none" style={{textShadow: "1px 1px 2px black"}}>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;