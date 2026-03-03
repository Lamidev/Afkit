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
  ChevronRight,
  MapPin,
  Plane,
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
      "Full coverage for hardware faults. We repair or replace at no cost within 6 months of purchase.",
  },
  {
    icon: FaTruck,
    title: "FREE DELIVERY",
    description:
      "Nationwide: Lagos (Doorstep), SW (Car Parks), East/North (Airports).",
  },
  {
    icon: FaCreditCard,
    title: "PAYMENT ON DELIVERY",
    description:
      "Secure your gadget with just ₦10k and pay the balance only after inspection on arrival.",
  },
  {
    icon: FaHeadset,
    title: "LIFETIME TECH SUPPORT",
    description:
      "Get free assistance with setup, software, or troubleshooting for any gadget bought from Afkit.",
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

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
      navigate(`/shop/listing?sort=random`);
    } else {
      const currentFilter = { [section]: [item.id] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      const queryParams = new URLSearchParams();
      queryParams.set(section, item.id);
      queryParams.set("sort", "random");
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
        sortParams: "latest-arrival",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col space-y-4 sm:space-y-12">
      {/* Premium Hero Section - Entirely Clickable */}
      <section 
        className="relative w-full min-h-[420px] sm:min-h-[520px] flex items-center justify-center overflow-hidden bg-white cursor-pointer group"
        onClick={() => handleNavigateToListingPage({ id: "all-products" }, null)}
      >
        {/* Subtle Background Pattern/Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full filter blur-3xl opacity-30 -mr-64 -mt-64 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full filter blur-3xl opacity-30 -ml-64 -mb-64 group-hover:opacity-40 transition-opacity"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 pt-12 sm:pt-16 relative z-10 text-center"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Your No.1 online store that offers
              </span>
            </div>

            <motion.h1
              className="text-orange-500 font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              6 MONTHS WARRANTY, <br className="hidden sm:block" />
              PAYMENT ON DELIVERY & <span className="text-slate-900">FREE DELIVERY</span>
            </motion.h1>

            <div className="space-y-4">
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                on all UK-used gadgets
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-2 flex flex-col items-center gap-12"
            >
              <Button
                size="md"
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-xl text-xs sm:text-sm font-black shadow-xl shadow-primary/25 group-hover:scale-105 transition-all uppercase tracking-[0.2em]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToListingPage({ id: "all-products" }, null);
                }}
              >
                Shop Now
              </Button>

              {/* Debate Campaign Link */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group/debate"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/shop/debate");
                }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-blue-600 rounded-2xl blur opacity-25 group-hover/debate:opacity-50 transition duration-1000 group-hover/debate:duration-200"></div>
                <div className="relative flex flex-col items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer min-w-[280px]">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[4px] mb-1">
                    Join the Contest
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-none">
                    "DEFEND YOUR FAVE"
                  </h3>
                  <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-widest">
                    Challenge
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Shop by category */}
      <section className="py-4 sm:py-8 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-blue-900 group-hover:text-orange-500 transition-colors" />
                    <span className="text-sm sm:text-base font-bold text-center leading-tight uppercase tracking-tight">
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <div className="text-center">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              Can't find the product you are looking for?
            </h3>
            <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm sm:text-base">
              We have access to a wide range of UK-used gadgets beyond what's shown here.
              If you don't see the specific product you need, just ask us on WhatsApp!
            </p>
            <Button
              onClick={handleWhatsAppRedirect}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg font-semibold text-sm sm:text-base"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              ASK US ON WHATSAPP
            </Button>
          </div>
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span className="relative">
                TOP
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-500 rounded-full"></span>
              </span>
              <span className="text-orange-600">PRODUCTS</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handpicked for you</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-orange-600 font-bold hover:bg-orange-50 group px-0"
            onClick={() => handleNavigateToListingPage({ id: "all-products" }, null)}
          >
            VIEW ALL 
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
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

      {/* Support Features */}
      <section className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Why Choose Afkit?</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We're committed to providing the best shopping experience
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

      {/* Regional Logistics Section */}
      <section className="bg-slate-50 border-y border-slate-100 py-12 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
               <span className="text-[10px] sm:text-[12px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">
                 Our Logistics Network
               </span>
               <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                 Reliable Regional Delivery
               </h2>
               <div className="w-12 h-1 bg-orange-500 rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
               {/* Lagos Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center"
               >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <FaTruck className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Lagos State</h3>
                  <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4">
                    Doorstep Delivery
                  </div>
                  <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                    Enjoy FREE delivery straight to your home or office anywhere in Lagos.
                  </p>
               </motion.div>

               {/* South West Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center"
               >
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">South-West</h3>
                  <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4">
                    Car Park Pickup
                  </div>
                  <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                    FREE delivery to major car parks in all South-Western states.
                  </p>
               </motion.div>

               {/* East/North Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center"
               >
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <Plane className="w-8 h-8 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">East & North</h3>
                  <div className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4">
                    Airport Pickup
                  </div>
                  <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                    FREE delivery to the nearest Airport in your city.
                  </p>
               </motion.div>
            </div>

            <div className="mt-12 text-center">
               <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                 * Doorstep delivery outside Lagos is available as a paid upgrade during checkout for your convenience.
               </p>
            </div>
         </div>
      </section>

      <CustomerReviews />

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <div className="text-center">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              Can't find the product you are looking for?
            </h3>
            <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm sm:text-base">
              Don't worry! We specialize in sourcing hard-to-find UK-used gadgets.
              Our WhatsApp team is ready to help you find exactly what you need.
            </p>
            <Button
              onClick={handleWhatsAppRedirect}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg font-semibold text-sm sm:text-base"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              ASK US ON WHATSAPP
            </Button>
          </div>
        </motion.div>
      </section>
    </div >
  );
}

export default ShoppingHome;
