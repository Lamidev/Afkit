


import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Afkitlogo from "../../assets/afkit-logo.png";

function AuthLayout() {
  return (
    <motion.div
      className="min-h-screen bg-white flex items-center justify-center px-4 lg:px-12"
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
        className="w-full max-w-md bg-gray-50 p-8 rounded-2xl shadow-lg"
        initial={{ x: "50%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <Outlet />
      </motion.div>
    </motion.div>
  );
}

export default AuthLayout;
