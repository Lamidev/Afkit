import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, checkAuth } from "../../store/auth-slice";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react"; // Import icons

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await dispatch(verifyEmail({ code: verificationCode })).unwrap();
      toast.success("Email verified successfully, login to continue", {
        icon: <CheckCircle className="text-green-500" />, // Success icon
      });

      // Clear the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await dispatch(checkAuth());

      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message || "Verification failed", {
        icon: <AlertCircle className="text-red-500" />, // Error icon
      });
    }
  };

  useEffect(() => {
    // Only attempt to submit if all digits are filled and not already loading
    if (code.every((digit) => digit !== "") && !isLoading) {
      handleSubmit(new Event("submit"));
    }
  }, [code, isLoading]); // Depend on code and isLoading

  return (
    <div className="max-w-md w-full bg-black bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-black mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1" // Changed to 1 to allow individual digit input
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-white text-black border-2 border-black rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-[#FF9A8B] to-[#FF6A88] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#FF8264] hover:to-[#FF4E57] focus:outline-none focus:ring-2 focus:ring-[#FF6A88] focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button> */}
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  type="submit"
  disabled={isLoading || code.some((digit) => !digit)}
  className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50"
>
  {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Verify Email"}
</motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;