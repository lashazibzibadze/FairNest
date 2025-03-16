import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import Recommendation from "../../components/recommendation/Recommendation";
import { FaGithub } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <div className="pt-16">
      <Navbar />
      {/* Banner Section*/}
      <section
        className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/Background/Banner_Sketch.jpg')" }}
      >
        <div
          className="text-center px-5"
          style={{
            textShadow:
              "1px 1px 10px rgb(52, 52, 53), 1px -1px #080808, 1px 1px #0f0f0f",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">About FairNest</h1>
          <p className="mt-3 text-lg md:text-xl">
            Making Fair Housing Accessible for Everyone
          </p>
        </div>
      </section>

      {/*What We Do*/}
      <section className="container mx-auto px-6 py-14 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-white" style={{textShadow: "1px 1px 2px black"}}>What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">🏡 Fair Housing Rankings</h3>
            <p className="mt-2 text-gray-600">
              Listings ranked fairly based on unbiased data.
            </p>
          </div>
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">📊 Data-Driven Insights</h3>
            <p className="mt-2 text-gray-600">
              Helping users make informed decisions with real data.
            </p>
          </div>
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">🔍 Smart Search & Filters</h3>
            <p className="mt-2 text-gray-600">
              Easily find the right home with our intuitive search.
            </p>
          </div>
        </div>
      </section>

      {/* Why FairNest? */}
      <section className="container mx-auto px-6 text-center text-white py-14">
          <h2 className="text-3xl font-semibold mb-8" style={{textShadow: "1px 1px 2px black"}}>Why FairNest?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
            <div className="p-6 bg-blue-300 rounded-lg">
              <h3 className="text-xl font-bold">🌍 Transparent</h3>
              <p className="mt-2 text-gray-600">
                Designed for fairness and accessibility.
              </p>
            </div>
            <div className="p-6 bg-blue-300 rounded-lg">
              <h3 className="text-xl font-bold">🧑‍🤝‍🧑 Community Driven</h3>
              <p className="mt-2 text-gray-600">
                We prioritize fair and ethical real estate listings.
              </p>
            </div>
            <div className="p-6 bg-blue-300 rounded-lg">
              <h3 className="text-xl font-bold">🗺️ Location-Based Insights</h3>
              <p className="mt-2 text-gray-600">
                Helping you find the best home in the right location.
              </p>
            </div>
          </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-14 text-center">
        <h2 className="text-3xl text-white font-semibold mb-6" style={{textShadow: "1px 1px 2px black"}}>How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">Search for Listings</h3>
            <p className="mt-2 text-gray-600">
              Find properties based on your preferences.
            </p>
          </div>
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">View Fair Rankings</h3>
            <p className="mt-2 text-gray-600">
              See how listings rank based on fairness.
            </p>
          </div>
          <div className="p-6 bg-blue-300 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">Make the Right Choice</h3>
            <p className="mt-2 text-gray-600">
              Find the perfect home with confidence.
            </p>
          </div>
        </div>
      </section>

      {/*Action*/}
      <section className="text-white py-14 text-center">
        <Recommendation />
        <h2 className="text-3xl font-semibold" style={{textShadow: "1px 1px 2px black"}}>
          Start Your Fair Housing Journey!
        </h2>
        <p className="mt-3">Find your dream home with FairNest today.</p>
        <a
          href="/listings"
          className="mt-4 inline-block bg-blue-300 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          style={{textShadow: "1px 1px 2px black"}}
        >
          Get a Fair Deal
        </a>
      </section>

      {/*Socials*/}
      <section className="text-white py-14 text-center">
        <h2 className="text-3xl font-semibold" style={{textShadow: "1px 1px 2px black"}}>Project Repository</h2>
        <p className="mt-3">Follow us on GitHub.</p>
        <div className="mt-6 flex justify-center space-x-6">
          <a
            href="https://github.com/lashazibzibadze/FairNest"
            className="text-2xl text-white hover:text-blue-600"
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