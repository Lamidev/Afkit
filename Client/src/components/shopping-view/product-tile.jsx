
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { createSlug, formatAestheticId } from "@/utils/common";
import { useNavigate } from "react-router-dom"; // Added for navigation

function ShoppingProductTile({ product, handleAddToCart, handleViewDetails }) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Enhanced navigation with pure GAD ID for cleaner URLs
  // Use the raw database ID for navigation to ensure consistency across the system
  const onProductClick = () => {
    navigate(`/shop/product/${product?._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(product?.price).replace('NGN', '₦');

  // Get the first image as the main display image
  const mainImage = product?.images?.[0] || product?.image;

  return (
    <div
      className="w-full h-full group cursor-pointer rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden"
      onClick={onProductClick}
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden flex-shrink-0 bg-slate-50">
        <motion.div
          className="aspect-square flex items-center justify-center p-0"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={mainImage}
            alt={product?.title}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x400/f8fafc/64748b?text=Product+Image";
            }}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Top Badge Row — Both badges at top, opposite ends */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
          {/* Left: Stock badge */}
          <div className="flex-shrink-0">
            {product?.totalStock === 0 ? (
              <Badge variant="destructive" className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                Sold Out
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-500 text-white border-none shadow-sm">
                {product?.totalStock} left
              </Badge>
            ) : <div />}
          </div>

          {/* Right: Condition badge */}
          {product?.condition && (
            <div className="flex-shrink-0">
              <Badge
                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                  product?.condition === "Brand New"
                    ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-white border-amber-500 shadow-amber-200"
                    : "bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-500 shadow-slate-200"
                }`}
              >
                {product?.condition}
              </Badge>
            </div>
          )}
        </div>
      </div>
      {/* Product Info Container */}
      <div className="mt-2 flex flex-col flex-grow min-h-[80px] px-2.5 pb-1">
        <h2 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug break-words mb-1 sm:mb-2">
          {product?.title}
        </h2>
        <div className="mt-auto flex flex-col">
          {product?.salePrice > 0 ? (
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-bold whitespace-nowrap">
                {formattedPrice}
              </span>
              <span className="text-sm sm:text-base font-bold text-orange-600 whitespace-nowrap">
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0
                }).format(product?.salePrice).replace('NGN', '₦')}
              </span>
            </div>
          ) : (
            <p className="text-sm sm:text-base font-bold text-orange-600">
              {formattedPrice}
            </p>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-1 px-2.5 pb-2.5">
        {product?.totalStock > 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product?._id, product?.totalStock);
            }}
            className="w-full text-[10px] sm:text-xs h-9 sm:h-10 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all uppercase tracking-tight"
          >
            Add to cart
          </Button>
        ) : (
          <Button
            disabled
            className="w-full text-[10px] sm:text-xs h-9 sm:h-10 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed font-medium"
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}

export default ShoppingProductTile;