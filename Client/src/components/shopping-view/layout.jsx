
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import SearchMenu from "@/components/shopping-view/search-menu";
import whatappimg from "../../assets/whatsppicon.webp";

// Import motion for the FAQ section animations
import { motion } from "framer-motion";
// Import Accordion components for the FAQ section
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ShoppingLayout = () => {
  const whatsappPhoneNumber = "2348164014304";
  const whatsappMessage = "Hi, I would love to place an order";
  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <ShoppingHeader />
        <div className="py-3 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
          <SearchMenu />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-[160px]"> {/* Adjust this value based on your header height */}
        <main className="flex-grow w-full">
          <Outlet />
        </main>
      </div>

      {/* Floating WhatsApp Button using the provided image */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-0 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50"
        style={{ width: '60px', height: '60px', overflow: 'hidden' }} // Example size, adjust as needed
      >
        <img
          src={whatappimg} // Adjust this path based on where you put the image file
          alt="WhatsApp Chat"
          className="w-full h-full object-cover" // Ensure the image covers the container
        />
      </a>

      {/* FAQ Section - Directly above the Footer */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-800 text-center mb-10 text-base max-w-2xl mx-auto">
            Find answers to the most common questions about our products, services,
            and policies.
          </p>

          <Accordion
            type="single"
            collapsible
            className="max-w-3xl mx-auto border-t border-b border-gray-200"
          >
            <AccordionItem
              value="warranty"
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Changed text-lg to text-base for the AccordionTrigger */}
              <AccordionTrigger className="text-base font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
                What does the 6-Month Warranty cover?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
                For UK-used laptops: it covers motherboard, RAM, and SSD-related
                issues. If we cannot fix it, we will replace the laptop for you even
                after 5 months of use. For other gadgets like UK-used phones,
                Monitors, our warranty covers just the motherboard of the device.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="delivery-time"
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Changed text-lg to text-base for the AccordionTrigger */}
              <AccordionTrigger className="text-base font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
                How long does delivery take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
                For deliveries within our office locations, it's 1-2 working days.
                For deliveries outside our office locations: South West – 2 to 3
                working days East and North – 3 to 5 working days We’ve added a
                little extra time to carefully retest the product for top-notch
                quality and possibly reduce the chances of any delivery delays caused
                by logistics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="payment-on-delivery"
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Changed text-lg to text-base for the AccordionTrigger */}
              <AccordionTrigger className="text-base font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
                How does your PAYMENT ON DELIVERY work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
                For the Payment on Delivery option, you pay only after you receive
                and check your item. No Risk, no Worries. Also, we charge 10K as a
                commitment fee. This is to ensure the seriousness of the potential
                buyer. This fee will be deducted from the gadget's price.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="product-quality"
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Changed text-lg to text-base for the AccordionTrigger */}
              <AccordionTrigger className="text-base font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
                How do you ensure product quality?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
                Our quality control team ensures that all our UK-used gadgets are
                thoroughly tested before sale. Every component is carefully inspected
                for cleanliness, functionality, and overall performance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech-support" className="last:border-b-0">
              {/* Changed text-lg to text-base for the AccordionTrigger */}
              <AccordionTrigger className="text-base font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
                Is Afkit Tech support available 24/7?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
                Our tech support team is available Monday to Saturday, from 9:00 AM
                to 6:00 PM.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingLayout;