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
import ListingDetails from "./pages/ListingDetails/ListingDetails";
import AdminPage from "./pages/Admin/admin";
import CreateListingPage from "./pages/create-listing/CreateListingPage";
import MyListingPage from "./pages/my-listing/MyListingPage";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="/home" />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/create-listing" element={<CreateListingPage />} />
      <Route path="my-listings" element={<MyListingPage />} />
    </Routes>
  );
};

export default App;