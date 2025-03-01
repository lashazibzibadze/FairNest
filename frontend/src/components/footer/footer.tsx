import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} FairNest. All Rights Reserved.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};
export default Footer;