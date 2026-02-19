import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Afkitlogo from "../../assets/afkit-logo.png";

function AuthLayout() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 w-full flex items-center justify-center px-4 lg:px-12 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        {/*
          On mobile: no card — just content with small side spacing (px-4 on parent handles it)
          On desktop (lg): card with shadow, rounded corners, split layout
        */}
        <div className="
          flex flex-col
          lg:flex-row lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden lg:border lg:border-gray-100/80 lg:min-h-[540px]
        ">
          
          {/* Left Panel — Desktop only (hidden on mobile) */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center w-[45%] flex-shrink-0 relative overflow-hidden bg-white border-r border-gray-100"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Subtle decorative blobs */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-orange-50 rounded-full -mr-28 -mt-28 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-slate-50 rounded-full -ml-28 -mb-28 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #f97316 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center px-10 space-y-8">
              {/* Logo */}
              <motion.img
                src={Afkitlogo}
                alt="Afkit Logo"
                className="w-44 h-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />

              {/* Divider */}
              <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />

              {/* Welcome text */}
              <motion.p
                className="text-gray-800 text-xl font-semibold leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                Welcome to{" "}
                <span className="text-orange-500 font-extrabold">Afkit</span>
                {" "}— we sell{" "}
                <span className="italic text-orange-400">integrity</span> and
                value for your money
              </motion.p>

              {/* Trust badges */}
              <motion.div
                className="flex flex-col gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {["6 Months Warranty", "Free Nationwide Delivery", "Payment On Delivery"].map(
                  (badge) => (
                    <div
                      key={badge}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <span className="w-4 h-4 rounded-full bg-orange-100 border border-orange-200 text-orange-500 text-xs flex items-center justify-center font-bold flex-shrink-0">
                        ✓
                      </span>
                      {badge}
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Panel for Forms */}
          <motion.div
            className="flex-1 flex flex-col justify-center p-4 sm:p-8 lg:p-12"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Mobile Logo — only visible on small screens */}
            <div className="lg:hidden w-full flex justify-center mb-8">
              <img
                src={Afkitlogo}
                alt="Afkit Logo"
                className="w-36 h-auto object-contain"
              />
            </div>

            <div className="w-full max-w-md mx-auto">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AuthLayout;
