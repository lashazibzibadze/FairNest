import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import HamburgerMenu from "../../assets/burger-menu.svg";
import SignIn from "../Authentication/SignIn";
import SignOut from "../Authentication/Logout";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const roles = user?.["https://fairnest-api.us.com/roles"] || [];
  const isAdmin = roles.includes("Admin");

  return (
    <nav className="fixed top-0 left-0 w-full h-24 px-6 flex items-center justify-between text-white z-[9999] backdrop-blur-lg">
      {/* Main navigation container */}
      <div className="w-full flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2">
            <img
              src="/Bird-Logo.png"
              alt="Logo"
              className="w-18 h-12 drop-shadow-[0_0_3px_#434343]"
            />
            <div className="text-3xl font-semibold text-[#434343]">
              FairNest
            </div>
          </Link>
        </div>

        {/*Navigation Links*/}
        <ul className="hidden xxl:hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl gap-6 text-[#434343] drop-shadow-[0_0_0.3px_#000000]">
          <li>
            <Link to="/home" className="hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-500">
              About
            </Link>
          </li>
          <li>
            <Link to="/listings" className="hover:text-gray-500">
              Listings
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-gray-500">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-500">
              Contact Us
            </Link>
          </li>
          <li>
            {isAuthenticated && user ? (
              <Link to="/my-listings" className="hover:text-gray-500">
                My Listings
              </Link>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="hover:text-gray-500"
              >
                My Listings
              </button>
            )}
          </li>
          <li>
            {isAuthenticated && user ? (
              <Link to="/favorites" className="hover:text-gray-500">
                Favorites
              </Link>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="hover:text-gray-500"
              >
                Favorites
              </button>
            )}
          </li>
          {isAuthenticated && isAdmin && (
            <li>
              <Link to="/admin" className="text-red-800 hover:text-red-500">
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Right: Auth Buttons */}
        <div className="hidden md:block xxl:hidden">
          <SignIn />
          <SignOut />
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="xxl:flex hidden items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <img src={HamburgerMenu} alt="Menu" className="w-9 h-9" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-[60px] left-1/2 transform -translate-x-1/2 w-4/5 bg-gray-400 rounded-lg text-center p-5 flex flex-col gap-4 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
        }`}
      >
        <Link
          to="/home"
          className="text-[#434343] hover:text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-[#434343] hover:text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          About
        </Link>
        <Link
          to="/listings"
          className="text-[#434343] hover:text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          Listings
        </Link>
        <Link
          to="/faq"
          className="text-[#434343] hover:text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          FAQ
        </Link>
        <Link
          to="/contact"
          className="text-[#434343] hover:text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          Contact Us
        </Link>

        {isAuthenticated && user ? (
          <Link
            to="/my-listings"
            className="text-[#434343] hover:text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            My Listings
          </Link>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="text-[#434343] hover:text-gray-500"
          >
            My Listings
          </button>
        )}

        {isAuthenticated && user ? (
          <Link
            to="/favorites"
            className="text-[#434343] hover:text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            Favorites
          </Link>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="text-[#434343] hover:text-gray-500"
          >
            Favorites
          </button>
        )}

        {isAuthenticated && isAdmin && (
          <li>
            <Link to="/admin" className="text-red-800 hover:text-red-500">
              Admin
            </Link>
          </li>
        )}

        <div className="self-center" onClick={() => setIsOpen(false)}>
          <SignIn />
          <SignOut />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
