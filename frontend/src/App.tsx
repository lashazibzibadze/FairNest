import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages/Main/Main";
import AboutPage from "./pages/About/About";
import ListingsPage from "./pages/Listings/Listings";
import FAQPage from "./pages/FAQ/FAQ";
import ContactPage from "./pages/Contact/Contact";
import SignInPage from "./pages/Sign In/SignIn";

import "./app.css";

//Query Client for Listings
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="" element={<Navigate to="/home" />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;