

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
import { formatAestheticId } from "@/utils/common";

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
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-50 relative group"
    >
      {/* Product Image - Larger and Fuller */}
      <div className="w-full sm:w-32 h-44 sm:h-32 bg-white flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 p-2 relative">
        <img
          src={productImage}
          alt={cartItem?.title}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/400x400/f8fafc/64748b?text=Product+Image";
          }}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
        />
        {/* Delete link for mobile accessibility */}
        <button 
          onClick={() => handleCartItemDelete(cartItem)}
          className="sm:hidden absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-full"
        >
          <Trash size={16} />
        </button>
      </div>

      {/* Product Details - Content Area */}
      <div className="flex-1 w-full min-w-0 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
            {cartItem?.title}
          </h3>
          <p className="hidden sm:block font-black text-slate-900 whitespace-nowrap">
            {formatNaira(((cartItem?.salePrice && cartItem?.salePrice > 0) ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
           {["laptops", "smartphones", "monitors"].includes(product?.category) && (
             <span className="text-[9px] font-black text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100 uppercase tracking-tighter">
               Major Gadget
             </span>
           )}
           <span className="text-xs font-bold text-orange-600 px-2 py-0.5 bg-orange-50 rounded-full">
            {formatNaira((cartItem?.salePrice && cartItem?.salePrice > 0) ? cartItem?.salePrice : cartItem?.price)}
           </span>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Per Item
           </span>
           <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-widest">
             {formatAestheticId(cartItem?.productId, "GAD")}
           </span>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4 mt-2 sm:mt-1">
          {/* Quantity Controls - Premium Style */}
          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100">
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-100 p-0"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-black text-slate-900 w-4 text-center text-sm">{cartItem?.quantity}</span>
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-100 p-0"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="sm:hidden font-black text-slate-900 border-l border-slate-200 pl-4">
             {formatNaira(((cartItem?.salePrice && cartItem?.salePrice > 0) ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity)}
          </div>

          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest ml-auto"
          >
            <Trash size={14} />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;
