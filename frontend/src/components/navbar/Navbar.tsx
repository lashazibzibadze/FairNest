import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import HamburgerMenu from "../../assets/burger-menu.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-5 text-white z-[9999] bg-[rgba(50,50,50,0.8)] backdrop-blur-md">
      <div className="flex items-center w-full">
        <div className="text-3xl font-semibold text-white drop-shadow-[0_0_3px_#007bff]">
          FairNest
        </div>

        <ul className={`hidden md:flex flex-grow justify-start items-center text-lg gap-6 pl-16`}>
          <li><Link to="/home" className="text-white hover:text-cyan-100">Home</Link></li>
          <li><Link to="/about" className="text-white hover:text-cyan-100">About</Link></li>
          <li><Link to="/listings" className="text-white hover:text-cyan-100">Listings</Link></li>
          <li><Link to="/faq" className="text-white hover:text-cyan-100">FAQ</Link></li>
          <li><Link to="/contact" className="text-white hover:text-cyan-100">Contact Us</Link></li>
        </ul>

        <div className="hidden md:block">
          <Link to="/signin" className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-center hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <img src={HamburgerMenu} alt="Menu" className="w-9 h-9" />
        </button>
      </div>

      <div className={`absolute top-[60px] left-1/2 transform -translate-x-1/2 w-4/5 bg-gray-800 rounded-lg text-center p-5 flex flex-col gap-4 transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"}`}>
        <Link to="/home" className="text-white hover:text-lightblue" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/about" className="text-white hover:text-lightblue" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/listings" className="text-white hover:text-lightblue" onClick={() => setIsOpen(false)}>Listings</Link>
        <Link to="/faq" className="text-white hover:text-lightblue" onClick={() => setIsOpen(false)}>FAQ</Link>
        <Link to="/contact" className="text-white hover:text-lightblue" onClick={() => setIsOpen(false)}>Contact Us</Link>
        <Link to="/signin" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => setIsOpen(false)}>Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;