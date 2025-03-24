import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import FAQ_Image from "../../assets/FAQ_Background.svg";
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
  {
    question: "Are FairNest's fairness scores accurate?",
    answer:
      "Yes, FairNest's fairness scores are based on thorough algorithms and user feedback to ensure accuracy.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const switchFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat pt-16">
      <Navbar />

      {/* Main Content*/}
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-16 pt-24">
        {/* Title */}
        <h2
          className="text-5xl md:text-6xl font-semibold text-white text-center drop-shadow-lg mb-10 p-4"
          style={{
            textShadow:
              "1px 1px 10px rgb(52, 52, 53), 1px -1px #080808, 1px 1px #0f0f0f",
          }}
        >
          Frequently Asked Questions
        </h2>

        {/* Container FAQ + Image*/}
        <div className="flex flex-col md:flex-row justify-center items-start gap-14 w-full">
          {/* FAQ Section*/}
          <div className="w-full md:w-[95%]">
            <div className="flex flex-col gap-5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border border-gray-300 rounded-xl overflow-hidden bg-gray-200 transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-[1000px]"
                      : "max-h-24 md:max-h-16"
                  }`}
                >
                  <button
                    className="flex justify-between items-center w-full p-5 text-xl md:text-lg font-semibold cursor-pointer md:hover:bg-cyan-100 transition-all text-left"
                    onClick={() => switchFAQ(index)}
                  >
                    {faq.question}
                    <span
                      className={`text-2xl transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      &#x25BC;
                    </span>
                  </button>
                  <div
                    className={`px-5 pb-5 text-left text-lg font-medium transition-all duration-300 ${
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

          {/* Image Section*/}
          <div className="hidden lg:flex w-full md:w-[100%] justify-center">
            <img
              src={FAQ_Image}
              alt="FAQ Background"
              className="w-[100%] object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Footer*/}
      <Footer />
    </div>
  );
};

export default FAQ;
