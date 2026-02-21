import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, CreditCard } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { recordLinkShare } from "@/store/common-slice/share-slice/index";
import { getOrCreateSessionId } from "@/components/utils/session";

import { formatAestheticId, formatNaira } from "@/utils/common";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
        0
      )
      : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const message = `🛍️ *NEW ORDER FROM AFKiT*\n--------------------------------\n\n${cartItems
      .map(
        (item, index) =>
          `✨ *ITEM #${index + 1}*\n*Product:* ${item.title || "Product"}\n*GAD ID:* ${formatAestheticId(item.productId, "GAD")}\n*Qty:* ${item.quantity}\n*Price:* ${formatNaira(item.price)}\n\n🔍 *View Product:* \n${import.meta.env.VITE_API_BASE_URL}/og/product/${item.productId.toString().replace("#", "")}`
      )
      .join("\n\n--------------------------------\n\n")}\n\n💰 *Total Amount:* ${formatNaira(
        totalCartAmount
      )}\n\n✅ *Please confirm availability and send payment instructions. Thank you!*`;

    const whatsappNumber = "+2348164014304";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    setOpenCartSheet(false);

    // Record the share for each item in the cart
    const sessionId = user?.id ? null : getOrCreateSessionId();
    cartItems.forEach((item) => {
      dispatch(
        recordLinkShare({
          productId: item.productId,
          productTitle: item.title,
          shareDestination: "WhatsApp",
          sourcePage: "Checkout",
          sessionId,
        })
      );
    });
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Shopping Bag</SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 pr-4 overflow-y-auto">
        <div className="mt-4 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {cartItems.map((item, index) => (
                <motion.div key={item.productId} variants={itemVariants}>
                  <UserCartItemsContent cartItem={item} />
                  {index < cartItems.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-[calc(100vh-300px)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
                className="mb-6"
              >
                <ShoppingBag
                  size={80}
                  className="text-gray-300 dark:text-gray-600"
                  strokeWidth={1}
                />
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-center mb-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your bag is empty
              </motion.h3>

              <motion.p
                className="text-center text-gray-500 mb-6"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Add some products to make it happy!
              </motion.p>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => {
                    navigate("/shop/listing");
                    setOpenCartSheet(false);
                  }}
                  className="w-full max-w-xs"
                >
                  Keep Shopping
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {cartItems && cartItems.length > 0 && (
        <motion.div
          className="p-4 border-t bg-white dark:bg-black sticky bottom-0 z-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium text-slate-400 uppercase tracking-widest text-[10px]">Total Amount</span>
            <span className="font-bold text-slate-900 text-lg">{formatNaira(totalCartAmount)}</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* 1. PAY NOW - High Contrast Style */}
            <button
              onClick={() => {
                navigate("/shop/checkout", { state: { paymentType: "full" } });
                setOpenCartSheet(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-1.5 group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <CreditCard className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] group-hover:text-blue-900 transition-colors">
                Pay Now
              </span>
            </button>

            <div className="h-px bg-slate-100 mx-8" />

            <div className="flex flex-col gap-3 px-1">
              {/* 2. PAY ON DELIVERY */}
              {(() => {
                const hasMajorGadget = cartItems.some(item => 
                  item.category && ["smartphones", "laptops", "monitors"].includes(item.category)
                );
                
                if (totalCartAmount >= 15000 && hasMajorGadget) {
                  return (
                    <button
                      onClick={() => {
                        navigate("/shop/checkout", { state: { paymentType: "commitment" } });
                        setOpenCartSheet(false);
                      }}
                      className="flex items-center justify-center gap-2.5 group"
                    >
                      <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                        <Truck className="w-4 h-4 text-slate-600 group-hover:text-orange-600" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                          Pay on Delivery
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">
                          ₦10,000 Deposit Required
                        </span>
                      </div>
                    </button>
                  );
                }
                return null;
              })()}

              {/* 3. PAY ON WHATSAPP */}
              <button
                onClick={handleCheckout}
                className="flex items-center justify-center gap-2.5 group"
              >
                <div className="p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                </div>
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest group-hover:text-green-600 transition-colors">
                  Order via WhatsApp
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;