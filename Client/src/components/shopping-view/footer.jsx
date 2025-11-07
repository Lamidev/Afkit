import { motion } from "framer-motion";
import {
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import Afkitlogo from "../../assets/afkit-logo.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 text-black py-10 mt-auto"
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
            className="w-33 md:w-36 font-bold object-contain"
          />

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-start space-x-4 pt-2">
            <motion.a
              whileHover={{ y: -2 }}
              href="https://x.com/afkit_official?t=EeaWvQxeihXFWrb4WLhrNg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-500"
            >
              <FaTwitter className="w-7 h-7" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="https://www.instagram.com/afkit_official?igsh=MXZ2MGZyOGowaDlmYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-pink-500"
            >
              <FaInstagram className="w-7 h-7" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="https://wa.me/2348164014304"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-green-500"
            >
              <FaWhatsapp className="w-7 h-7" />
            </motion.a>
          </div>
        </motion.div>

        {/* New About Us Section (replaces Services) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:border-l border-gray-400 md:pl-6" // Added border and padding for separation
        >
          <h2 className="text-xl font-semibold mb-4">About Us</h2>
          {/* Changed text-sm to text-base */}
          <div className="text-base font-bold text-gray-900">
            <p className="mb-2 leading-relaxed">
              <span className="text-orange-500 font-bold">Afkit</span> is your
              trusted tech partner in Nigeria offering premium Uk-used devices
              with{" "}
              <span className="font-semibold text-orange-500">
                6-month warranty
              </span>{" "}
              and{" "}
              <span className="font-semibold text-orange-500">
                payment on delivery
              </span>{" "}
              option
            </p>
            <p>
              <a
                href="/shop/about"
                className="text-blue-600 hover:underline font-medium inline-flex items-center"
              >
                Discover our story
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </p>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }} // Adjusted delay
          className="md:border-l border-gray-400 md:pl-6"
        >
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          {/* Changed text-sm to text-base for the list items as well */}
          <ul className="space-y-3 text-base">
            <li className="flex items-center justify-center md:justify-start">
              <FaEnvelope className="w-5 h-5 mr-2 text-blue-900" />
              <a
                href="mailto:afkitng@gmail.com"
                className="hover:text-gray-600 transition font-bold"
              >
                afkitng@gmail.com
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaPhone className="w-5 h-5 mr-2 text-blue-900" />
              <a
                href="tel:+2348164014304"
                className="hover:text-gray-600 transition font-bold"
              >
                0816 401 4304
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="w-5 h-5 mr-2 text-blue-900" />
              <span className="font-bold">
                Shop A25, Platinum Plaza, No 7 Adepele Street, Computer Village,
                Ikeja
              </span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Separator + Copyright */}
      <Separator className="my-8 bg-gray-500" />
      <p className="text-center text-sm text-gray-600 px-4">
        &copy; {new Date().getFullYear()} AFKiT. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
