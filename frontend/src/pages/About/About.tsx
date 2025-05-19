import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import Recommendation from "../../components/recommendation/Recommendation";
import { FaGithub } from "react-icons/fa";
import "./About.css";
import QuestionMark from "../../assets/bird-with-key.webp";
import MagnifyingGlass from "../../assets/bird-with-magnifying-glass.webp";
import Flag from "../../assets/bird-with-flag.webp";
import Pen from "../../assets/bird-with-pen.webp";
import Heart from "../../assets/bird-with-heart.webp";

type Card = {
  title: string;
  image: string;
  text: string;
};

const aboutCards: Card[] = [
  {
    title: "Why FairNest?",
    image: QuestionMark,
    text: "We often struggled to understand whether a listing was fairly priced based on its borough or neighborhood. That frustration inspired us to build FairNest—a platform designed to make this confusing process simpler and more transparent for everyone.",
  },
  {
    title: "What We Do",
    image: MagnifyingGlass,
    text: "FairNest is built for fairness and accessibility. We prioritize ethical and inclusive listings, and our location insights help you find the right home in the right place.",
  },
  {
    title: "Our Mission",
    image: Flag,
    text: "Our mission is to ensure fair and accessible housing for everyone. We strive to create a transparent and inclusive platform that empowers users to make informed decisions.",
  },
  {
    title: "How It Works",
    image: Pen,
    text: "We analyze listings for fairness and provide clear, unbiased information. Our algorithm ranks properties based on various factors, including price, location, and more.",
  },
  {
    title: "Why It Matters",
    image: Heart,
    text: "Fair housing is essential for building strong, inclusive communities. By promoting transparency and fairness, we help ensure everyone has access to a safe and affordable home.",
  },
];

const About = () => {
  return (
    <div className="pt-[4.1%] bg-gray-300">
      <Navbar />
      {/* Banner Section*/}
      <section
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{ backgroundImage: "url('/Background/Banner_Sketch.jpg')" }}
      >
        <div className="text-center px-5 text-[#ffffff] drop-shadow-[0_0_3px_#000000]">
          <h1 className="text-5xl md:text-6xl font-bold ">About FairNest</h1>
          <p className="mt-3 text-lg md:text-xl">
            Making Fair Housing Accessible for Everyone
          </p>
        </div>
      </section>

      {/* Information Cards */}
      <div className="flex flex-wrap justify-center gap-10 p-10 sm:gap-4 pt-1 md:gap-10 md:pt-16">
        <div className="flex flex-wrap justify-center gap-10 p-10 pt-24">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="w-[290px] h-[340px] md:w-80 md:h-96 relative group rounded-lg overflow-hidden bg-white bg-opacity-75 hover:bg-white shadow-md hover:shadow-lg transition-transform duration-500 ease-in-out hover:scale-110"
            >
              {/*Image */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-[75%] object-scale-down rounded-t-lg transition-opacity duration-300 group-hover:opacity-0 pt-8 drop-shadow-[0_0_3px_#007bff]"
              />
              {/* Title*/}
              <span className="block text-center text-sm font-bold text-black sm:text-base md:text-2xl mt-3 transition-opacity duration-300 group-hover:opacity-0">
                {card.title}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-95 text-black p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center gap-3 text-left">
                <h3 className="text-2xl font-bold text-center">{card.title}</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left px-1">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Action*/}
      <section className="text-[#434343] py-14 text-center">
        <Recommendation />
        <h2 className="text-3xl md:text-4xl font-semibold">
          Start Your Fair Housing Journey!
        </h2>
        <p className="mt-3">Find your dream home with FairNest today.</p>
        <a
          href="/listings"
          className="mt-4 inline-block bg-[#434343] hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Get a Fair Deal
        </a>
      </section>

      {/*Socials*/}
      <section className="text-[#434343] py-14 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Project Repository
        </h2>
        <p className="mt-3">Follow us on GitHub.</p>
        <div className="mt-6 flex justify-center space-x-6">
          <a
            href="https://github.com/lashazibzibadze/FairNest"
            className="text-2xl text-[#434343] hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
