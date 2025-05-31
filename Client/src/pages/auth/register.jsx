import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";
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
          icon: <CheckCircle className="text-green-500" />,
        });
        navigate("/auth/verify-email");
        setFormData(initialState);
      } else {
        toast.error(data?.payload?.message, {
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    });
  }

  return (
    <div className=" flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6 bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
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

        <div className="px-8 py-4 bg-white bg-opacity-50 flex justify-center">
          <p className="text-sm text-black">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-blue-700 font-semibold relative inline-block
                         after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
                         after:bg-blue-700 after:scale-x-0 after:origin-bottom-right
                         hover:after:origin-bottom-left hover:after:scale-x-100
                         after:transition-transform after:duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthRegister;
