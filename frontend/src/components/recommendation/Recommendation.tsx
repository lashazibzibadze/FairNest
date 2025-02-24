import "./Recommendation.css"
import Manhattan from "../../assets/Recommendation/Manhattan.jpg"
import Bronx from "../../assets/Recommendation/Bronx.jpg"
import Queens from "../../assets/Recommendation/Queens.jpg"
import Brooklyn from "../../assets/Recommendation/Brooklyn.jpg"
import StatenIsland from "../../assets/Recommendation/Staten_island.jpg"

const recommendations =[
  { id: 1, title: "Manhattan", img: Manhattan },
  { id: 2, title: "Bronx", img: Bronx},
  { id: 3, title: "Queens", img: Queens },
  { id: 4, title: "Brooklyn", img: Brooklyn },
  { id: 5, title: "Staten Island", img: StatenIsland },
]

const Recommendation: React.FC = () => {
  return (
    <div className="panel">
      
      <div className="header-container">
        <h2 className="recommendation-header">Explore NYC Neighborhoods</h2>
      </div>

      <div className="recommendation-container">
        {recommendations.map((item) => (
          <button key={item.id} className="recommendation-button">
            <img src={item.img} alt={item.title} className="recommendation-image" />
            <span className="recommendation-title">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Recommendation;
