import React, { useCallback } from 'react'
import './Hero.css'
import ArrowButton from "../../assets/next.png"

interface HeroProps {
  heroData: { text1: string; text2: string };
  setHeroCount: (count: number) => void;
  heroCount: number;
}

const Hero: React.FC<HeroProps> = ({ heroData, setHeroCount, heroCount }) => {
    const handleHeroCount = useCallback((count: number) => setHeroCount(count), [setHeroCount]);

    return (

        <div className="hero">
            <div className="hero-text">
                <p>{heroData.text1}</p>
                <p>{heroData.text2}</p>
            </div>
            <div className="hero-explore">
                <p>Get a Fair Deal</p>
                <img src={ArrowButton} alt="Next" className="arrow-image" />
            </div>
            <div className="hero-dot-show">
                <ul className="hero-dots">
                    {[0, 1, 2].map((num) => ( 
                        <li key={num} onClick={() => handleHeroCount(num)} className={heroCount === num ? "hero-dot blue" : "hero-dot"}></li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Hero
