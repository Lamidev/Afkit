import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, checkAuth } from "../../store/auth-slice";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

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
        icon: <CheckCircle className="text-green-500" />,
      });

      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await dispatch(checkAuth());

      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message || "Verification failed", {
        icon: <AlertCircle className="text-red-500" />,
      });
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "") && !isLoading) {
      handleSubmit(new Event("submit"));
    }
  }, [code, isLoading]);

  return (
    <div className="flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-auto p-6 sm:p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-black mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-white text-black border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 font-semibold mt-2 text-center">
              {error}
            </p>
          )}

<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  type="submit"
  disabled={isLoading || code.some((digit) => !digit)}
  className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
>
  {isLoading ? (
    <Loader className="w-6 h-6 animate-spin mx-auto" />
  ) : (
    "Verify Email"
  )}
</motion.button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-sm">
          <button
            type="button"
            onClick={() => toast.info("Resend code functionality coming soon!")}
            className="text-blue-700 font-semibold relative inline-block
            after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
            after:bg-blue-700 after:scale-x-0 after:origin-bottom-right
            hover:after:origin-bottom-left hover:after:scale-x-100
            after:transition-transform after:duration-300"
          >
            Resend Code
          </button>

          <p className="text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-blue-700 font-semibold relative inline-block
              after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
              after:bg-blue-700 after:scale-x-0 after:origin-bottom-right
              hover:after:origin-bottom-left hover:after:scale-x-100
              after:transition-transform after:duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
