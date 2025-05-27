import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Afkitlogo from "../../assets/afkit-logo.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-200 text-black py-10 mt-auto"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo + Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center md:items-start space-y-4"
        >
          <img
            src={Afkitlogo}
            alt="Afkit Logo"
            className="w-40 md:w-48 font-bold object-contain"
          />
          <div className="flex justify-center md:justify-start space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-black hover:text-blue-500">
                <FaFacebook className="w-6 h-6" />
              </Button>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-black hover:text-blue-500">
                <FaTwitter className="w-6 h-6" />
              </Button>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-black hover:text-pink-500">
                <FaInstagram className="w-6 h-6" />
              </Button>
            </a>
            <a href="https://wa.me/2349025765871" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-black hover:text-green-500">
                <FaWhatsapp className="w-6 h-6" />
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:border-l border-gray-400 md:pl-6"
        >
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-center md:justify-start">
              <FaEnvelope className="w-5 h-5 mr-2" />
              <a href="mailto:afkitng@gmail.com" className="hover:text-gray-700 transition">
                afkitng@gmail.com
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaPhone className="w-5 h-5 mr-2" />
              <a href="tel:+2348164014304" className="hover:text-gray-700 transition">
                0816 401 4304
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="w-5 h-5 mr-2" />
              <span>
                Shop A25, Platinum Plaza, No 7 Adepele Street, Computer Village, Ikeja
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Services Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:border-l border-gray-400 md:pl-6"
        >
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="return-policy">
              <AccordionTrigger className="font-bold hover:no-underline">
                Return Policy
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                We offer a 7-day return policy. Return in original condition for exchange.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery-info">
              <AccordionTrigger className="font-bold hover:no-underline">
                Delivery Information
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Delivery takes 2–3 business days with tracking info after shipping.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms">
              <AccordionTrigger className="font-bold hover:no-underline">
                Terms and Conditions
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                By using our site, you agree to our terms. All items are subject to availability.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>

      {/* Separator + Copyright */}
      <Separator className="my-8 bg-gray-500" />
      <p className="text-center text-sm text-gray-600 px-4">
        &copy; {new Date().getFullYear()} Afkit Gadgets. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
