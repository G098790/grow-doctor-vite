import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/grow.jpeg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <img src={logo} alt="GrowDoctor" className="h-12 w-auto rounded-md bg-white p-1" />
          <p className="mt-4 text-sm text-primary-foreground/70">
            Empowering healthcare professionals worldwide with digital growth, branding, and AI solutions.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/services" className="hover:text-secondary">Services</Link></li>
            <li><Link to="/solutions" className="hover:text-secondary">Solutions</Link></li>
            <li><Link to="/about" className="hover:text-secondary">About</Link></li>
            <li><Link to="/resources" className="hover:text-secondary">Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li>Career Accelerator</li>
            <li>Personal Branding</li>
            <li>Clinic Marketing</li>
            <li>Healthcare AI</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary" /> hello@growdoctor.io</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-secondary" /> +91 90000 00000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> Defenceminia Technologies Pvt Ltd</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-primary-foreground/60 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} GrowDoctor Digital Solutions. A Defenceminia Technologies product.
      </div>
    </footer>
  );
}