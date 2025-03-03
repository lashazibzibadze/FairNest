import React, { useCallback, useEffect, useState } from 'react'
import './Hero.css'
import ArrowButton from "../../assets/next.png"

interface HeroProps {
  heroData: { text1: string; text2: string };
  setHeroCount: (count: number) => void;
  heroCount: number;
}

const Hero: React.FC<HeroProps> = ({ heroData, setHeroCount, heroCount }) => {
    const [fade, setFade] = useState(false);
    const [previousText, setPreviousText] = useState(heroData);
    useEffect(() => {
        setFade(true);

        const textTimeout = setTimeout(() => {
            setPreviousText(heroData);
            setFade(false);
        }, 800);

        return () => clearTimeout(textTimeout);
    }
    , [heroCount]);

    const handleHeroCount = (count: number) => {
        if (count !== heroCount) {
            setFade(true);
            setTimeout(() => {
                setHeroCount(count);
                setFade(false);
            }, 800);
        }
    };

    return (

        <div className="hero">

            <div className="hero-text-container">
                <div className={`hero-text ${fade ? "fade-out" : "fade-in"}`}>
                    <p>{previousText.text1}</p>
                    <p>{previousText.text2}</p>
                </div>
            </div>

            
            <div className="hero-explore">
                <p>Get a Fair Deal</p>
                <img src={ArrowButton} alt="Next" className="arrow-image" />
            </div>
            <div className="hero-dot-show">
                <ul className="hero-dots">
                    {[0, 1, 2].map((num) => ( 
                        <li key={num} className={heroCount === num ? "hero-dot blue" : "hero-dot"}></li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Hero
