import "./Background.css";
import background1 from "../../assets/Background/background_1.jpg";
import background2 from "../../assets/Background/background_2.jpg";
import background3 from "../../assets/Background/background_3.jpg";


const backgroundImages = [background1, background2, background3];

const Background = ({ heroCount }: { heroCount: number }) => {  
  return <div className="background" style={{ backgroundImage: `url(${backgroundImages[heroCount]})` }} />;
}

export default Background;
