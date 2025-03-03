import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import HamburgerMenu from "../../assets/burger-menu.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">FairNest</div>

        <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/listings">Listings</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li className="singin-hamburger"><Link to="/signin">Sign In</Link></li>
        </ul>

        <div className="nav-button-signin">
          <Link to="/signin" className="nav-signin">Sign In</Link>
        </div>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <img src={HamburgerMenu} alt="Menu" className="hamburger-logo" />
      </div>
      
    </nav>
  );
};

export default Navbar;