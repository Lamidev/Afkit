import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mic2,
  CheckCircle2,
  User,
  Phone,
  Mail,
  AtSign,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const DebatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    tikTokHandle: "",
    instagramHandle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, email } = formData;

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      toast.error("Please fill in your name, phone number, and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/shop/debate/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsRegistered(true);
        toast.success("You're signed up! Check your email.");
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Debate registration error:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "e.g. Chukwuemeka Obi",
      icon: User,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "e.g. 08012345678",
      icon: Phone,
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "e.g. you@example.com",
      icon: Mail,
      required: true,
    },
    {
      name: "tikTokHandle",
      label: "TikTok Handle",
      type: "text",
      placeholder: "e.g. @yourtiktok",
      icon: AtSign,
      required: false,
    },
    {
      name: "instagramHandle",
      label: "Instagram Handle",
      type: "text",
      placeholder: "e.g. @yourinstagram",
      icon: AtSign,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex flex-col pt-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full px-0 relative z-10 flex-grow pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Marketing & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <span className="text-orange-500 text-xs font-black uppercase tracking-widest">
                  Live Contest Registration
                </span>
              </motion.div>
              <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
                DEFEND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  YOUR FAVE
                </span>
                <br />
                CHALLENGE
              </h1>
              <p className="text-slate-400 text-lg sm:text-xl max-w-lg leading-relaxed font-medium">
                Join the biggest tech debate in Nigeria. Showcase your passion, 
                defend your brand, and win amazing prizes!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Powered by Afkit.ng</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Nigeria's No.1 Online Store for Premium UK-Used Gadgets. 
                    We sell integrity and value for your money.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl space-y-4">
                <p className="text-slate-300 font-bold italic">
                  "Your No.1 Online Store for UK-Used Gadgets with 6-Month Warranty, 
                  Payment on Delivery & Free Delivery"
                </p>
                <Button
                  onClick={() => navigate("/shop/listing")}
                  variant="link"
                  className="text-orange-500 p-0 h-auto font-black uppercase tracking-widest flex items-center gap-2 group hover:no-underline"
                >
                  See available UK used Gadgets
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Mic2 className="w-24 h-24 text-white" />
              </div>

              <AnimatePresence mode="wait">
                {isRegistered ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center gap-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-white">You're in! 🎉</h3>
                      <p className="text-slate-400 text-lg">
                        Check your email for the next steps and challenge details.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/shop/home")}
                      className="mt-4 bg-white text-slate-900 hover:bg-slate-200 font-black px-10 rounded-2xl"
                    >
                      Back to Home
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-white mb-2">Registration Form</h2>
                      <p className="text-slate-500 text-sm font-bold">Please fill in your valid details</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {fields.map((field) => {
                        const Icon = field.icon;
                        return (
                          <div
                            key={field.name}
                            className={field.name === "email" ? "sm:col-span-2" : ""}
                          >
                            <Label
                              htmlFor={field.name}
                              className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 block"
                            >
                              {field.label} {field.required && <span className="text-orange-500">*</span>}
                            </Label>
                            <div className="relative">
                              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                              <Input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 focus:border-orange-500/50 h-14 rounded-2xl transition-all"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-black rounded-2xl mt-4 transition-all active:scale-95 bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          Register Now <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="border-t border-white/5 py-10 bg-black/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Afkit.ng • Integrity & Value
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebatePage;
