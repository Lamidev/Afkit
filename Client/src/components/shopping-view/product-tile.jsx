
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { createSlug, formatAestheticId } from "@/utils/common";

function ShoppingProductTile({ product, handleAddToCart, handleViewDetails }) {
  // Enhanced navigation with aesthetic slugs and GAD ID
  const onProductClick = () => {
    const slug = createSlug(product?.title);
    handleViewDetails(`${slug}-${product?._id}`);
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
      className="w-full h-full group cursor-pointer border border-slate-200 rounded-2xl p-0 sm:p-3 hover:shadow-xl transition-all duration-300 flex flex-col bg-white overflow-hidden"
      onClick={onProductClick}
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden flex-shrink-0 bg-white">
        <motion.div
          className="aspect-square flex items-center justify-center p-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={mainImage}
            alt={product?.title}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x400/f8fafc/64748b?text=Product+Image";
            }}
            className="w-full h-full object-contain mix-blend-multiply scale-[1.4]"
          />
        </motion.div>

        {product?.condition && (
          <div className="absolute top-2 right-2">
            <Badge
              className={`text-[9px] sm:text-[10px] uppercase font-black px-3 py-1 rounded-full border shadow-sm transition-transform group-hover:scale-110 ${
                product?.condition === "Brand New"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-white border-amber-500 shadow-amber-200"
                  : "bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-500 shadow-slate-200"
              }`}
            >
              {product?.condition}
            </Badge>
          </div>
        )}

        {/* Stock Badges - Moved to bottom to avoid overlap with condition badge */}
        <div className="absolute bottom-2 left-2">
          {product?.totalStock === 0 ? (
            <Badge variant="destructive" className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
              Sold Out
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-500 text-white border-none shadow-sm">
              Only {product?.totalStock} Left
            </Badge>
          ) : null}
        </div>
      </div>
      
      {/* Product Info Container */}
      <div className="mt-2 sm:mt-4 flex flex-col flex-grow min-h-[90px] px-2 sm:px-1">
        <h2 className="text-sm sm:text-lg font-black text-slate-900 leading-tight break-words mb-1 sm:mb-2">
          {product?.title}
        </h2>
        <div className="mt-auto">
          <p className="text-base sm:text-xl font-black text-orange-600">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-2 sm:mt-4 px-2 sm:px-1 pb-2 sm:pb-0">
        {product?.totalStock > 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product?._id, product?.totalStock);
            }}
            className="w-full text-[10px] sm:text-sm h-10 sm:h-12 rounded-xl sm:rounded-2xl font-black bg-primary text-white hover:bg-primary/90 transition-all uppercase tracking-tight"
          >
            Add to cart
          </Button>
        ) : (
          <Button
            disabled
            className="w-full text-[10px] sm:text-sm h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-400 cursor-not-allowed font-bold"
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}

export default ShoppingProductTile;