import { motion } from "framer-motion";
import {
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import Afkitlogo from "../../assets/afkit-logo.png";

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 py-16 mt-auto border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col space-y-6">
            <img
              src={Afkitlogo}
              alt="Afkit Logo"
              className="h-6 w-fit"
            />
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Your trusted partner for premium UK-used gadgets in Nigeria. 
              Quality verified, 6-month warranty, and nationwide delivery.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, color: "#1e3a8a" }}
                href="https://x.com/afkit_official"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 p-2.5 rounded-full transition-colors border border-slate-100"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#ec4899" }}
                href="https://www.instagram.com/afkit_official"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 p-2.5 rounded-full transition-colors border border-slate-100"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#22c55e" }}
                href="https://wa.me/2348164014304"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 p-2.5 rounded-full transition-colors border border-slate-100"
              >
                <FaWhatsapp className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-tight">What we sell</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/shop/listing?category=smartphones" className="hover:text-primary transition-colors">Smartphones</a></li>
              <li><a href="/shop/listing?category=laptops" className="hover:text-primary transition-colors">Laptops</a></li>
              <li><a href="/shop/listing?category=monitors" className="hover:text-primary transition-colors">Monitors</a></li>
              <li><a href="/shop/listing?category=accessories" className="hover:text-primary transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-tight">Why Afkit?</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>6-Month Warranty</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>Payment on Delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>Tested & Verified Gadgets</span>
              </li>
              <li>
                <a href="/shop/about" className="text-primary font-bold hover:underline inline-flex items-center mt-2">
                  Our Story <FaMapMarkerAlt className="ml-2 w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-tight">Support</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary shrink-0" />
                <a href="mailto:info@afkit.ng" className="hover:text-primary transition-colors">info@afkit.ng</a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary shrink-0" />
                <a href="tel:+2348164014304" className="hover:text-primary transition-colors">0816 401 4304</a>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>Shop A25, Platinum Plaza, Computer Village, Ikeja</span>
              </li>
              <li><a href="/shop/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/shop/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-slate-100" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] sm:text-xs text-slate-500">
          <p className="text-center md:text-left leading-relaxed opacity-60">
            &copy; {new Date().getFullYear()} AFKiT. All rights reserved.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="flex items-center gap-1.5 font-bold uppercase tracking-[0.2em] text-[10px] text-slate-400">
               Built by <span className="text-blue-900 font-black cursor-pointer hover:text-orange-500 transition-colors">Lamidev</span>
            </p>
            
            <div className="flex items-center gap-5">
              <span className="hidden md:block text-slate-200">|</span>
              <div className="flex gap-5">
                <a href="https://www.linkedin.com/in/akinyemi-oluwatosin-95519130b" className="text-slate-400 hover:text-blue-700 transition-all transform hover:scale-110"><FaLinkedin className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/thisslami" className="text-slate-400 hover:text-pink-600 transition-all transform hover:scale-110"><FaInstagram className="w-5 h-5" /></a>
                <a href="https://wa.me/2347056501913" className="text-slate-400 hover:text-green-600 transition-all transform hover:scale-110"><FaWhatsapp className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
