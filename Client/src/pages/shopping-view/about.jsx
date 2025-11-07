import { motion } from "framer-motion";
import { FaShieldAlt, FaTruck, FaHeadset, FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import HappyCustomersSection from "@/components/shopping-view/happy-customer";

const AboutPage = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "2348164014304";
    const message =
      "Hello AFKiT, I have a question about your products and services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const supportFeatures = [
    {
      icon: FaShieldAlt,
      title: "6-MONTH WARRANTY",
      description:
        "We repair or replace at no cost if your uk-used gadget develops a fault within 6 months, even after months of use.",
    },
    {
      icon: FaTruck,
      title: "FREE NATIONWIDE DELIVERY",
      description:
        "No matter where you are in Nigeria, we deliver to your city for FREE.",
    },
    {
      icon: FaCreditCard,
      title: "PAYMENT ON DELIVERY",
      description:
        "You pay only after you receive and check your item. No Risk, no Worries. You're in control.",
    },
    {
      icon: FaHeadset,
      title: "FREE ONLINE TECH SUPPORT",
      description:
        "We're always here to help with any questions or issues you have with your gadget.",
    },
  ];

  return (
    <div className="container mx-auto py-16 px-6 md:px-12 lg:px-20">
      {/* Header Section */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-6"
      >
        About Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
      >
        <span className="text-orange-500 font-bold">Afkit</span> is Nigeria’s
        trusted source for clean, UK-used laptops, phones, and accessories that
        feel brand new at affordable prices. Every UK-USED product we sell comes
        with 6-month warranty protection, free tech support, and Payment on
        delivery.
      </motion.p>

      {/* Why Choose Us? Section (Updated to be consistent with homepage) */}
      <section className="max-w-7xl mx-auto py-12 sm:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Why Choose Afkit?</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We're committed to providing the best shopping experience with
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full">
                  {" "}
                  <CardContent className="flex flex-col items-center p-4 min-h-[150px]">
                    {" "}
                    <Icon className="w-8 h-8 mb-3 text-blue-900" />
                    <h3 className="font-bold text-base mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-center text-gray-600">
                      {" "}
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Our Promise Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-10 md:p-16 text-white shadow-xl mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
          Our Promise
        </h2>
        <p className="text-lg text-center max-w-3xl mx-auto leading-relaxed">
          At <span className="text-orange-300 font-bold">Afkit</span>, we’re
          here to give you quality UK-used gadgets you can count on, fully
          tested by our team to keep you productive and worry-free.
        </p>
        <p className="text-lg text-center max-w-3xl mx-auto leading-relaxed mt-4">
          If your gadget develops a fault within 6 months, we’ll fix it for free
          or replace it. We believe reliable gadgets power your success and
          drive Nigeria’s growth through technology.
        </p>
        <p className="text-lg text-center max-w-3xl mx-auto leading-relaxed mt-4 font-semibold">
          This is why our tagline, "Delivering HAPPINESS," is not just words,
          it’s our mission. With{" "}
          <span className="text-orange-300 font-bold">Afkit</span>, you’re part
          of a family that’s got your back.
        </p>
      </motion.div>

      <HappyCustomersSection />

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-center bg-blue-900 rounded-2xl p-12 text-white shadow-xl"
      >
        <h2 className="text-3xl font-extrabold mb-4">
          Ready to Upgrade Your Tech?
        </h2>
        <p className="text-lg mb-6">
          Join thousands of happy customers enjoying the latest gadgets at
          unbeatable prices.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            asChild
            className="bg-white text-blue-900 font-bold hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            <Link to="/shop/listing">Shop Now 🛒</Link>
          </Button>

          <Button
            onClick={handleWhatsAppClick}
            variant="outline"
            className="border-white text-blue-900 font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <FaWhatsapp size={18} />
            Chat on WhatsApp
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
