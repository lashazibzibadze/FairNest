import "./Background.css"
import { useEffect, useState } from "react";

const backgroundImages = [
  "/Background/Sunny_1.jpg",
  "/Background/Sunny_2.jpg",
  "/Background/Sunny_3.jpg",
];

const Background = ({ heroCount }: { heroCount: number }) => {
  const [currentImage, setCurrentImage] = useState(backgroundImages[heroCount]);
  const [prevImage, setPrevImage] = useState(backgroundImages[heroCount]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const switchTimeout = setTimeout(() => {
      setPrevImage(currentImage);
      setCurrentImage(backgroundImages[heroCount]);
      setFade(false);
    }, 1000);
    return () => clearTimeout(switchTimeout);
  }, [heroCount]);

  return (
    <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden brightness-75">
      {/* Previous Image*/}
      <div
        className="absolute w-full h-full bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: `url(${prevImage})` }}
      />

      {/* Current Image*/}
      <div
        className={`absolute w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${currentImage})` }}
      />
    </div>
  );
};

export default Background;