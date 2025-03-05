import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
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
    answer:
      "No, currently we do not offer a platform for listing properties.",
  },
  {
    question: "Does FairNest provide loan services?",
    answer:
      "No, FairNest does not provide mortgage or loan services. We only rank properties based on fairness.",
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const switchFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-body">
      <Navbar />
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
              <button className="faq-question" onClick={() => switchFAQ(index)}>
                {faq.question}
                <span
                  className={`faq-icon ${openIndex === index ? "open" : ""}`}
                >
                  &#x25BC;
                </span>
              </button>
              <div
                className={`faq-answer ${openIndex === index ? "visible" : ""}`}
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
