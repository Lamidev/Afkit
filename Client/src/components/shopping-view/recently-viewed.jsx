
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShoppingProductTile from "./product-tile";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";
import { getOrCreateSessionId } from "@/components/utils/session";

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (savedIds.length > 0 && productList.length > 0) {
      // Filter productList to find matches from saved IDs, keeping the order of the stored IDs
      const matches = savedIds
        .map(id => productList.find(p => p._id === id))
        .filter(p => p !== undefined);
      setRecentProducts(matches);
    }
  }, [productList]);

  const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast.error("Session information missing.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const response = await dispatch(
        addToCart({
          userId,
          productId: getCurrentProductId,
          quantity: 1,
          sessionId,
        })
      ).unwrap();

      if (response.success) {
        dispatch(fetchCartItems({ userId, sessionId }));
        toast.success("Product added to cart!", {
          icon: <CheckCircle className="text-green-500" />,
        });
      }
    } catch (error) {
      toast.error("Failed to add to cart.");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-16 mb-8">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          Recently Viewed
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Gadgets you recently checked out
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recentProducts.slice(0, 5).map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ShoppingProductTile
              product={product}
              handleAddToCart={handleAddToCart}
              handleViewDetails={handleViewDetails}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
