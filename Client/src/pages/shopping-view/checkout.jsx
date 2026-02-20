import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/order-slice";
import { CreditCard, Truck, Check, AlertCircle, AlertTriangle, Gift, User, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { productList } = useSelector((state) => state.shopProducts);
  const location = useLocation();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentType, setPaymentType] = useState(location.state?.paymentType || "commitment");
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isPodConfirmed, setIsPodConfirmed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCartAmount =
  cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce(
        (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
        0
      )
    : 0;

  // Check if cart contains major gadgets (Laptops, Phones, Monitors)
  const hasMajorGadget = cartItems?.items?.some(item => {
    const product = productList.find(p => p._id === item.productId);
    return product && ["laptops", "smartphones", "monitors"].includes(product.category);
  });

  // Enforce full payment for orders below 15,000 or if NO major gadgets are present
  useEffect(() => {
    if (totalCartAmount > 0) {
      if ((totalCartAmount < 15000 || !hasMajorGadget) && paymentType === "commitment") {
        setPaymentType("full");
      }
    }
  }, [totalCartAmount, paymentType, hasMajorGadget]);

  function handleInitiatePaystackPayment() {
    if (cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select a shipping address to proceed.");
      return;
    }
    // Block POD + proxy order without confirmation
    if (isGift && paymentType === "commitment" && !isPodConfirmed) {
      toast.error("Please confirm the recipient is aware they need to pay on delivery.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartItems: cartItems.items.map((cartItem) => ({
        productId: cartItem?.productId,
        title: cartItem?.title,
        image: cartItem?.image,
        price: cartItem?.price,
        quantity: cartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        fullName: currentSelectedAddress?.fullName,
        email: currentSelectedAddress?.email,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        isGift: isGift,
        receiptName: isGift ? recipientName : currentSelectedAddress?.fullName,
        recipientEmail: isGift ? recipientEmail : "",
      },
      orderStatus: "pending",
      paymentMethod: "Paystack",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      paymentType: paymentType,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      payerEmail: user?.email,
    };

    setIsProcessingOrder(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsProcessingOrder(false);
        window.location.href = data?.payload?.approvalURL;
      } else {
        setIsProcessingOrder(false);
        toast.error("Failed to initialize payment. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-col">
      {/* Step Tracker for Checkout */}
      <div className="bg-white border-b border-slate-100 py-6 sm:py-8 sticky top-[155px] -mx-4 sm:-mx-6 lg:-mx-8 z-30 shadow-sm shadow-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            {/* Step 1: Info */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black">
                1
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Information</span>
            </div>

            {/* Step 2: Payment */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                currentSelectedAddress ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white border-2 border-slate-100 text-slate-300"
              }`}>
                2
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                currentSelectedAddress ? "text-slate-900" : "text-slate-300"
              }`}>Payment</span>
            </div>

            {/* Step 3: Success */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 text-slate-300 flex items-center justify-center font-black">
                3
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Shop Link - For effortless navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shop/listing')}
          className="group flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors p-0 h-auto font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-3 text-slate-900 uppercase">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Truck className="w-5 h-5 text-orange-500" />
                </div>
                1. Recipient & Delivery Address
              </h2>
              <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-wider leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-orange-500 font-black">IMPORTANT:</span> If this is a gift, please select/add the <span className="underline">Recipient's Address</span> so the rider can find them.
              </p>
            </div>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Purchase Intent Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Gift className="w-4 h-4 text-orange-500" />
              </div>
              Who is this order for?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Personal Option */}
              <div
                onClick={() => { setIsGift(false); setIsPodConfirmed(false); }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                  !isGift ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <User className={`w-6 h-6 ${!isGift ? "text-orange-500" : "text-slate-400"}`} />
                <div>
                  <p className="font-bold text-sm text-slate-900">For Myself</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Personal purchase</p>
                </div>
                {!isGift && (
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center mt-1">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* For Someone Else Option */}
              <div
                onClick={() => { setIsGift(true); setIsPodConfirmed(false); }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                  isGift ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <Gift className={`w-6 h-6 ${isGift ? "text-orange-500" : "text-slate-400"}`} />
                <div>
                  <p className="font-bold text-sm text-slate-900">For Someone Else</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Helping a friend or family</p>
                </div>
                {isGift && (
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center mt-1">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Recipient Name Field */}
            <AnimatePresence>
              {isGift && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Recipient's Full Name (for Receipt)</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Enter the gadget owner's name"
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-sm placeholder:text-slate-300"
                    />
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Recipient's Email (Optional)</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-sm placeholder:text-slate-300"
                    />
                    <p className="text-[10px] text-blue-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                      ✨ We'll only send the warranty here <span className="underline">after</span> successful delivery. No spoilers before!
                    </p>

                    {/* POD Warning Gate — only shows if POD is selected */}
                    <AnimatePresence>
                      {paymentType === "commitment" && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
                        >
                          <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-amber-800">Heads up!</p>
                              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                You selected <strong>Pay on Delivery</strong> for an order going to someone else.
                                This means <strong>{recipientName || "the recipient"}</strong> will be responsible for paying the balance at the door.
                                Please confirm they are aware.
                              </p>
                              <div
                                onClick={() => setIsPodConfirmed(!isPodConfirmed)}
                                className={`mt-3 flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border-2 transition-all ${
                                  isPodConfirmed
                                    ? "border-green-500 bg-green-50"
                                    : "border-amber-300 bg-white"
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  isPodConfirmed ? "border-green-500 bg-green-500" : "border-amber-400"
                                }`}>
                                  {isPodConfirmed && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-xs font-semibold text-amber-900">
                                  I confirm — {recipientName || "the recipient"} knows they need to pay on delivery.
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-3 text-slate-900 uppercase">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              2. Payment Method
            </h2>

            {!hasMajorGadget && cartItems?.items?.length > 0 && (
              <div className="mb-4 bg-amber-50 border-2 border-amber-200 p-4 rounded-xl flex gap-4 items-start shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900 uppercase">Accessory Cart Detected</p>
                  <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
                    Payment on Delivery is only available for <span className="underline font-black">Major Gadgets</span> (Laptops/Phones/Monitors). 
                    Since your cart contains only accessories, <span className="font-black text-amber-950 text-[11px]">Full Payment</span> is required.
                  </p>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 ${(totalCartAmount >= 15000 && hasMajorGadget) ? 'sm:grid-cols-2' : ''} gap-4`}>
              {totalCartAmount >= 15000 && hasMajorGadget && (
                <div
                  onClick={() => setPaymentType("commitment")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    paymentType === "commitment"
                      ? "border-orange-500 bg-orange-50/50 ring-4 ring-orange-500/5"
                      : "border-slate-100 hover:border-orange-500/30"
                  }`}
                >
                  <div className="font-black text-slate-900 uppercase tracking-tight">Payment on Delivery</div>
                  <div className="space-y-2 mt-2">
                    <p className="text-[10px] font-black text-slate-700 leading-relaxed">
                      Pay ₦10,000 commitment fee now, balance on arrival.
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                      Refundable if you don't like the product after checking it. FREE DELIVERY included.
                    </p>
                  </div>
                  {paymentType === "commitment" && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                       <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              )}
              <div
                onClick={() => setPaymentType("full")}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  paymentType === "full"
                    ? "border-orange-500 bg-orange-50/50 ring-4 ring-orange-500/5"
                    : "border-slate-100 hover:border-orange-500/30"
                }`}
              >
                <div className="font-black text-slate-900 uppercase tracking-tight">Full Upfront Payment</div>
                <p className="text-[10px] font-bold text-slate-500 mt-2 leading-relaxed">
                  Pay the total amount now for faster processing and delivery.
                </p>
                 {paymentType === "full" && (
                   <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-100 lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-black mb-6 text-slate-900 uppercase tracking-tight">Order Summary</h2>
            <div className="space-y-4 max-h-[40vh] lg:max-h-[500px] overflow-auto pr-2 custom-scrollbar">
              {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                cartItems.items.map((item) => (
                  <UserCartItemsContent cartItem={item} key={item.productId} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                   <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Empty Container</p>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                <span>Items Price</span>
                <span className="text-slate-900">₦{totalCartAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-500 uppercase tracking-widest leading-none">
                <span>Delivery Fee</span>
                <span>FREE</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total to pay</span>
                  <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">₦{totalCartAmount.toLocaleString()}</span>
                </div>
              </div>

              {paymentType === "commitment" && (
                <div className="bg-slate-900 p-4 rounded-xl mt-6 border border-slate-800 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Deposit Due Now</span>
                    <span className="text-xl font-black text-white">₦10,000</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest border-t border-white/5 pt-2">
                    <span>Balance on Arrival</span>
                    <span className="text-amber-500">₦{(totalCartAmount - 10000).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Dynamic Responsibility Summary */}
              <div className="mt-8 p-4 sm:p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                   <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Clear Responsibilities</h3>
                </div>

                <div className="space-y-3">
                  {/* Delivery Location */}
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Delivery Target</p>
                      <p className="text-xs font-bold text-slate-900">
                        {currentSelectedAddress ? `${currentSelectedAddress.fullName} in ${currentSelectedAddress.city}` : "Select Address First"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Flow */}
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">What happens now?</p>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {isGift 
                          ? `You are paying ${paymentType === 'commitment' ? 'only the ₦10,000 deposit' : 'the full ₦' + totalCartAmount.toLocaleString()} today for ${recipientName || 'your friend'}.`
                          : `You are paying ${paymentType === 'commitment' ? '₦10,000 now' : 'the full amount'} for your personal order.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Door Payment Responsibility */}
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Who pays at the door?</p>
                      <p className={`text-xs font-black leading-relaxed ${paymentType === 'commitment' ? 'text-orange-600' : 'text-emerald-600'}`}>
                        {paymentType === 'full' 
                          ? "Nothing! The order is fully paid. Just receive and enjoy." 
                          : isGift 
                            ? `${recipientName || 'The recipient'} MUST have ₦${(totalCartAmount - 10000).toLocaleString()} ready on arrival.`
                            : `You will pay the ₦${(totalCartAmount - 10000).toLocaleString()} balance when the rider arrives.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleInitiatePaystackPayment}
              disabled={isProcessingOrder || cartItems?.items?.length === 0}
              className="w-full h-12 mt-8 text-sm font-black uppercase tracking-widest rounded-xl shadow-[0_10px_20px_-5px_rgba(30,58,138,0.2)] bg-primary hover:bg-primary/90 border-none transition-all hover:scale-[1.02] text-white"
            >
              {isProcessingOrder ? "INITIALIZING SECURE LINK..." : paymentType === "commitment" ? "PAY DEPOSIT (₦10,000)" : "PROCESS FULL PAYMENT"}
            </Button>
            
            <p className="text-center text-[9px] font-bold text-slate-400 mt-6 px-4 leading-relaxed uppercase tracking-widest opacity-60">
              End-to-End Encryption • Secure Paystack Gateway • Afkit Protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
