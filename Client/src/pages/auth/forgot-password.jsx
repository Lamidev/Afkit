import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../store/auth-slice/index';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react'; // Added CheckCircle and AlertCircle
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CommonForm from '@/components/common/form';

const forgotPasswordControls = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
];

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: "" });
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required!", {
        icon: <AlertCircle className="text-red-500" />, // Error icon for validation
      });
      return;
    }
    try {
      const response = await dispatch(forgotPassword({ email: formData.email })).unwrap();
      toast.success(response.message, {
        icon: <CheckCircle className="text-green-500" />, // Success icon
      });
      setIsSubmitted(true);
    } catch (err) {
      toast.error(error || "Failed to send reset password email", {
        icon: <AlertCircle className="text-red-500" />, // Error icon for API failure
      });
    }
  };

  return (
    <motion.div
      className="max-w-md w-full bg-gray-400 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <CommonForm
            formControls={forgotPasswordControls}
            buttonText={isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Send Reset Link"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isBtnDisabled={isLoading}
          />
        ) : (
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gray-300">
              Check your email for a password reset link.
            </motion.div>
          </div>
        )}
      </div>
      <div className="px-8 py-4 bg-gray-400 bg-opacity-50 flex justify-center">
        <Link to={"/auth/login"} className="text-black hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

export default ForgotPasswordPage;