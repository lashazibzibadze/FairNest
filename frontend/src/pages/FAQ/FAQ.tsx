import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import Background_FAQ from "../../assets/FAQ_Background.svg";
import { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What is FairNest?",
    answer:
      "FairNest is a platform that ensures fairness in housing listings by ranking properties based on unbiased criteria.",
  },
  {
    question: "How does FairNest rank listings?",
    answer:
      "We use algorithms and user feedback to rank listings based on transparency, affordability, and fairness.",
  },
  {
    question: "Is FairNest free to use?",
    answer:
      "Yes, FairNest is completely free for users who are looking for homes. We may offer premium services for businesses in the future.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach out to our support team via our Contact Us page or email us at support@fairnest.com.",
  },
  {
    question: "Can I list my property on FairNest?",
    answer: "No, currently we do not offer a platform for listing properties.",
  },
  {
    question: "Does FairNest provide loan services?",
    answer:
      "No, FairNest does not provide mortgage or loan services. We only rank properties based on fairness.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const switchFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat pt-24"
      style={{ backgroundImage: `url(${Background_FAQ})` }}
    >
      <Navbar />
      <div className="max-w-3xl mx-auto my-10 px-6 text-left font-bold flex-1">
        <h2 className="text-5xl md:text-6xl font-semibold mb-5 text-white drop-shadow-lg text-center">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4 pt-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-300 rounded-xl overflow-hidden bg-gray-200 transition-all duration-300 ${
                openIndex === index ? "max-h-[1000px]" : "max-h-20 md:max-h-14"
              }`}
            >
              <button
                className="flex justify-between items-center w-full p-4 text-lg font-semibold cursor-pointer md:hover:bg-cyan-100 transition-all text-left whitespace-normal break-words"
                onClick={() => switchFAQ(index)}
              >
                {faq.question}
                <span
                  className={`text-xl transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  &#x25BC;
                </span>
              </button>
              <div
                className={`px-4 pb-4 text-left text-base font-semibold transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;