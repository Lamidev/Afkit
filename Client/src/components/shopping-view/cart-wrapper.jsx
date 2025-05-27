

// import { useNavigate } from "react-router-dom";
// import { Button } from "../ui/button";
// import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
// import UserCartItemsContent from "./cart-items-content";
// import { ScrollArea } from "../ui/scroll-area";
// import { Separator } from "../ui/separator";
// import { motion } from "framer-motion";
// import { ShoppingBag, AlertTriangle } from "lucide-react";
// import { toast } from "sonner";
// import { useSelector } from "react-redux";

// // Helper function to format Naira with commas
// const formatNaira = (amount) => {
//   return new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     minimumFractionDigits: 2
//   }).format(amount).replace('NGN', '₦');
// };

// function UserCartWrapper({ cartItems, setOpenCartSheet }) {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const totalCartAmount =
//     cartItems && cartItems.length > 0
//       ? cartItems.reduce(
//           (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
//           0
//         )
//       : 0;

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 },
//   };

//   const handleCheckout = () => {
//     if (!user) {
//       navigate("/auth/login");
//       setOpenCartSheet(false);
//       toast.warning("Please login to checkout.", {
//         icon: <AlertTriangle className="text-orange-500" />,
//       });
//       return;
//     }

//     if (cartItems.length === 0) return;

//     // Format the cart items into a WhatsApp message
//     const itemsList = cartItems.map(item =>
//       `- ${item.title || 'Product'} (${item.quantity} x ${formatNaira(item.price)})`
//     ).join("%0a");

//     const total = `Total: ${formatNaira(totalCartAmount)}`;

//     const message = `Hello! I'd like to place an order:%0a%0a${itemsList}%0a%0a${total}%0a%0aPlease let me know how to proceed with payment and delivery.`;

//     const whatsappNumber = "+2348164014304";
//     const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       `Hello! I'd like to place an order:\n\n${cartItems.map(item =>
//         `- ${item.title || 'Product'} (${item.quantity} x ${formatNaira(item.price)})`
//       ).join('\n')}\n\nTotal: ${formatNaira(totalCartAmount)}\n\nPlease let me know how to proceed with payment and delivery.`
//     )}`;

//     window.open(whatsappUrl, '_blank');
//     setOpenCartSheet(false);
//   };

//   return (
//     <SheetContent className="sm:max-w-md">
//       <SheetHeader>
//         <SheetTitle>Your Cart</SheetTitle>
//       </SheetHeader>
//       <ScrollArea className="h-[calc(100vh-200px)] pr-4">
//         <div className="mt-4 space-y-4">
//           {cartItems && cartItems.length > 0 ? (
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="show"
//             >
//               {cartItems.map((item, index) => (
//                 <motion.div key={item.productId} variants={itemVariants}>
//                   <UserCartItemsContent cartItem={item} />
//                   {index < cartItems.length - 1 && (
//                     <Separator className="my-4" />
//                   )}
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               className="flex flex-col items-center justify-center h-[calc(100vh-300px)]"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <motion.div
//                 animate={{
//                   y: [0, -10, 0],
//                   rotate: [0, 5, -5, 0],
//                 }}
//                 transition={{
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   duration: 2,
//                 }}
//                 className="mb-6"
//               >
//                 <ShoppingBag
//                   size={80}
//                   className="text-gray-300 dark:text-gray-600"
//                   strokeWidth={1}
//                 />
//               </motion.div>

//               <motion.h3
//                 className="text-xl font-bold text-center mb-2"
//                 initial={{ y: -20 }}
//                 animate={{ y: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 Your cart feels lonely
//               </motion.h3>

//               <motion.p
//                 className="text-center text-gray-500 mb-6"
//                 initial={{ y: -20 }}
//                 animate={{ y: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 Add some products to make it happy!
//               </motion.p>

//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <Button
//                   onClick={() => {
//                     navigate("/shop/listing");
//                     setOpenCartSheet(false);
//                   }}
//                   className="w-full max-w-xs"
//                 >
//                   Explore Products
//                 </Button>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </ScrollArea>
//       {cartItems && cartItems.length > 0 && (
//         <motion.div
//           className="mt-6 space-y-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <div className="flex justify-between">
//             <span className="font-bold">Total</span>
//             <span className="font-bold">{formatNaira(totalCartAmount)}</span>
//           </div>
//           <Button
//             onClick={handleCheckout}
//             className="w-full mt-4"
//           >
//             Checkout via WhatsApp
//           </Button>
//         </motion.div>
//       )}
//     </SheetContent>
//   );
// }

// export default UserCartWrapper;


import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { ShoppingBag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Helper function to format Naira with commas
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount).replace('NGN', '₦');
};

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
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
    if (!user) {
      navigate("/auth/login");
      setOpenCartSheet(false);
      toast.warning("Please login to checkout.", {
        icon: <AlertTriangle className="text-orange-500" />,
      });
      return;
    }

    if (cartItems.length === 0) return;

    const message = `Hello! I'd like to place an order:\n\n${cartItems.map(item =>
      `- ${item.title || 'Product'} (${item.quantity} x ${formatNaira(item.price)})`
    ).join('\n')}\n\nTotal: ${formatNaira(totalCartAmount)}\n\nPlease let me know how to proceed with payment and delivery.`;

    const whatsappNumber = "+2348164014304";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setOpenCartSheet(false);
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
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
                Your cart feels lonely
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
                  Explore Products
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {cartItems && cartItems.length > 0 && (
        <motion.div
          className="p-4 border-t bg-white dark:bg-black sticky bottom-0 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between mb-3 text-base">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatNaira(totalCartAmount)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full">
            Checkout via WhatsApp
          </Button>
        </motion.div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
