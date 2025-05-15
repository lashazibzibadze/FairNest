import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-[#434343] py-5 text-center w-full">
      <div className="flex flex-col items-center justify-center gap-3">
        <p>© {new Date().getFullYear()} FairNest. All Rights Reserved.</p>
        <ul className="flex gap-6 list-none">
          <li>
            <Link to="/privacy-policy" className="text-whitesmoke transition-colors duration-300 hover:text-gray-600">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-of-service" className="text-whitesmoke transition-colors duration-300 hover:text-gray-600">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-whitesmoke transition-colors duration-300 hover:text-gray-600">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;