import { useState } from "react";
import "./Navbar.css";
import HamburgerMenu from "../../assets/burger-menu.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">

      <div className="nav-container">
        <div className="nav-logo">FairNest</div>

        <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Listings</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <div className="nav-button-signin">
          <a href="#" className="nav-signin">Sign In</a>
        </div>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <img src={HamburgerMenu} alt="Menu" className="hamburger-logo" />
      </div>
    </nav>
  );
};

export default Navbar;

