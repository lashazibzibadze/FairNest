import { NavbarWrapper } from "../../utils/NavbarWrapper";
import Footer from "../../components/footer/footer";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      <NavbarWrapper>
        <section className="flex-grow max-w-4xl mx-auto px-6 py-10 text-gray-800">
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:p-10 text-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Terms of Service</h1>

            <p className="pt-10 mb-4">
              Welcome to <strong>FairNest</strong>. By accessing or using our
              website, you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use the site.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              1. Purpose of the Website
            </h2>
            <p className="mb-4">
              FairNest is designed to provide insights into housing fairness by
              evaluating and ranking real estate listings in New York City based
              on objective criteria. The site is intended for informational
              purposes only.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              2. Data Sources and Attribution
            </h2>
            <p className="mb-4">
              Listings and housing data are collected from publicly available
              sources such as Realtor.com using automated methods. We do not own
              or guarantee the accuracy of third-party listing content. All
              trademarks and copyrights belong to their respective owners.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              3. User Responsibilities
            </h2>
            <p className="mb-4">
              Users agree not to misuse the platform, submit false data, or
              attempt to reverse-engineer or scrape the website. You are
              responsible for your account activity and compliance with all
              local laws.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              4. Intellectual Property
            </h2>
            <p className="mb-4">
              All original content on FairNest (e.g., fairness scores, UI
              design, and analysis algorithms) is the intellectual property of
              the FairNest team. You may not reuse this content without written
              permission.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">5. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate accounts or access to
              the site if users violate these terms.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              6. Disclaimer of Warranty
            </h2>
            <p className="mb-4">
              FairNest is provided “as is.” We make no warranties, express or
              implied, about the accuracy or reliability of the data presented.
              Fairness scores are based on internal models and do not guarantee
              actual market conditions.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">7. Contact</h2>
            <p className="mb-4">
              For any questions about these Terms of Service, please contact us
              via <strong>Contact Us</strong> page.
            </p>
          </div>
        </section>
      </NavbarWrapper>
      <Footer />
    </div>
  );
}
