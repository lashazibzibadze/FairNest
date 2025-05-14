import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import ContactBanner from "../../assets/Contact_Background.svg";
import "./Contact.css";

const Contact = () => {
  //state to manage form inputs and submission status
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  //state to manage submission status, loading state, and error messages
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //function to handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //function to handle form submission
  // using async/await for better readability and error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    //basic validation for required fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contacts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send message.");
      }

      setSent(true);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        message: "",
      });

      //hide message after 5 seconds
      setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-[4%] bg-gray-300">
      <Navbar />

      {/*banner Section */}
      <div
         className="relative bg-fill bg-center w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center text-center"
        style={{ backgroundImage: `url(${ContactBanner})` }}
      >
        <div className="absolute inset-0"></div>
        <div
          className="relative z-10 text-white px-6 drop-shadow-[0_0_2px_#434343]"
        >
          <h1 className="text-5xl md:text-6xl font-bold">Contact Us</h1>
          <p className="text-lg md:text-xl mt-4">
            Have questions? Reach out and we'll get back to you as soon as
            possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-start gap-10 px-6 md:px-16 max-w-7xl mx-auto -mt-6 md:mt-16">
        {/* Left Side Info */}
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

        {/* Contact Form */}
        <div className="w-full md:w-[50%] bg-white shadow-2xl rounded-lg p-8 -mt-20 md:-mt-32 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Leave Us a Message
          </h2>
          {sent && (
            <div className="text-green-600 font-semibold mb-4">
              Message sent successfully!
            </div>
          )}
          {error && (
            <div className="text-red-500 font-medium mb-4">{error}</div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                required
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              />
              <input
                required
                type="text"
                name="last_name"
                placeholder="Surname"
                value={form.last_name}
                onChange={handleChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <input
              required
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <textarea
              required
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
