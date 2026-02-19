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

  const handleWhatsAppSync = () => {
    const phoneNumber = "2349114389146"; // Official Afkit Line
    const orderId = orderData?._id?.slice(-6).toUpperCase() || "RECENT";
    const amount = orderData?.totalAmount ? `₦${orderData.totalAmount.toLocaleString()}` : "";
    const items = orderData?.cartItems?.map(item => `${item.quantity}x ${item.title}`).join(", ") || "gadgets";
    
    const message = `Hello AFKiT! 🚀 I just completed my purchase on the website.\n\n*Order ID:* #${orderId}\n*Items:* ${items}\n*Total:* ${amount}\n\nPlease confirm my order and let me know when it ships! Thanks.`;
    
    const encodedMessage = encodeURIComponent(message);
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
        dispatch(fetchCartItems(user?.id));
        toast.success("Added to your setup!");
      }
    });
  };

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
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-600 text-lg md:text-xl">
          Your order {orderData?._id ? `#${orderData._id.slice(-6).toUpperCase()}` : ""} has been received. 
          We've locked your gadgets and our logistics team is preparing them for delivery.
        </p>

        {/* WhatsApp Notification Pulse Button */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <Button 
            onClick={handleWhatsAppSync}
            className="group relative h-16 px-10 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-200"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-green-400 rounded-2xl -z-10 opacity-20"
            />
            <MessageCircle className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
            Notify Attendant on WhatsApp
          </Button>
          <p className="text-sm text-slate-400 font-medium italic">
            Speed up your delivery by notifying us directly!
          </p>
        </div>
      </motion.div>

      {/* Main Navigation Actions */}
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-lg">
        <Button 
          onClick={() => navigate("/shop/account")} 
          variant="secondary"
          className="flex-1 h-14 font-bold rounded-xl"
        >
          View Order History
        </Button>
        <Button 
          onClick={() => navigate("/shop/home")} 
          variant="outline"
          className="flex-1 h-14 font-bold rounded-xl border-slate-200"
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
