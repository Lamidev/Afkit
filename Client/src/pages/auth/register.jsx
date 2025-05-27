import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react"; // Import icons
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "@/components/common/password-strength-meter";
import CommonForm from "@/components/common/form";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message, {
          icon: <CheckCircle className="text-green-500" />, // Success icon
        });
        navigate("/auth/verify-email");
        setFormData(initialState);
      } else {
        toast.error(data?.payload?.message, {
          icon: <AlertCircle className="text-red-500" />, // Error icon
        });
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-md space-y-6 bg-gray-400 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          Create Account
        </h2>

        <CommonForm
          formControls={registerFormControls}
          buttonText="Sign Up"
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        <PasswordStrengthMeter password={formData.password} />
      </div>
      <div className="px-8 py-4 bg-gray-400 bg-opacity-50 flex justify-center">
        <p className="text-sm text-black">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default AuthRegister;