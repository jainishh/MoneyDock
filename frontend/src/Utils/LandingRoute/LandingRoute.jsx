import { Routes, Route } from "react-router-dom";
import HomePage from "../../Pages/landing_page/home/HomePage";
import AboutPage from "../../Pages/landing_page/about/AboutPage";
import PricingPage from "../../Pages/landing_page/pricing/PricingPage";
import ProductsPage from "../../Pages/landing_page/products/ProductsPage";
import Signup from "../../Pages/landing_page/signup/Signup";
import SupportPage from "../../Pages/landing_page/support/SupportPage";
import Navbar from "../../Pages/landing_page/Navbar";
import Footer from "../../Pages/landing_page/Footer";
import ScrollToTop from "../../Pages/landing_page/ScrollToTop";

function LandingRoute() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup defaultIsLogin={true} />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
      <Footer />
    </>
  );
}
export default LandingRoute;
