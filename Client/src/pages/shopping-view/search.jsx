import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getSearchResults, resetSearchResults, setSearchKeyword } from "@/store/shop/search-slice";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Search, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  const { 
    isLoading, 
    searchResults, 
    currentKeyword 
  } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    const searchQuery = searchParams.get("keyword") || "";
    
    dispatch(setSearchKeyword(searchQuery));

    if (searchQuery) {
      dispatch(getSearchResults(searchQuery));
    } else {
      dispatch(resetSearchResults());
    }
  }, [location.search, dispatch]);

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

  const WhatsAppHelpSection = () => (
    <section className="max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 sm:p-8 shadow-lg"
      >
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Can't find the product you are looking for?
          </h3>
          <Button
            onClick={handleWhatsAppRedirect}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg font-semibold"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            ASK US ON WHATSAPP
          </Button>
        </div>
      </motion.div>
    </section>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="loader border-t-2 border-gray-600 rounded-full w-8 h-8 animate-spin" />
          </div>
        )}

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

            <WhatsAppHelpSection />
          </motion.div>
        )}

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

            <div className="mt-12">
              <WhatsAppHelpSection />
            </div>
          </>
        )}

        {!isLoading && currentKeyword && searchResults.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <div className="mb-6">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg mb-4">No products found matching "{currentKeyword}".</p>
              <p className="text-sm text-gray-500 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop/listing")}
                >
                  Browse All Products
                </Button>
              </div>
            </div>

            <WhatsAppHelpSection />
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;