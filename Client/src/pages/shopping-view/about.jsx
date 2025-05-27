import { motion } from "framer-motion";
import { FaShieldAlt, FaTruck,  FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaNairaSign,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const socialIcons = {
  instagram: <FaInstagram size={20} />,
  linkedin: <FaLinkedin size={20} />,
  twitter: <FaTwitter size={20} />,
};

const AboutPage = () => {
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
        className="text-lg text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
      >
        Welcome to{" "}
        <span className="text-orange-500 font-bold">Afkit</span>
        , your one-stop destination for cutting-edge gadgets at unbeatable
        prices. Our passion is to bring the latest technology right to your
        fingertips.
      </motion.p>

      {/* Features Section */}
      <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 1 }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16"
>
  {[
    {
      Icon: FaShieldAlt,
      title: "Quality Products",
      desc: "We source only the best quality gadgets from trusted manufacturers.",
    },
    {
      Icon: FaNairaSign,
      title: "Affordable Prices",
      desc: "Top-notch gadgets without breaking the bank.",
    },
    {
      Icon: FaTruck,
      title: "Fast Delivery",
      desc: "Quick and secure delivery to your doorstep.",
    },
    {
      Icon: FaCheckCircle,
      title: "6 Months Warranty",
      desc: "Enjoy peace of mind with a 6-month warranty on select products.",
    },
  ].map((item, index) => (
    <div
      key={index}
      className="bg-card rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition duration-300"
    >
      <item.Icon size={48} className="text-peach-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-primary mb-3">
        {item.title}
      </h3>
      <p className="text-muted-foreground">{item.desc}</p>
    </div>
  ))}
</motion.div>


      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-center to-secondary rounded-2xl p-12 text-black shadow-xl"
      >
        <h2 className="text-3xl font-extrabold mb-4">
          Ready to Upgrade Your Tech?
        </h2>
        <p className="text-lg mb-6">
          Join thousands of happy customers enjoying the latest gadgets at
          unbeatable prices.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            className="bg-white text-primary font-bold hover:bg-blue-800 transition-all duration-300 shadow-lg"
          >
            <Link to="/shop/listing">Shop Now 🛒</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white text-primary hover:bg-blue-800 hover:text-primary transition-all duration-300"
          >
            <a href="mailto:gadgetsgridphones@gmail.com">Contact Us 📩</a>
          </Button>
        </div>
      </motion.div>

      {/* Accordion for Policies */}
      <Accordion type="single" collapsible className="mt-12">
        <AccordionItem value="return-policy">
          <AccordionTrigger className="text-primary font-bold">
            Return Policy
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              We offer a 7-day return policy for all products. If you're not satisfied with your purchase, you can return it in its original condition for a full refund or exchange.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery-info">
          <AccordionTrigger className="text-primary font-bold flex items-center gap-2">
           Delivery Information
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              Our delivery time is <strong>2-3 business days</strong>. We ensure quick and secure shipping so you receive your gadgets in top condition. Tracking details will be provided once your order is shipped.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="terms">
          <AccordionTrigger className="text-primary font-bold">
            Terms and Conditions
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              By using our website, you agree to our terms and conditions. All products are subject to availability.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutPage;
