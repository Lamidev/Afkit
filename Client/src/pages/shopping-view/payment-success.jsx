import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

// --- Local Helpers ---
const formatAestheticId = (rawId, prefix = "ORD") => {
  if (!rawId) return "";
  const short = String(rawId).slice(-8).toUpperCase();
  return `${prefix}-${short}`;
};

const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const orderData = location.state?.orderData;

  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    // Fetch accessories for upselling
    dispatch(fetchAllFilteredProducts({ 
      filterParams: { category: ["accessories"] }, 
      sortParams: "latest-arrival" 
    }));
  }, [dispatch]);

  useEffect(() => {
    if (productList && productList.length > 0) {
      setAccessories(productList.slice(0, 4));
    }
  }, [productList]);

  useEffect(() => {
    if (!orderData) {
      navigate("/shop/home");
    }
  }, [orderData, navigate]);

  const handleWhatsAppSync = () => {
    if (!orderData) return;
    
    const phoneNumber = "2348164014304";
    const orderDetails = orderData;
    const isGift = orderDetails?.addressInfo?.isGift;
    const isAssisted = orderDetails?.addressInfo?.isAssisted;
    const recipientName = orderDetails?.addressInfo?.shippingInfo?.name || orderDetails?.addressInfo?.receiptName || orderDetails?.addressInfo?.fullName || "Valued Customer";
    // Buyer is strictly the Account Owner (the payer)
    const buyerName = orderDetails?.addressInfo?.receiptInfo?.name || user?.userName || user?.fullName || "AFKiT Customer";
    const aestheticOrderId = orderDetails?.orderId || (orderDetails?._id ? formatAestheticId(orderDetails._id, "ORD") : "PENDING");
    
    // Premium Design Tokens
    const divider = "━━━━━━━━━━━━━━━━━━━━";
    const bullet = "🔸";
    
    // Intent-Specific Branding
    const intentHeader = isGift ? "🎁 *PREMIUM SURPRISE GIFT*" : (isAssisted ? "🤝 *ASSISTED PURCHASE*" : "📦 *PERSONAL ORDER*");
    
    // Payment Status Logic
    const isPOD = orderDetails?.paymentType === "commitment";
    const paymentStatusHeader = isPOD ? "🟠 DEPOSIT PAID (₦10,000)" : "🟢 FULLY PAID (100%)";

    const cartItemsText = orderDetails.cartItems
      .map((item) => {
        // WhatsApp link scraper works best with backend OG routes to show metadata/images
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        const shopUrl = item.productId ? `${apiBase}/og/product/${item.productId.toString().replace("#", "")}` : `${window.location.origin}/shop/listing`;
        return `${bullet} *${item.title}*\n   _Condition: ${item.condition || "Standard"}_\n   _Qty: ${item.quantity}_\n   🔗 See Item: ${shopUrl}`;
      })
      .join("\n\n");

    const messageRaw = `
${intentHeader}
${divider}

*ORDER ID:* ${aestheticOrderId}
*STATUS:* ${paymentStatusHeader}
*BUYER (PAYER):* ${buyerName}

${divider}
*🛒 PURCHASED ITEMS:*
${cartItemsText}

${divider}
*💰 FINANCIAL SUMMARY:*
*Order Total:* ₦${parseFloat(orderDetails.totalAmount).toLocaleString()}
*Amount Paid:* ₦${parseFloat(orderDetails.amountPaid).toLocaleString()}
*Balance Due:* ₦${parseFloat(orderDetails.balanceAmount).toLocaleString()}

${isPOD ? `*DOOR PAYMENT:* ${recipientName} will pay ₦${parseFloat(orderDetails.balanceAmount).toLocaleString()} to the rider.` : "*DOOR PAYMENT:* ₦0 (Fully Paid)"}

${divider}
*📍 DELIVERY DETAILS:*
*Recipient:* ${recipientName}
*Address:* ${orderDetails.addressInfo?.shippingInfo?.location || orderDetails.addressInfo?.address || 'N/A'}
*State:* ${orderDetails.addressInfo?.region || 'N/A'}
*Phone:* ${orderDetails.addressInfo?.shippingInfo?.phone || orderDetails.addressInfo?.phone || 'N/A'}
${isGift ? `\n*NOTE:* This is a SURPRISE for ${recipientName}!` : ""}

${divider}
⚡ *ADMIN ACTION:*
Please verify payment, confirm stock, and prepare for dispatch.
Admin Link: ${window.location.origin}/admin/orders

_Sent via AFKiT Secure Checkout_
`;

    const encodedMessage = encodeURIComponent(messageRaw.trim());
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast.success("Added to your setup!");
      }
    });
  };

  const aestheticOrderId = orderData?._id ? formatAestheticId(orderData._id, "ORD") : "";

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-12">
      {/* Success Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-green-500 rounded-full -z-10"
            />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold sm:font-black text-slate-900 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-600 text-base sm:text-lg md:text-xl">
          Your order {aestheticOrderId ? `${aestheticOrderId}` : ""} has been received. 
          We've locked your gadgets and our logistics team is preparing them for delivery.
        </p>

        {/* WhatsApp Notification Pulse Button */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <Button 
            onClick={handleWhatsAppSync}
            className="group relative h-14 sm:h-16 px-6 sm:px-10 bg-green-600 hover:bg-green-700 text-white font-bold sm:font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-green-200"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-green-400 rounded-2xl -z-10 opacity-20"
            />
            <MessageCircle className="w-5 h-5 sm:w-6 h-6 mr-2 sm:mr-3 transition-transform group-hover:rotate-12" />
            Notify Attendant on WhatsApp
          </Button>
          <p className="text-[10px] sm:text-sm text-slate-400 font-medium italic">
            Speed up your delivery by notifying us directly!
          </p>
        </div>
      </motion.div>

      {/* Main Navigation Actions */}
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-lg">
        <Button 
          onClick={() => navigate("/shop/account")} 
          variant="secondary"
          className="flex-1 h-12 sm:h-14 font-bold rounded-xl"
        >
          View Order History
        </Button>
        <Button 
          onClick={() => navigate("/shop/home")} 
          variant="outline"
          className="flex-1 h-12 sm:h-14 font-bold rounded-xl border-slate-200"
        >
          Return to Store
        </Button>
      </div>

      {/* Upselling Section: Complete Your Setup */}
      {accessories.length > 0 && (
        <Card className="w-full max-w-6xl border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8 sm:p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
               <ShoppingBag className="w-6 h-6 text-primary" />
               <span className="uppercase tracking-[0.2em] font-black text-slate-400 text-xs">Recommended for you</span>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-black text-slate-900">Complete Your Setup</CardTitle>
            <p className="text-slate-500 mt-4 text-lg">Don't forget these essential accessories for your new gadgets.</p>
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessories.map((item) => (
                <div key={item._id} className="relative group">
                   <ShoppingProductTile 
                    product={item} 
                    handleAddToCart={() => handleAddToCart(item._id, item.totalStock)}
                    handleViewDetails={() => navigate(`/shop/listing`)}
                   />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
               <Button 
                variant="link" 
                onClick={() => navigate("/shop/listing?category=accessories")}
                className="text-primary font-black text-lg group"
               >
                 View All Accessories <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
               </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PaymentSuccessPage;
