import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"; // Added CheckCircle and AlertCircle
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../store/auth-slice/index";
import CommonForm from "@/components/common/form";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { isLoading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        icon: <AlertCircle className="text-red-500" />, // Error icon for password mismatch
      });
      return;
    }

    try {
      await dispatch(
        resetPassword({ token, formData: { password: formData.password } })
      ).unwrap();

      toast.success("Password reset successfully, redirecting to login...", {
        icon: <CheckCircle className="text-green-500" />, // Success icon
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      toast.error(error || "Error resetting password", {
        icon: <AlertCircle className="text-red-500" />, // Error icon for API failure
      });
    }
  };

  const formControls = [
    {
      name: "password",
      label: "New Password",
      type: showPassword ? "text" : "password",
      placeholder: "Enter new password",
      componentType: "input",
      icon: showPassword ? EyeOff : Eye,
      toggleVisibility: () => setShowPassword((prev) => !prev),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Confirm new password",
      componentType: "input",
      icon: showConfirmPassword ? EyeOff : Eye,
      toggleVisibility: () => setShowConfirmPassword((prev) => !prev),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-400 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          Reset Password
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <CommonForm
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText={isLoading ? "Resetting..." : "Set New Password"}
          isBtnDisabled={isLoading}
        />
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;