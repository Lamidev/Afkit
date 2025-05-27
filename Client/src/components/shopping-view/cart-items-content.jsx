
// import { Minus, Plus, Trash, CheckCircle, AlertCircle } from "lucide-react"; // Import CheckCircle and AlertCircle
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { getOrCreateSessionId } from "@/components/utils/session";

// // Helper function to format numbers with commas
// const formatNaira = (amount) => {
//   return new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     minimumFractionDigits: 2
//   }).format(amount).replace('NGN', '₦');
// };

// function UserCartItemsContent({ cartItem }) {
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productList } = useSelector((state) => state.shopProducts);
//   const dispatch = useDispatch();

//   async function handleUpdateQuantity(getCartItem, typeOfAction) {
//     try {
//       const userId = user?.id || null;
//       const sessionId = getOrCreateSessionId();

//       const newQuantity = typeOfAction === "plus"
//         ? getCartItem?.quantity + 1
//         : getCartItem?.quantity - 1;

//       if (!userId && !sessionId) {
//         toast.error("Session information missing.", {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       const product = productList.find(
//         (product) => product._id === getCartItem?.productId
//       );

//       if (newQuantity <= 0) return;

//       if (typeOfAction === "plus" && product && newQuantity > product.totalStock) {
//         toast.error(`Only ${product.totalStock} quantity available.`, {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       const result = await dispatch(
//         updateCartQuantity({
//           userId,
//           productId: getCartItem?.productId,
//           quantity: newQuantity,
//           sessionId
//         })
//       ).unwrap();

//       if (result.success) {
//         toast.success("Cart updated successfully", {
//           icon: <CheckCircle className="text-green-500" />,
//         });
//         await dispatch(fetchCartItems({ userId, sessionId }));
//       }
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//       toast.error("Failed to update cart quantity.", {
//         icon: <AlertCircle className="text-red-500" />,
//       });
//     }
//   }

//   async function handleCartItemDelete(getCartItem) {
//     try {
//       const userId = user?.id || null;
//       const sessionId = getOrCreateSessionId();

//       if (!userId && !sessionId) {
//         toast.error("Session information missing.", {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       const result = await dispatch(
//         deleteCartItem({
//           userId,
//           productId: getCartItem?.productId,
//           sessionId
//         })
//       ).unwrap();

//       if (result.success) {
//         toast.success("Item removed from cart", {
//           icon: <CheckCircle className="text-green-500" />,
//         });
//         await dispatch(fetchCartItems({ userId, sessionId }));
//       }
//     } catch (error) {
//       console.error("Failed to delete item:", error);
//       toast.error("Failed to remove item from cart.", {
//         icon: <AlertCircle className="text-red-500" />,
//       });
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
//     >
//       {/* Product Image */}
//       <img
//         src={cartItem?.image}
//         alt={cartItem?.title}
//         className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded"
//       />

//       {/* Product Details */}
//       <div className="flex-1">
//         <h3 className="font-extrabold text-base sm:text-lg">{cartItem?.title}</h3>
//         <p className="text-sm text-gray-600">
//           {formatNaira(cartItem?.price)} x {cartItem?.quantity}
//         </p>

//         {/* Quantity Controls */}
//         <div className="flex items-center gap-2 mt-2">
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             disabled={cartItem?.quantity === 1}
//             onClick={() => handleUpdateQuantity(cartItem, "minus")}
//           >
//             <Minus className="w-4 h-4" />
//             <span className="sr-only">Decrease quantity</span>
//           </Button>
//           <span className="font-semibold">{cartItem?.quantity}</span>
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             onClick={() => handleUpdateQuantity(cartItem, "plus")}
//           >
//             <Plus className="w-4 h-4" />
//             <span className="sr-only">Increase quantity</span>
//           </Button>
//         </div>
//       </div>

//       {/* Price & Delete */}
//       <div className="flex sm:flex-col items-end justify-between sm:justify-end gap-2 sm:gap-1">
//         <p className="font-semibold text-right">
//           {formatNaira(cartItem?.price * cartItem?.quantity)}
//         </p>
//         <Trash
//           onClick={() => handleCartItemDelete(cartItem)}
//           className="cursor-pointer text-red-500 hover:text-red-700"
//           size={20}
//         />
//       </div>
//     </motion.div>
//   );
// }
// export default UserCartItemsContent;

import { Minus, Plus, Trash, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  updateCartQuantity,
  fetchCartItems,
} from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getOrCreateSessionId } from "@/components/utils/session";

// Helper function to format numbers with commas
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("NGN", "₦");
};

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  const product = productList.find(
    (product) => product._id === cartItem?.productId
  );

  const productImage =
    product?.images?.[0] || product?.image || cartItem?.image;

  async function handleUpdateQuantity(getCartItem, typeOfAction) {
    try {
      const userId = user?.id || null;
      const sessionId = getOrCreateSessionId();

      const newQuantity =
        typeOfAction === "plus"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1;

      if (!userId && !sessionId) {
        toast.error("Session information missing.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      if (newQuantity <= 0) return;

      if (
        typeOfAction === "plus" &&
        product &&
        newQuantity > product.totalStock
      ) {
        toast.error(`Only ${product.totalStock} quantity available.`, {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const result = await dispatch(
        updateCartQuantity({
          userId,
          productId: getCartItem?.productId,
          quantity: newQuantity,
          sessionId,
        })
      ).unwrap();

      if (result.success) {
        toast.success("Cart updated successfully", {
          icon: <CheckCircle className="text-green-500" />,
        });
        await dispatch(fetchCartItems({ userId, sessionId }));
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update cart quantity.", {
        icon: <AlertCircle className="text-red-500" />,
      });
    }
  }

  async function handleCartItemDelete(getCartItem) {
    try {
      const userId = user?.id || null;
      const sessionId = getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast.error("Session information missing.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const result = await dispatch(
        deleteCartItem({
          userId,
          productId: getCartItem?.productId,
          sessionId,
        })
      ).unwrap();

      if (result.success) {
        toast.success("Item removed from cart", {
          icon: <CheckCircle className="text-green-500" />,
        });
        await dispatch(fetchCartItems({ userId, sessionId }));
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to remove item from cart.", {
        icon: <AlertCircle className="text-red-500" />,
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
    >
      {/* Product Image */}
      <img
        src={productImage}
        alt={cartItem?.title}
        className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-extrabold text-base sm:text-lg">
          {cartItem?.title}
        </h3>
        <p className="text-sm text-gray-600">
          {formatNaira(cartItem?.price)} x {cartItem?.quantity}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Price & Delete */}
      <div className="flex sm:flex-col items-end justify-between sm:justify-end gap-2 sm:gap-1">
        <p className="font-semibold text-right">
          {formatNaira(cartItem?.price * cartItem?.quantity)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer text-red-500 hover:text-red-700"
          size={20}
        />
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;
