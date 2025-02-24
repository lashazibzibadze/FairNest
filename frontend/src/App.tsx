import { useEffect, useState } from "react"
import Background from "./components/background/Background";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import Recommendation from "./components/recommendation/recommendation";
import './app.css';

const heroData = [
  { text1: "Find Your", text2: "Fair and Square" },
  { text1: "Where Everyone", text2: "Have Fair Choice" },
  { text1: "Honest Housing", text2: "For Good People" },
];

const App = () => {
  const [heroCount, setHeroCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count + 1) % heroData.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="hero-container">
        <Navbar/>
        <Background heroCount={heroCount}/>
        <Hero
          heroData={heroData[heroCount]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
        />
      </div>
      
      <Recommendation/>
    </div>
  )
}

export default App
