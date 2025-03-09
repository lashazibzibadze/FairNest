import "./Footer.css";

const Footer = () => {
  return (
    <footer className="text-white py-5 text-center w-full">
      <div className="flex flex-col items-center justify-center gap-3">
        <p>© {new Date().getFullYear()} FairNest. All Rights Reserved.</p>
        <ul className="flex gap-6 list-none">
          <li>
            <a href="#" className="text-whitesmoke transition-colors duration-300 hover:text-cyan-100">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="text-whitesmoke transition-colors duration-300 hover:text-cyan-100">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="text-whitesmoke transition-colors duration-300 hover:text-cyan-100">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;