import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import ContactBanner from "../../assets/Contact_Background.svg";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Navbar */}
      <Navbar />

      {/* Banner Section */}
      <div
        className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${ContactBanner})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Banner Text */}
        <div
          className="relative z-10 text-white px-6"
          style={{
            textShadow:
              "1px 1px 10px rgb(52, 52, 53), 1px -1px #080808, 1px 1px #0f0f0f",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold">Contact Us</h1>
          <p className="text-lg md:text-xl mt-4">
            Have questions? Reach out and we'll get back to you as soon as
            possible.
          </p>
        </div>
      </div>

      {/* Main Content*/}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-start gap-10 px-6 md:px-16 max-w-7xl mx-auto -mt-6 md:mt-16">
        {/* Informational Text*/}
        <div className="hidden md:flex flex-col w-full md:w-[55%] bg-white shadow-lg p-9 rounded-lg relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            What Happens Next?
          </h2>
          <p className="text-gray-700 text-lg">
            Once you submit your message, our team will review your request and
            get back to you within 24-48 hours. You will receive an email
            confirmation with your request details.
          </p>
          <p className="text-gray-700 text-lg mt-3">
            If you need immediate assistance, feel free to email us at{" "}
            <span className="font-bold text-cyan-500">
              support@fairnest.com
            </span>
            .
          </p>
        </div>

        {/* Survey Form*/}
        <div className="w-full md:w-[50%] bg-white shadow-2xl rounded-lg p-8 -mt-20 md:-mt-32 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Leave Us a Message
          </h2>
          <form className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                required
                type="text"
                name="name"
                placeholder="First Name"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              />
              <input
                required
                type="text"
                name="surname"
                placeholder="Surname"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <input
              required
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <input
              required
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <textarea
              required
              name="comment"
              placeholder="Your Message"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            ></textarea>

            <button
              className="w-full bg-cyan-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;