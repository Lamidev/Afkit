

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { loginFormControls } from "@/config";

function AuthLogin() {
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    dispatch(loginUser(formData))
      .then((data) => {
        setIsLoading(false);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message || "Login successful!", {
            icon: <CheckCircle className="text-green-500" />,
          });
          setFormData(initialState);
        } else {
          toast.error(data?.payload?.message || "Login failed. Please try again.", {
            icon: <AlertCircle className="text-red-500" />,
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("An unexpected error occurred. Please try again.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        setError("An error occurred. Please try again.");
      });
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-auto p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
        Welcome Back
      </h2>

      <CommonForm
        formControls={loginFormControls}
        buttonText={isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3 sm:gap-0 text-sm">
        <Link
          to="/auth/forgot-password"
          className="text-blue-700 font-semibold relative inline-block
                     after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] 
                     after:bg-blue-700 after:scale-x-0 after:origin-bottom-right
                     hover:after:origin-bottom-left hover:after:scale-x-100
                     after:transition-transform after:duration-300"
        >
          Forgot password?
        </Link>

        <p className="text-gray-700">
          Don’t have an account?{" "}
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
  );
}

export default AuthLogin;
