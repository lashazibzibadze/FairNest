import "./Background.css";
import background1 from "../../assets/Background/Sunny_1.jpg";
import background2 from "../../assets/Background/Sunny_2.jpg";
import background3 from "../../assets/Background/Sunny_3.jpg";
import { useEffect } from "react";
import { useState } from "react";

const backgroundImages = [background1, background2, background3];

const Background = ({ heroCount }: { heroCount: number }) => {
  const [prevImage, setPrevImage] = useState(backgroundImages[heroCount]);
  const [currentImage, setCurrentImage] = useState(backgroundImages[heroCount]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);

    const switchTimeout = setTimeout(() => {
      setPrevImage(currentImage);
      setCurrentImage(backgroundImages[heroCount]);
    }, 300);

    const fadeTimeout = setTimeout(() => {
      setFade(false);
    }, 900);

    return () => {
      clearTimeout(switchTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [heroCount]);

  return (
    <div className="background-container">
      <div
        className={`background ${fade ? "fade-out" : ""}`}
        style={{ backgroundImage: `url(${prevImage})` }}
      />
      <div
        className={`background ${fade ? "fade-in" : ""}`}
        style={{ backgroundImage: `url(${currentImage})` }}
      />
    </div>
  );
};

export default Background;