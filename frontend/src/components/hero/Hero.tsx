import React, { useCallback, useEffect, useState } from "react";
import "./Hero.css";
import Search_bar from "../search_bar/Search_bar";

interface HeroProps {
  heroData: { text1: string; text2: string };
  heroCount: number;
}

const Hero: React.FC<HeroProps> = ({ heroData, heroCount }) => {
  const [fade, setFade] = useState(false);
  const [previousText, setPreviousText] = useState(heroData);

  useEffect(() => {
    setFade(true);
    const textTimeout = setTimeout(() => {
      setPreviousText(heroData);
      setFade(false);
    }, 800);
    return () => clearTimeout(textTimeout);
  }, [heroCount]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[87vh] mt-0 z-10">
      {/* Hero Text */}
      <div className="relative min-h-[120px] text-center">
        <div
          className={`text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-tight max-w-[2000px] py-4 rounded-lg drop-shadow-[0px_4px_20px_rgba(0,0,0,0.8)] transition-opacity duration-1000 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <p>{previousText.text1}</p>
          <p>{previousText.text2}</p>
        </div>
      </div>

      {/* Search Bar */}
      <Search_bar />
    </div>
  );
};

export default Hero;