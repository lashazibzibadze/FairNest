import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/Main/Main";
import AboutPage from "./pages/About/About";
import ListingsPage from "./pages/Listings/Listings";
import FAQPage from "./pages/FAQ/FAQ";
import ContactPage from "./pages/Contact/Contact";
import "./app.css";

const App = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="/home" />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};

export default App;