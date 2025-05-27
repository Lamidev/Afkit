


// import { motion } from "framer-motion";
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";

// function ShoppingProductTile({ product, handleAddToCart, handleViewDetails }) {
//   // Format price with commas
//   const formattedPrice = new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     minimumFractionDigits: 0
//   }).format(product?.price).replace('NGN', '₦');

//   return (
//     <div 
//       className="w-full group cursor-pointer"
//       onClick={() => handleViewDetails(product._id)}
//     >
//       <div className="relative w-full overflow-hidden rounded-lg">
        
//         <motion.div
//           className="aspect-square bg-gray-100"
//           whileHover={{ scale: 1.05 }}
//           transition={{ duration: 0.3 }}
//         >
//           <img
//             src={product?.image}
//             alt={product?.title}
//             className="w-full h-full object-cover"
//           />
//         </motion.div>

        
//         {product?.condition && (
//           <motion.div
//             initial={{ y: -30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="absolute top-2 right-2"
//           >
//             <Badge
//               className={`text-[9px] px-1.5 py-0.5 h-5 ${
//                 product?.condition === "Brand New"
//                   ? "bg-green-500 hover:bg-green-600"
//                   : "bg-yellow-500 hover:bg-yellow-600"
//               }`}
//             >
//               {product?.condition}
//             </Badge>
//           </motion.div>
//         )}

//         {/* Stock Badges */}
//         <div className="absolute top-2 left-2">
//           {product?.totalStock === 0 ? (
//             <Badge className="text-[9px] px-1.5 py-0.5 h-5 bg-red-500 hover:bg-red-600">
//               Out Of Stock
//             </Badge>
//           ) : product?.totalStock < 10 ? (
//             <Badge className="text-[9px] px-1.5 py-0.5 h-5 bg-red-500 hover:bg-red-600">
//                {product?.totalStock} in stock
//             </Badge>
//           ) : null}
//         </div>

//         {/* Hover Add to Cart Button */}
//         {product?.totalStock > 0 && (
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleAddToCart(product?._id, product?.totalStock);
//               }}
//               className="text-xs sm:text-sm hover:bg-peach-600"
//             >
//               Add to cart
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Product Title & Price Below Image */}
//       <div className="mt-3 space-y-1">
//         <h2 className="text-sm font-semibold truncate">{product?.title}</h2>
//         <p className="text-sm font-bold text-peach-600">
//           {formattedPrice}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ShoppingProductTile;
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
      className="w-full group cursor-pointer border border-gray-400 rounded-lg p-2 hover:shadow-md transition-shadow duration-200" // Added border, rounded-lg, p-2, and hover shadow
      onClick={() => handleViewDetails(product._id)}
    >
      <div className="relative w-full overflow-hidden rounded-lg">
        <motion.div
          className="aspect-square bg-gray-100"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={mainImage}
            alt={product?.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {product?.condition && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-2 right-2"
          >
            <Badge
              className={`text-[9px] px-1.5 py-0.5 h-5 ${
                product?.condition === "Brand New"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {product?.condition}
            </Badge>
          </motion.div>
        )}

        {/* Stock Badges */}
        <div className="absolute top-2 left-2">
          {product?.totalStock === 0 ? (
            <Badge className="text-[9px] px-1.5 py-0.5 h-5 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="text-[9px] px-1.5 py-0.5 h-5 bg-red-500 hover:bg-red-600">
              {product?.totalStock} in stock
            </Badge>
          ) : null}
        </div>

        {/* Hover Add to Cart Button */}
        {product?.totalStock > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product?._id, product?.totalStock);
              }}
              className="text-xs sm:text-sm hover:bg-peach-600"
            >
              Add to cart
            </Button>
          </div>
        )}
      </div>

      {/* Product Title & Price Below Image */}
      <div className="mt-3 space-y-1">
        <h2 className="text-sm font-semibold truncate">{product?.title}</h2>
        <p className="text-sm font-bold text-peach-600">
          {formattedPrice}
        </p>
      </div>
    </div>
  );
}

export default ShoppingProductTile;