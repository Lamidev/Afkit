import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Afkitlogo from "../../assets/afkit-logo.png";

function AuthLayout() {
  return (
    <motion.div
      className="min-h-screen bg-white w-full flex items-center justify-center lg:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Panel with Logo and Welcome Text */}
      <div className="hidden lg:flex flex-col items-start justify-center w-1/2 space-y-6 pr-12">
        {/* Animated Logo */}
        <motion.img
          src={Afkitlogo}
          alt="Afkit Logo"
          className="w-56 h-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Animated Text */}
        <motion.p
          className="text-gray-800 text-2xl font-semibold leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          Welcome to <span className="text-orange-500 font-bold">Afkit</span>
          {""}
          <span> we sell integrity and value for your money</span>
        </motion.p>
      </div>

      {/* Right Panel for Forms (Login, Register, etc.) */}
      <motion.div
        className="w-full max-w-md bg-white flex-1 lg:flex-none p-6 sm:p-8 h-full lg:h-auto flex flex-col items-center justify-center lg:block"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mobile Logo - Visible only on small screens */}
        <div className="lg:hidden w-full flex justify-center mb-8">
          <img
            src={Afkitlogo}
            alt="Afkit Logo"
            className="w-40 h-auto object-contain"
          />
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AuthLayout;
