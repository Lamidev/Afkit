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
} from "lucide-react";
import { toast } from "sonner";

const DebateCampaignSection = () => {
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
    <section className="w-full py-14 sm:py-20 bg-[#0d1b2a] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{
                background:
                  "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 40px rgba(249, 115, 22, 0.35)",
              }}
            >
              <Mic2 className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block text-orange-400 text-xs font-black uppercase tracking-[4px] mb-3">
                🎙️ Campaign Registration
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Afkit Debate Campaign
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                Join the conversation! Register below to participate in the Afkit
                Debate Campaign and make your voice heard.
              </p>
            </motion.div>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {isRegistered ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="flex flex-col items-center justify-center py-8 text-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(34, 197, 94, 0.15)",
                      border: "2px solid rgba(34, 197, 94, 0.4)",
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    You're Registered! 🎉
                  </h3>
                  <p className="text-slate-400 text-base max-w-sm">
                    You're in! We've sent you a
                    confirmation email with all the details.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {fields.map((field) => {
                      const Icon = field.icon;
                      return (
                        <div
                          key={field.name}
                          className={
                            field.name === "email"
                              ? "sm:col-span-2"
                              : ""
                          }
                        >
                          <Label
                            htmlFor={field.name}
                            className="text-slate-300 text-sm font-semibold mb-2 flex items-center gap-1.5"
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-orange-400">*</span>
                            )}
                            {!field.required && (
                              <span className="text-slate-500 text-xs font-normal">
                                (optional)
                              </span>
                            )}
                          </Label>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <Input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:ring-0 h-12 rounded-xl"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-13 text-base font-bold rounded-xl mt-2 transition-all active:scale-95"
                    style={{
                      background: isSubmitting
                        ? "rgba(249,115,22,0.5)"
                        : "linear-gradient(135deg, #f97316, #ea580c)",
                      color: "white",
                      border: "none",
                      padding: "14px",
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Mic2 className="w-5 h-5" />
                        Join the Contest
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-slate-500 text-xs mt-2">
                    By registering, you agree to be contacted by Afkit regarding
                    this campaign.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DebateCampaignSection;
