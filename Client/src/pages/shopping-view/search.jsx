import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams(); // No need for setSearchParams if external component sets it
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // Effect to trigger search when URL keyword changes
  useEffect(() => {
    const searchQuery = searchParams.get("keyword");
    if (searchQuery) {
      setKeyword(searchQuery); // Sync local state with URL
      setIsLoading(true);
      dispatch(getSearchResults(searchQuery)).finally(() => setIsLoading(false));
    } else {
      setKeyword(""); // Clear local state if no keyword in URL
      dispatch(resetSearchResults()); // Clear previous search results
    }
  }, [location.search, dispatch, searchParams]); // `searchParams` is derived from `location.search`, but keeping it as dependency is harmless

  // Effect to fetch cart items (existing logic)
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
          localStorage.removeItem('guestSessionId'); // Clear session if fetching failed for guest
        }
      }
    };

    fetchCart();
  }, [dispatch, user]); // Depend on dispatch and user to re-fetch if user changes

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
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Loader for active search */}
      {isLoading && keyword && (
        <div className="flex justify-center items-center py-12">
          <div className="loader border-t-2 border-gray-600 rounded-full w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Message when no keyword is present (initial load or cleared search) */}
      {!isLoading && !keyword && searchResults.length === 0 && (
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
          <Button
            variant="outline"
            onClick={() => navigate("/shop/listing")}
          >
            Browse All Products
          </Button>
        </motion.div>
      )}

      {/* Message when a search keyword is present but no results found */}
      {!isLoading && searchResults.length === 0 && keyword && (
        <motion.div
          className="flex flex-col items-center justify-center py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No results found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any products matching "{keyword}".
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/listing")}
          >
            Browse All Products
          </Button>
        </motion.div>
      )}

      {/* Display search results */}
      {searchResults.length > 0 && (
        <>
          <motion.h2
            className="text-xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Search Results for "{keyword}"
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {searchResults.map((item) => (
              <motion.div
                key={item.id} // Ensure `item.id` is a stable unique identifier
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ShoppingProductTile
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleViewDetails={handleViewProductDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default SearchProducts;