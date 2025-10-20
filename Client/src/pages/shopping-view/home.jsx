import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CloudLightning,
  Laptop,
  ShoppingBag,
  Smartphone,
  Tv,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { FaTruck, FaCreditCard, FaHeadset, FaShieldAlt } from "react-icons/fa";
import CustomerReviews from "@/components/shopping-view/customer-reviews";
import { toast } from "sonner";
import { getOrCreateSessionId } from "@/components/utils/session";

const categoriesWithIcon = [
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
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
    icon: FaCreditCard,
    title: "PAYMENT ON DELIVERY",
    description:
      "You pay only after you receive and check your item. No Risk, no Worries. You're in control.",
  },
  {
    icon: FaHeadset,
    title: "FREE ONLINE TECH SUPPORT",
    description:
      "We're always here to help with any questions or issues you have with your gadget.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function ShoppingHome() {
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([]);

  const WHATSAPP_NUMBER = "2348164014304";
  const COMPANY_NAME = "Afkit";

  const handleWhatsAppRedirect = () => {
    const message = `Hi ${COMPANY_NAME}, I'm browsing your products but couldn't find what I'm looking for. Can you help me?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (productList.length > 0) {
      const initialProducts = shuffleArray([...productList]).slice(0, 8);
      setCurrentProducts(initialProducts);

      const interval = setInterval(() => {
        const newProducts = shuffleArray([...productList]).slice(0, 8);
        setCurrentProducts(newProducts);
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [productList]);

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
              6 MONTHS WARRANTY AND
              <br className="hidden sm:block" /> FREE DELIVERY
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
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

      <section className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Top Products
          </h2>
        </div>
        <AnimatePresence mode="wait">
          {currentProducts.length > 0 ? (
            <motion.div
              key={JSON.stringify(currentProducts.map((p) => p._id))}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {currentProducts.map((productItem, index) => (
                <motion.div key={productItem._id} variants={itemVariants}>
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
              key="loading"
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

      <section className="max-w-7xl mx-auto py-12 sm:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Why Choose Afkit?</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We're committed to providing the best shopping experience with
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <CardContent className="flex flex-col items-center p-4 min-h-[150px]">
                    <Icon className="w-8 h-8 mb-3 text-blue-900" />
                    <h3 className="font-bold text-base mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-center text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CustomerReviews />

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
    </div>
  );
}

export default ShoppingHome;
