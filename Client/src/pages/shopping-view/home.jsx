import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Button } from "@/components/ui/button";
import {
  Airplay,
  Apple,
  CloudLightning,
  Laptop,
  LaptopMinimal,
  ShoppingBag,
  Smartphone,
  TabletSmartphone,
  Tv,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice"; // This import is not used in the provided code
import { FaTruck, FaCreditCard, FaHeadset, FaShieldAlt } from "react-icons/fa";
import CustomerReviews from "@/components/shopping-view/customer-reviews";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";

const categoriesWithIcon = [
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "monitors", label: "Monitors", icon: Tv },
  { id: "accessories", label: "Accessories", icon: CloudLightning },
  { id: "all-products", label: "All Products", icon: ShoppingBag },
];

const supportFeatures = [
  {
    icon: FaShieldAlt,
    title: "6-MONTH WARRANTY",
    description:
      "We repair or replace at no cost if your uk-used gadget develops a fault within 6 months, even after months of use.",
  },
  {
    icon: FaTruck,
    title: "FREE NATIONWIDE DELIVERY",
    description:
      "No matter where you are in Nigeria, we deliver to your city for FREE.",
  },
  {
    icon: FaHeadset,
    title: "FREE ONLINE TECH SUPPORT",
    description:
      "We're always here to help with any questions or issues you have with your gadget.",
  },
];

// Define animation variants for sliding in
const itemVariants = {
  hidden: { opacity: 0, y: 50 }, // Starts invisible and slightly below
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Slides up and fades in
};

function ShoppingHome() {
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([]);

  // Shuffle function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Product shuffling effect
  useEffect(() => {
    if (productList.length > 0) {
      // Initialize with products
      const initialProducts = shuffleArray([...productList]).slice(0, 8);
      setCurrentProducts(initialProducts);

      const interval = setInterval(() => {
        // Generate new products on interval
        const newProducts = shuffleArray([...productList]).slice(0, 8);
        setCurrentProducts(newProducts);
      }, 20000); // Changed to 20 seconds as per your code's setInterval

      return () => clearInterval(interval);
    }
  }, [productList]);

  // Screen size detection
  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const categoriesToShow = isSmallScreen
    ? categoriesWithIcon.slice(0, 4)
    : categoriesWithIcon;

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem("filters");

    if (item.id === "all-products") {
      navigate(`/shop/listing`);
    } else {
      const currentFilter = { [section]: [item.id] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      const queryParams = new URLSearchParams();
      queryParams.set(section, item.id);
      navigate(`/shop/listing?${queryParams.toString()}`);
    }
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast.error(
          "Session information missing. Please log in or enable cookies.",
          {
            icon: <AlertCircle className="text-red-500" />,
          }
        );
        return;
      }

      const currentCartItems = Array.isArray(cartItems?.items)
        ? cartItems.items
        : [];
      const existingItem = currentCartItems.find(
        (item) => item.productId === getCurrentProductId
      );

      if (existingItem && existingItem.quantity >= getTotalStock) {
        toast.error(
          `Maximum available quantity (${getTotalStock}) reached for this product.`,
          {
            icon: <AlertCircle className="text-red-500" />,
          }
        );
        return;
      }

      if (!existingItem && 1 > getTotalStock) {
        toast.error(
          `Only ${getTotalStock} quantity available for this product.`
        );
        return;
      }

      if (existingItem && existingItem.quantity + 1 > getTotalStock) {
        toast.error(
          `Adding one more would exceed available stock of ${getTotalStock}.`
        );
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
        await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
        toast.success("Product added to cart!", {
          icon: <CheckCircle className="text-green-500" />,
        });
      } else {
        toast.error(response.message || "Failed to add product to cart.", {
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to add product to cart.");
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const sessionId = userId ? null : getOrCreateSessionId();
        if (userId || sessionId) {
          await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
        }
      } catch (error) {
        if (!user) localStorage.removeItem("guestSessionId");
      }
    };
    fetchCart();
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col space-y-8 sm:space-y-12 px-4 sm:px-6">
      {/* Hero Section */}
      <section className="w-full flex items-center justify-center py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() =>
            handleNavigateToListingPage({ id: "all-products" }, null)
          }
          className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center h-full w-full max-w-4xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
        >
          <motion.div
            className="text-center space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <span className="text-lg sm:text-xl font-medium text-gray-800">
                Your No.1 store that offers
              </span>
            </div>

            <motion.h1
              className="text-orange-500 font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              6 months warranty and
              <br className="hidden sm:block" /> payment on delivery
            </motion.h1>

            <p className="text-lg sm:text-xl md:text-2xl">
              on all UK-used gadgets
            </p>

            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="pt-2"
            >
              <Button
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold px-6 py-3 uppercase text-sm sm:text-base mx-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToListingPage({ id: "all-products" }, null);
                }}
              >
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Shop by category */}
      <section className="py-6 sm:py-8 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center">
              Shop by category
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {categoriesToShow.map(({ id, label, icon: Icon }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(
                      { id },
                      id === "all-products" ? null : "category"
                    )
                  }
                  className="cursor-pointer hover:shadow-md h-full"
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 text-blue-900" />
                    <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                      {" "}
                      {/* Changed text-[10px] to text-xs */}
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Products - ANIMATION APPLIED HERE */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Top Products
          </h2>
        </div>
        {/* Use AnimatePresence to animate components when they are added/removed */}
        <AnimatePresence mode="wait">
          {currentProducts.length > 0 ? (
            <motion.div
              key={JSON.stringify(currentProducts.map((p) => p._id))} // Key AnimatePresence with a stable identifier for the product set
              initial="hidden"
              animate="visible"
              exit="hidden" // Animates out existing products
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }, // Stagger children for a cascade effect
                },
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {currentProducts.map((productItem, index) => (
                <motion.div
                  key={productItem._id} // Key each item with its unique ID for AnimatePresence
                  variants={itemVariants} // Apply the individual item animation variants
                >
                  <ShoppingProductTile
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                    handleViewDetails={handleViewProductDetails}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="loading" // Unique key for the loading state
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center text-gray-500"
            >
              Loading products...
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Support Features */}
      <section className="max-w-7xl mx-auto py-12 sm:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Why Choose Afkit?</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We're committed to providing the best shopping experience with
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full">
                  {" "}
                  {/* Add h-full here to make card take full height of grid item */}
                  <CardContent className="flex flex-col items-center p-4 min-h-[150px]">
                    {" "}
                    {/* Added min-h-[150px] for consistent height */}
                    <Icon className="w-8 h-8 mb-3 text-blue-900" />
                    <h3 className="font-bold text-base mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-center text-gray-600">
                      {" "}
                      {/* Changed text-xs to text-sm */}
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />
    </div>
  );
}

export default ShoppingHome;

// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   Airplay,
//   Apple,
//   CloudLightning,
//   Laptop,
//   LaptopMinimal,
//   ShoppingBag,
//   Smartphone,
//   TabletSmartphone,
//   Tv,
//   CheckCircle,
//   AlertCircle,
//   ShieldCheck,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { useNavigate } from "react-router-dom";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// // import { getFeatureImages } from "@/store/common-slice"; // This import is not used in the provided code
// import { FaTruck, FaCreditCard, FaHeadset, FaShieldAlt } from "react-icons/fa";
// import CustomerReviews from "@/components/shopping-view/customer-reviews";
// import { toast } from "sonner";
// import { getOrCreateSessionId } from "@/components/utils/session";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// // Assuming LoadingSpinner is still needed somewhere or ProductTileSkeleton is used instead
// // import LoadingSpinner from "@/components/shopping-view/loading-spinner";

// const categoriesWithIcon = [
//   { id: "smartphones", label: "Smartphones", icon: Smartphone },
//   { id: "laptops", label: "Laptops", icon: Laptop },
//   { id: "monitors", label: "Monitors", icon: Tv },
//   { id: "accessories", label: "Accessories", icon: CloudLightning },
//   { id: "all-products", label: "All Products", icon: ShoppingBag },
// ];

// const brandsWithIcon = [
//   { id: "apple", label: "Apple", icon: Apple },
//   { id: "samsung", label: "Samsung", icon: Airplay },
//   { id: "dell", label: "Dell", icon: LaptopMinimal },
//   { id: "hp", label: "HP", icon: TabletSmartphone },
//   { id: "all-products", label: "All Products", icon: ShoppingBag },
// ];

// const supportFeatures = [
//   {
//     icon: FaShieldAlt,
//     title: "6-MONTH WARRANTY",
//     description:
//       "At Afkit, all UK-used gadgets come with a 6-month warranty, Your Peace of mind is guaranteed.",
//   },
//   {
//     icon: FaTruck,
//     title: "PAYMENT ON DELIVERY",
//     description:
//       "You pay only after you receive and check your item. No Risk, no Worries. You're in control.",
//   },
//   {
//     icon: FaHeadset,
//     title: "FREE ONLINE TECH SUPPORT",
//     description:
//       "We're always here to help with any questions or issues you have with your gadget.",
//   },
// ];

// // Define animation variants for sliding in
// const itemVariants = {
//   hidden: { opacity: 0, y: 50 }, // Starts invisible and slightly below
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Slides up and fades in
// };

// // --- START: Skeleton Product Tile Component ---
// const ProductTileSkeleton = () => (
//   <div className="border rounded-lg shadow-sm overflow-hidden animate-pulse">
//     <div className="aspect-square bg-gray-200 flex items-center justify-center">
//       {/* Optional: Add a subtle loading icon here if you like */}
//     </div>
//     <div className="p-3">
//       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
//       <div className="h-10 bg-blue-200 rounded mt-4"></div>
//     </div>
//   </div>
// );
// // --- END: Skeleton Product Tile Component ---

// function ShoppingHome() {
//   const { productList } = useSelector((state) => state.shopProducts);
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [currentProducts, setCurrentProducts] = useState([]);
//   const [hasLoadedInitialProducts, setHasLoadedInitialProducts] = useState(false); // New state for initial load

//   // Shuffle function
//   const shuffleArray = (array) => {
//     const newArray = [...array];
//     for (let i = newArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }
//     return newArray;
//   };

//   // Product shuffling effect and initial load handling
//   useEffect(() => {
//     if (productList.length > 0) {
//       // Data has arrived, set current products and mark as loaded
//       setCurrentProducts(shuffleArray([...productList]).slice(0, 8));
//       setHasLoadedInitialProducts(true); // Mark that initial products have been loaded

//       // Start the interval for subsequent shuffles (only after initial load)
//       const interval = setInterval(() => {
//         setCurrentProducts(shuffleArray([...productList]).slice(0, 8));
//       }, 20000); // Changed to 20 seconds as per your code's setInterval

//       return () => clearInterval(interval);
//     }
//   }, [productList]);

//   // Initial fetch of products
//   useEffect(() => {
//     // Only fetch if productList is empty AND we haven't loaded them before
//     if (productList.length === 0 && !hasLoadedInitialProducts) {
//       dispatch(
//         fetchAllFilteredProducts({
//           filterParams: {},
//           sortParams: "price-lowtohigh",
//         })
//       );
//     }
//   }, [dispatch, productList.length, hasLoadedInitialProducts]); // Depend on productList.length and hasLoadedInitialProducts

//   // Screen size detection
//   useEffect(() => {
//     const checkScreen = () => setIsSmallScreen(window.innerWidth < 640);
//     checkScreen();
//     window.addEventListener("resize", checkScreen);
//     return () => window.removeEventListener("resize", checkScreen);
//   }, []);

//   const categoriesToShow = isSmallScreen
//     ? categoriesWithIcon.slice(0, 4)
//     : categoriesWithIcon;

//   const handleNavigateToListingPage = (item, section) => {
//     sessionStorage.removeItem("filters");

//     if (item.id === "all-products") {
//       navigate(`/shop/listing`);
//     } else {
//       const currentFilter = { [section]: [item.id] };
//       sessionStorage.setItem("filters", JSON.stringify(currentFilter));
//       const queryParams = new URLSearchParams();
//       queryParams.set(section, item.id);
//       navigate(`/shop/listing?${queryParams.toString()}`);
//     }
//   };

//   const handleViewProductDetails = (productId) => {
//     navigate(`/shop/product/${productId}`);
//   };

//   const handleAddToCart = async (getCurrentProductId, getTotalStock) => {
//     try {
//       const userId = user?.id;
//       const sessionId = userId ? null : getOrCreateSessionId();

//       if (!userId && !sessionId) {
//         toast.error(
//           "Session information missing. Please log in or enable cookies.",
//           {
//             icon: <AlertCircle className="text-red-500" />,
//           }
//         );
//         return;
//       }

//       const currentCartItems = Array.isArray(cartItems?.items)
//         ? cartItems.items
//         : [];
//       const existingItem = currentCartItems.find(
//         (item) => item.productId === getCurrentProductId
//       );

//       if (existingItem && existingItem.quantity >= getTotalStock) {
//         toast.error(
//           `Maximum available quantity (${getTotalStock}) reached for this product.`,
//           {
//             icon: <AlertCircle className="text-red-500" />,
//           }
//         );
//         return;
//       }

//       if (!existingItem && 1 > getTotalStock) {
//         toast.error(
//           `Only ${getTotalStock} quantity available for this product.`
//         );
//         return;
//       }

//       if (existingItem && existingItem.quantity + 1 > getTotalStock) {
//         toast.error(
//           `Adding one more would exceed available stock of ${getTotalStock}.`
//         );
//         return;
//       }

//       const response = await dispatch(
//         addToCart({
//           userId,
//           productId: getCurrentProductId,
//           quantity: 1,
//           sessionId,
//         })
//       ).unwrap();

//       if (response.success) {
//         await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//         toast.success("Product added to cart!", {
//           icon: <CheckCircle className="text-green-500" />,
//         });
//       } else {
//         toast.error(response.message || "Failed to add product to cart.", {
//           icon: <AlertCircle className="text-red-500" />,
//         });
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to add product to cart.");
//     }
//   };

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const userId = user?.id;
//         const sessionId = userId ? null : getOrCreateSessionId();
//         if (userId || sessionId) {
//           await dispatch(fetchCartItems({ userId, sessionId })).unwrap();
//         }
//       } catch (error) {
//         if (!user) localStorage.removeItem("guestSessionId");
//       }
//     };
//     fetchCart();
//   }, [dispatch, user]);

//   return (
//     <div className="flex flex-col space-y-8 sm:space-y-12 px-4 sm:px-6">
//       {/* Hero Section */}
//       <section className="w-full flex items-center justify-center py-8 sm:py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           onClick={() =>
//             handleNavigateToListingPage({ id: "all-products" }, null)
//           }
//           className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center h-full w-full max-w-4xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
//         >
//           <motion.div
//             className="text-center space-y-4 sm:space-y-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <ShieldCheck className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
//               <span className="text-sm sm:text-base font-medium text-gray-800">
//                 Your No.1 store that offers
//               </span>
//             </div>

//             <motion.h1
//               className="text-orange-500 font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
//               initial={{ scale: 1 }}
//               animate={{ scale: [1, 1.02, 1] }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 repeatType: "loop",
//               }}
//             >
//               6 months warranty and
//               <br className="hidden sm:block" /> payment on delivery
//             </motion.h1>

//             <p className="text-gray-800 text-sm sm:text-base md:text-lg">
//               on all UK-used gadgets
//             </p>

//             <motion.div
//               initial={{ scale: 1 }}
//               animate={{ scale: [1, 1.05, 1] }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 repeatType: "loop",
//               }}
//               className="pt-2"
//             >
//               <Button
//                 className="bg-blue-900 hover:bg-blue-700 text-white font-bold px-6 py-3 uppercase text-sm sm:text-base mx-auto"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNavigateToListingPage({ id: "all-products" }, null);
//                 }}
//               >
//                 Shop Now
//               </Button>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Shop by category */}
//       <section className="py-6 sm:py-8 bg-gray-50 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-center mb-6 sm:mb-8">
//             <h2 className="text-xl sm:text-2xl font-bold text-center">
//               Shop by category
//             </h2>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
//             {categoriesToShow.map(({ id, label, icon: Icon }) => (
//               <motion.div
//                 key={id}
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Card
//                   onClick={() =>
//                     handleNavigateToListingPage(
//                       { id },
//                       id === "all-products" ? null : "category"
//                     )
//                   }
//                   className="cursor-pointer hover:shadow-md h-full"
//                 >
//                   <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3">
//                     <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 text-blue-900" />
//                     <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-center leading-tight">
//                       {label}
//                     </span>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Top Products - ANIMATION APPLIED HERE */}
//       <section className="max-w-7xl mx-auto">
//         <div className="flex justify-center mb-6">
//           <h2 className="text-xl sm:text-2xl font-bold text-center">
//             Top Products
//           </h2>
//         </div>
//         <AnimatePresence mode="wait">
//           {/* Show skeletons ONLY IF we haven't loaded products yet AND productList is still empty */}
//           {!hasLoadedInitialProducts && productList.length === 0 ? (
//             <motion.div
//               key="loading-skeleton" // Unique key for the loading state
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
//             >
//               {/* Render 8 skeleton loaders */}
//               {Array.from({ length: 8 }).map((_, index) => (
//                 <ProductTileSkeleton key={index} />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key={JSON.stringify(currentProducts.map(p => p._id))} // Key AnimatePresence with a stable identifier for the product set
//               initial="hidden"
//               animate="visible"
//               exit="hidden" // Animates out existing products
//               variants={{
//                 hidden: { opacity: 0 },
//                 visible: {
//                   opacity: 1,
//                   transition: { staggerChildren: 0.1, delayChildren: 0.2 }, // Stagger children for a cascade effect
//                 },
//               }}
//               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
//             >
//               {currentProducts.map((productItem) => ( // Removed index as it's not strictly needed if key is _id
//                 <motion.div
//                   key={productItem._id} // Key each item with its unique ID for AnimatePresence
//                   variants={itemVariants} // Apply the individual item animation variants
//                 >
//                   <ShoppingProductTile
//                     product={productItem}
//                     handleAddToCart={handleAddToCart}
//                     handleViewDetails={handleViewProductDetails}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       {/* Support Features */}
//       <section className="max-w-7xl mx-auto py-12 sm:py-16">
//         <div className="text-center mb-6 sm:mb-8">
//           <h2 className="text-xl sm:text-2xl font-bold">Why Choose Afkit?</h2>
//           <p className="text-gray-600 mt-2 text-sm sm:text-base">
//             We're committed to providing the best shopping experience with
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {supportFeatures.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.03 }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Card>
//                   <CardContent className="flex flex-col items-center p-4">
//                     <Icon className="w-8 h-8 mb-3 text-blue-900" />
//                     <h3 className="font-bold text-base mb-2 text-center">
//                       {feature.title}
//                     </h3>
//                     <p className="text-xs text-center text-gray-600">
//                       {feature.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       </section>

//       {/* Customer Reviews */}
//       <CustomerReviews />

//       {/* FAQ Section */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
//         >
//           <h2 className="text-3xl font-bold text-center mb-6 text-primary">
//             Frequently Asked Questions
//           </h2>
//           <p className="text-gray-600 text-center mb-10 text-base max-w-2xl mx-auto">
//             Find answers to the most common questions about our products,
//             services, and policies.
//           </p>

//           <Accordion
//             type="single"
//             collapsible
//             className="max-w-3xl mx-auto border-t border-b border-gray-200"
//           >
//             <AccordionItem
//               value="warranty"
//               className="border-b border-gray-200 last:border-b-0"
//             >
//               <AccordionTrigger className="text-lg font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
//                 What does the 6-month warranty cover?
//               </AccordionTrigger>
//               <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
//                 Our warranty covers any manufacturing defects or hardware
//                 failures that occur during normal use. We'll repair or replace
//                 your device at no additional cost.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem
//               value="delivery"
//               className="border-b border-gray-200 last:border-b-0"
//             >
//               <AccordionTrigger className="text-lg font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
//                 How does payment on delivery work?
//               </AccordionTrigger>
//               <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
//                 You only pay after inspecting your item upon delivery. Our
//                 delivery agents will wait while you test the product to ensure
//                 you're completely satisfied.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="quality" className="last:border-b-0">
//               <AccordionTrigger className="text-lg font-semibold text-primary hover:text-orange-500 data-[state=open]:text-blue-800 data-[state=open]:bg-gray-100 px-4 py-3">
//                 How do you ensure product quality?
//               </AccordionTrigger>
//               <AccordionContent className="text-muted-foreground text-base p-4 bg-white">
//                 Every device undergoes a rigorous 10-point inspection process by
//                 our technicians. We only stock items that meet our strict
//                 quality standards.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </motion.div>
//       </section>
//     </div>
//   );
// }

// export default ShoppingHome;
