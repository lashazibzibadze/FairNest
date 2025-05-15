import { NavbarWrapper } from "../../utils/NavbarWrapper";
import Footer from "../../components/footer/footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      <NavbarWrapper>
        <section className="flex-grow max-w-4xl mx-auto px-6 py-10 text-gray-800">
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:p-10 text-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Privacy Policy</h1>

            <p className="mb-4 pt-10">
              At <strong>FairNest</strong>, we are committed to protecting your
              privacy. This Privacy Policy outlines how we collect, use, and
              safeguard information when you visit or use our website.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2 pt-5">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We do not require users to submit personal information to browse
              listings. However, if you choose to create an account or save
              favorites, we may collect your name, email address, and login
              credentials.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              2. How We Use Information
            </h2>
            <p className="mb-4">
              We use your information to provide core functionality like account
              creation, saved listings, and personalized experiences. We do not
              sell or share your information with third-party advertisers.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              3. Web Scraping and Third-Party Data
            </h2>
            <p className="mb-4">
              FairNest collects publicly available housing data from third-party
              sources such as Realtor.com. This information is used solely to
              assess and rank listings based on fairness criteria. We do not
              claim ownership of this scraped content.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              4. Cookies and Analytics
            </h2>
            <p className="mb-4">
              We may use cookies and third-party analytics tools to understand
              user engagement and improve site performance. These tools may
              collect anonymized traffic data such as device type, region, and
              pages visited.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              5. Data Security
            </h2>
            <p className="mb-4">
              We implement reasonable security measures to protect your data.
              However, no internet transmission or storage system is completely
              secure.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              6. Changes to This Policy
            </h2>
            <p className="mb-4">
              This Privacy Policy may be updated from time to time. Changes will
              be posted on this page, and continued use of the site constitutes
              acceptance of the updated terms.
            </p>

            <p className="mt-8">
              If you have any questions about this Privacy Policy, please
              contact us via <strong>Contact Us Page</strong>.
            </p>
          </div>
        </section>
      </NavbarWrapper>
      <Footer />
    </div>
  );
}
