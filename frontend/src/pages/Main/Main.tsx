import { useEffect, useState } from "react"
import Background from "../../components/background/Background";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
// import Recommendation from "../../components/recommendation/Recommendation";
// import Footer from "../../components/footer/footer";
import '../../App.css';

const heroData = [
  { text1: "Find Your", text2: "Fair and Square" },
  { text1: "Where Everyone", text2: "Has a Fair Choice" },
  { text1: "Honest Housing", text2: "For Good People" },
];

const Main = () => {
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count + 1) % heroData.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="body-container">
      <div className="hero-container">
        <Navbar/>
        <Background/>
        <Hero
          heroData={heroData[heroCount]}
          heroCount={heroCount}
        />
      </div>
{/* 
      <div className="lower-container">
        <Recommendation />
        <Footer />
      </div> */}
    </div>
  )

}

export default Main