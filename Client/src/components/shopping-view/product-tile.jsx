
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function ShoppingProductTile({ product, handleAddToCart, handleViewDetails }) {
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
      className="w-full h-full group cursor-pointer border border-slate-200 rounded-2xl p-2 sm:p-3 hover:shadow-xl transition-all duration-300 flex flex-col bg-white"
      onClick={() => handleViewDetails(product._id)}
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden rounded-xl flex-shrink-0 bg-slate-50">
        <motion.div
          className="aspect-square flex items-center justify-center p-2"
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
            className="w-full h-full object-contain mix-blend-multiply"
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

        {/* Stock Badges */}
        <div className="absolute top-2 left-2">
          {product?.totalStock === 0 ? (
            <Badge variant="destructive" className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
              Sold Out
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border-none hover:bg-red-100">
              Only {product?.totalStock} Left
            </Badge>
          ) : null}
        </div>
      </div>
      
      {/* Product Info Container */}
      <div className="mt-4 flex flex-col flex-grow min-h-[90px] px-1">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight break-words mb-2">
          {product?.title}
        </h2>
        <div className="mt-auto">
          <p className="text-base sm:text-lg font-black text-primary">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4 px-1">
        {product?.totalStock > 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product?._id, product?.totalStock);
            }}
            className="w-full text-xs sm:text-sm h-10 sm:h-11 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all"
          >
            Add to cart
          </Button>
        ) : (
          <Button
            disabled
            className="w-full text-xs sm:text-sm h-10 sm:h-11 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}

export default ShoppingProductTile;