

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { getSearchResults, resetSearchResults, setSearchKeyword } from "@/store/shop/search-slice";
// import { motion } from "framer-motion";
// import { CheckCircle, AlertCircle, Search } from "lucide-react";
// import { toast } from "sonner";
// import { getOrCreateSessionId } from "@/components/utils/session";
// import { Button } from "@/components/ui/button";

// function SearchProducts() {
//   const [searchParams] = useSearchParams();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get state from Redux
//   const { 
//     isLoading, 
//     searchResults, 
//     currentKeyword 
//   } = useSelector((state) => state.shopSearch);
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);

//   // Effect to handle search when URL changes
//   useEffect(() => {
//     const searchQuery = searchParams.get("keyword") || "";
    
//     // Update the keyword in Redux state
//     dispatch(setSearchKeyword(searchQuery));

//     if (searchQuery) {
//       dispatch(getSearchResults(searchQuery));
//     } else {
//       dispatch(resetSearchResults());
//     }
//   }, [location.search, dispatch]);

//   // Effect to fetch cart items
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const userId = user?.id;
//         const sessionId = userId ? null : getOrCreateSessionId();

//         if (!userId && !sessionId) {
//           console.warn("No user or session info available for cart fetch.");
//           return;
//         }

//         await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//       } catch (error) {
//         console.error('Failed to fetch cart:', error);
//         if (!user) {
//           localStorage.removeItem('guestSessionId');
//         }
//       }
//     };

//     fetchCart();
//   }, [dispatch, user]);

//   const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
//     try {
//       const userId = user?.id;
//       const sessionId = userId ? null : getOrCreateSessionId();

//       if (!userId && !sessionId) {
//         toast.error("Session information missing. Please log in or refresh.", {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         throw new Error("Neither userId nor sessionId is available");
//       }

//       const currentCartItems = cartItems?.items || [];
//       const existingItem = currentCartItems.find(
//         item => item.productId === getCurrentProductId
//       );

//       if (existingItem && existingItem.quantity >= getTotalStock) {
//         toast.error(`Maximum available quantity (${getTotalStock}) reached.`, {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//         return;
//       }

//       const response = await dispatch(
//         addToCart({
//           userId,
//           productId: getCurrentProductId,
//           quantity: 1,
//           sessionId
//         })
//       ).unwrap();

//       if (response.success) {
//         await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//         toast.success("Product added to cart!", {
//           icon: <CheckCircle className="text-green-500" />,
//         });
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       toast.error("Failed to add product to cart. Please try again.");
//     }
//   };

//   const handleViewProductDetails = (productId) => {
//     navigate(`/shop/product/${productId}`);
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-8">
//       {/* Loading state */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-12">
//           <div className="loader border-t-2 border-gray-600 rounded-full w-8 h-8 animate-spin" />
//         </div>
//       )}

//       {/* Empty state - no search performed */}
//       {!isLoading && !currentKeyword && (
//         <motion.div
//           className="flex flex-col items-center justify-center py-12 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <Search className="h-16 w-16 text-gray-300 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-700 mb-2">
//             Start your search!
//           </h2>
//           <p className="text-gray-500 mb-6">
//             Enter a product name or category in the search bar above.
//           </p>
//           <Button
//             variant="outline"
//             onClick={() => navigate("/shop/listing")}
//           >
//             Browse All Products
//           </Button>
//         </motion.div>
//       )}

//       {/* Search results */}
//       {!isLoading && currentKeyword && searchResults.length > 0 && (
//         <>
//           <motion.h2
//             className="text-xl font-bold mb-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             Search Results for "{currentKeyword}"
//           </motion.h2>
//           <motion.div
//             className="grid grid-cols-2 md:grid-cols-4 gap-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             {searchResults.map((item) => (
//               <motion.div
//                 key={item.id}
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <ShoppingProductTile
//                   product={item}
//                   handleAddToCart={handleAddToCart}
//                   handleViewDetails={handleViewProductDetails}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         </>
//       )}

//       {/* No results found */}
//       {!isLoading && currentKeyword && searchResults.length === 0 && (
//         <motion.div
//           className="flex flex-col items-center justify-center py-12 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <Search className="h-16 w-16 text-gray-300 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-700 mb-2">
//             No results found
//           </h2>
//           <p className="text-gray-500 mb-6">
//             We couldn't find any products matching "{currentKeyword}".
//           </p>
//           <Button
//             variant="outline"
//             onClick={() => navigate("/shop/listing")}
//           >
//             Browse All Products
//           </Button>
//         </motion.div>
//       )}
//     </div>
//   );
// }

// export default SearchProducts;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getSearchResults, resetSearchResults, setSearchKeyword } from "@/store/shop/search-slice";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Search, MessageCircle, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // WhatsApp configuration - consistent with listing page
  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  const [showWhatsAppHint, setShowWhatsAppHint] = useState(false);
  const [dismissedHint, setDismissedHint] = useState(false);

  // Get state from Redux
  const { 
    isLoading, 
    searchResults, 
    currentKeyword 
  } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // Show WhatsApp hint when no search results are found
  useEffect(() => {
    if (!isLoading && currentKeyword && searchResults.length === 0 && !dismissedHint) {
      const timer = setTimeout(() => {
        setShowWhatsAppHint(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowWhatsAppHint(false);
    }
  }, [isLoading, currentKeyword, searchResults.length, dismissedHint]);

  // Reset dismissed hint when search changes
  useEffect(() => {
    setDismissedHint(false);
  }, [currentKeyword]);

  // Effect to handle search when URL changes
  useEffect(() => {
    const searchQuery = searchParams.get("keyword") || "";
    
    // Update the keyword in Redux state
    dispatch(setSearchKeyword(searchQuery));

    if (searchQuery) {
      dispatch(getSearchResults(searchQuery));
    } else {
      dispatch(resetSearchResults());
    }
  }, [location.search, dispatch]);

  // Effect to fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();

        if (!userId && !sessionId) {
          console.warn("No user or session info available for cart fetch.");
          return;
        }

        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        if (!user) {
          localStorage.removeItem('guestSessionId');
        }
      }
    };

    fetchCart();
  }, [dispatch, user]);

  const handleWhatsAppRedirect = () => {
    const message = currentKeyword 
      ? `Hi ${COMPANY_NAME}, I searched for "${currentKeyword}" but couldn't find what I need. Can you help me find this product?`
      : `Hi ${COMPANY_NAME}, I'm searching for products but couldn't find what I'm looking for. Can you help me?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDismissHint = () => {
    setShowWhatsAppHint(false);
    setDismissedHint(true);
  };

  const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast.error("Session information missing. Please log in or refresh.", {
          icon: <AlertCircle className="text-red-500" />,
        });
        throw new Error("Neither userId nor sessionId is available");
      }

      const currentCartItems = cartItems?.items || [];
      const existingItem = currentCartItems.find(
        item => item.productId === getCurrentProductId
      );

      if (existingItem && existingItem.quantity >= getTotalStock) {
        toast.error(`Maximum available quantity (${getTotalStock}) reached.`, {
          icon: <AlertCircle className="text-red-500" />,
        });
        return;
      }

      const response = await dispatch(
        addToCart({
          userId,
          productId: getCurrentProductId,
          quantity: 1,
          sessionId
        })
      ).unwrap();

      if (response.success) {
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
        toast.success("Product added to cart!", {
          icon: <CheckCircle className="text-green-500" />,
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="loader border-t-2 border-gray-600 rounded-full w-8 h-8 animate-spin" />
          </div>
        )}

        {/* Empty state - no search performed */}
        {!isLoading && !currentKeyword && (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Start your search!
            </h2>
            <p className="text-gray-500 mb-6">
              Enter a product name or category in the search bar above.
            </p>
            
            {/* Consistent with listing page structure */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop/listing")}
                >
                  Browse All Products
                </Button>
              </div>
            </div>

            {/* WhatsApp Help Section - Exactly like listing page */}
            <motion.div
              className="mt-8 text-center border-t pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-600 mb-4">
                Couldn't find what you're looking for?
              </p>
              <Button
                onClick={handleWhatsAppRedirect}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask us on WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Search results */}
        {!isLoading && currentKeyword && searchResults.length > 0 && (
          <>
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Search Results for "{currentKeyword}"
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {searchResults.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ShoppingProductTile
                    product={item}
                    handleAddToCart={handleAddToCart}
                    handleViewDetails={handleViewProductDetails}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* WhatsApp Help Section - Exactly like listing page */}
            <motion.div
              className="mt-12 text-center border-t pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-gray-600 mb-4">
                Couldn't find what you're looking for?
              </p>
              <Button
                onClick={handleWhatsAppRedirect}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask us on WhatsApp
              </Button>
            </motion.div>
          </>
        )}

        {/* No results found */}
        {!isLoading && currentKeyword && searchResults.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <div className="mb-6">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg mb-4">No products found matching "{currentKeyword}".</p>
              <p className="text-sm text-gray-500 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              
              {/* Consistent button layout with listing page */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop/listing")}
                >
                  Browse All Products
                </Button>
              </div>
            </div>

            {/* WhatsApp Help Section - Exactly like listing page */}
            <motion.div
              className="mt-8 text-center border-t pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-600 mb-4">
                Couldn't find what you're looking for?
              </p>
              <Button
                onClick={handleWhatsAppRedirect}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask us on WhatsApp
              </Button>
            </motion.div>

            {/* Animated help card for empty state with close button */}
            <AnimatePresence>
              {showWhatsAppHint && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mt-8 relative"
                >
                  {/* Close button */}
                  <button
                    onClick={handleDismissHint}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close hint"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-start gap-3 pr-6">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Need something specific?
                      </h3>
                      <p className="text-blue-700 text-sm mb-3">
                        We might have exactly what you're looking for! Message us on WhatsApp and we'll help you find the perfect product.
                      </p>
                      <Button
                        onClick={handleWhatsAppRedirect}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact us on WhatsApp
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;