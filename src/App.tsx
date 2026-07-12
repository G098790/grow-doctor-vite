import { Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import AboutPage from "@/pages/About";
import CartPage from "@/pages/Cart";
import ContactPage from "@/pages/Contact";
import LoginPage from "@/pages/Login";
import ProfilePage from "@/pages/Profile";
import RegisterPage from "@/pages/Register";
import ResourcesPage from "@/pages/Resources";
import ServicesPage from "@/pages/Services";
import SolutionsPage from "@/pages/Solutions";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
