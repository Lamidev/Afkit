import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchLastUsedAddress } from "@/store/shop/address-slice";
import { CreditCard, Truck, Check, AlertCircle, AlertTriangle, Gift, User, ChevronLeft, Loader2, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { productList } = useSelector((state) => state.shopProducts);
  const location = useLocation();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentType, setPaymentType] = useState(location.state?.paymentType || "commitment");
  const [purchaseIntent, setPurchaseIntent] = useState("personal"); // 'personal', 'gift', 'assisted'
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isPodConfirmed, setIsPodConfirmed] = useState(false);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
  const hasMajorGadget = cartItems?.items?.some(item => 
    item.category && ["smartphones", "laptops", "monitors"].includes(item.category)
  );

  // Enforce full payment for orders below 15,000 or if NO major gadgets are present
  useEffect(() => {
    if (totalCartAmount > 0) {
      if ((totalCartAmount < 15000 || !hasMajorGadget) && paymentType === "commitment") {
        setPaymentType("full");
      }
    }
  }, [totalCartAmount, paymentType, hasMajorGadget]);

  const [showAddressList, setShowAddressList] = useState(false);

  // Handle Intent changes: Fetch last used address for the specific intent
  useEffect(() => {
    if (user?.id) {
      const type = purchaseIntent === 'personal' ? 'personal' : 'recipient';
      dispatch(fetchLastUsedAddress({ userId: user.id, type })).then((result) => {
        if (result?.payload?.success && result.payload.data) {
          setCurrentSelectedAddress(result.payload.data);
          setIsAddressConfirmed(true);
          setShowAddressList(false);
        } else {
          setCurrentSelectedAddress(null);
          setIsAddressConfirmed(false);
          setShowAddressList(true);
        }
      });
    }
  }, [purchaseIntent, user?.id, dispatch]);

  // Handle Intent changes and force payment types
  useEffect(() => {
    if (purchaseIntent !== "personal") {
      setPaymentType("full"); // Force full payment for ALL non-personal orders
      setIsPodConfirmed(false);
    } else {
      // For personal, default to commitment if 15k+ and has major gadget
      if (!location.state?.paymentType) {
        if (totalCartAmount >= 15000 && hasMajorGadget) {
          setPaymentType("commitment");
        } else {
          setPaymentType("full");
        }
      }
    }
  }, [purchaseIntent, totalCartAmount, hasMajorGadget, location.state?.paymentType]);


  function handleInitiatePaystackPayment() {
    if (isProcessingOrder) return;
    if (cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    if (!currentSelectedAddress) {
      toast.error("Please select a delivery address to proceed.");
      return;
    }
    


    // Validate Address confirmation
    if (!currentSelectedAddress || !isAddressConfirmed) {
      toast.error("Please confirm your shipping address to proceed.");
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
        condition: cartItem?.condition,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        fullName: currentSelectedAddress?.fullName,
        email: currentSelectedAddress?.email,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        isGift: purchaseIntent !== "personal", // 'Someone else' is treated as a gift flow for emails
        isAssisted: false, // Disabling assisted POD as per brand upgrade
        recipientEmail: purchaseIntent !== "personal" ? currentSelectedAddress?.email : null,
        // Persistence handled by addressType field
        receiptInfo: purchaseIntent !== "personal" ? {
          name: currentSelectedAddress.fullName,
          address: currentSelectedAddress.address,
          phone: currentSelectedAddress.phone,
          email: currentSelectedAddress.email,
        } : null,
        shippingInfo: purchaseIntent !== "personal" ? {
          name: currentSelectedAddress.fullName,
          location: currentSelectedAddress.address,
          phone: currentSelectedAddress.phone,
        } : null,
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
        sessionStorage.setItem("currentOrderId", JSON.stringify(data.payload.orderId));
        window.location.href = data?.payload?.approvalURL;
      } else {
        setIsProcessingOrder(false);
        toast.error(data?.payload?.message || "Failed to initialize payment.");
      }
    });
  }

  // Reset address confirmation when address changes
  useEffect(() => {
    setIsAddressConfirmed(false);
  }, [currentSelectedAddress]);

  return (
    <div className="flex flex-col">
      {/* Step Tracker for Checkout */}
      <div className="bg-white border-b border-slate-100 py-4 sm:py-8 lg:sticky lg:top-[120px] -mx-4 sm:-mx-6 lg:-mx-8 z-30 shadow-sm shadow-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            {/* Step 1: Info (Shipping) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black text-xs sm:text-base">
                1
              </div>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-900">Ship</span>
            </div>

            {/* Step 2: Payment */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black transition-all text-xs sm:text-base ${
                currentSelectedAddress ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white border-2 border-slate-100 text-slate-300"
              }`}>
                2
              </div>
              <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${
                currentSelectedAddress ? "text-slate-900" : "text-slate-300"
              }`}>Pay</span>
            </div>

            {/* Step 3: Success */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-slate-100 text-slate-300 flex items-center justify-center font-black text-xs sm:text-base">
                3
              </div>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300">Done</span>
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
          {/* Purchase Intent / Order Purpose */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-6">
              <h2 className="text-sm sm:text-lg font-black flex items-center gap-3 text-slate-800 uppercase tracking-tight">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Gift className="w-5 h-5 text-orange-500" />
                </div>
                Who is this for?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => { setPurchaseIntent("personal"); setIsPodConfirmed(false); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center relative ${
                  purchaseIntent === "personal" ? "border-orange-500 bg-orange-50/50" : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <User className={`w-6 h-6 ${purchaseIntent === "personal" ? "text-orange-500" : "text-slate-400"}`} />
                <p className="font-black text-[10px] text-slate-900 uppercase tracking-widest leading-none">Myself</p>
                {purchaseIntent === "personal" && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div
                onClick={() => { setPurchaseIntent("gift"); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center relative ${
                  purchaseIntent !== "personal" ? "border-orange-500 bg-orange-50/50" : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <Truck className={`w-6 h-6 ${purchaseIntent !== "personal" ? "text-orange-500" : "text-slate-400"}`} />
                <p className="font-black text-[10px] text-slate-900 uppercase tracking-widest leading-none">Someone Else</p>
                {purchaseIntent !== "personal" && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>


          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-3 text-slate-900 uppercase">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Truck className="w-5 h-5 text-orange-500" />
                </div>
                {purchaseIntent === "personal" ? "1. Delivery Location" : "1. Recipient Details"}
              </h2>
            </div>
            
            <div className="space-y-4">
              {currentSelectedAddress && 
               currentSelectedAddress.addressType === (purchaseIntent === 'personal' ? 'personal' : 'recipient') && 
               !showAddressList ? (
                <div className="p-5 rounded-2xl border-2 border-orange-500 bg-orange-50/30 relative animate-in fade-in zoom-in duration-300">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Active {purchaseIntent === 'personal' ? 'Personal' : 'Recipient'} Info</span>
                  </div>
                  
                  <p className="text-sm font-black text-slate-900 uppercase mb-1">{currentSelectedAddress.fullName}</p>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase max-w-[80%]">
                    {currentSelectedAddress.address}, {currentSelectedAddress.city}
                  </p>
                  <p className="text-[11px] font-black text-slate-900 mt-3 flex items-center gap-2">
                     <span className="text-orange-500">📞</span> {currentSelectedAddress.phone}
                  </p>

                  <button 
                    onClick={() => setIsAddressConfirmed(!isAddressConfirmed)}
                    className={`mt-4 w-full h-11 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest ${
                      isAddressConfirmed 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-200 text-slate-400 hover:border-orange-500 hover:text-orange-600"
                    }`}
                  >
                    {isAddressConfirmed ? <Check className="w-4 h-4" /> : null}
                    {isAddressConfirmed ? "Information Confirmed" : "Confirm This Information"}
                  </button>

                  <button 
                    onClick={() => setShowAddressList(true)}
                    className="mt-3 w-full text-[10px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-[0.2em] transition-colors"
                  >
                    Change {purchaseIntent === 'personal' ? 'Address' : 'Recipient'} →
                  </button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-top duration-500">
                  <Address
                    selectedId={currentSelectedAddress}
                    filterType={purchaseIntent === 'personal' ? 'personal' : 'recipient'}
                    setCurrentSelectedAddress={(addr) => {
                      setCurrentSelectedAddress(addr);
                      setIsAddressConfirmed(false); // Force manual confirmation on selection
                      setShowAddressList(false);
                    }}
                  />
                  {currentSelectedAddress && (
                    <button 
                      onClick={() => setShowAddressList(false)}
                      className="mt-4 w-full text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-center"
                    >
                      ← Back to Selected Address
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-3 text-slate-900 uppercase">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              2. Payment Method
            </h2>

            {/* Restricted POD Message (for accessories) */}
            {!hasMajorGadget && cartItems?.items?.length > 0 && purchaseIntent !== "gift" && (
              <div className="mb-4 bg-amber-50 border-2 border-amber-200 p-4 rounded-xl flex gap-4 items-start shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Accessory Cart Detected</p>
                  <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
                    Pay on Delivery is for <span className="underline font-black text-amber-950">Major Gadgets</span> ONLY. 
                    Full Payment is required for this order.
                  </p>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 ${(!location.state?.paymentType && totalCartAmount >= 15000 && hasMajorGadget && purchaseIntent !== "gift") ? 'sm:grid-cols-2' : ''} gap-4`}>
              {/* Gift Payment Notice */}
              {purchaseIntent === "gift" && (
                <div className="col-span-full bg-orange-500/10 border-2 border-orange-500/20 p-4 rounded-xl flex items-center gap-4 mb-2 animate-in fade-in slide-in-from-top-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-orange-900 uppercase">Surprise Order Locked</p>
                    <p className="text-[10px] font-bold text-orange-700/80 uppercase">Full Upfront Payment is required for this category.</p>
                  </div>
                </div>
              )}

              {/* POD OPTION: Hidden if Surprise Gift OR cart restricts it */}
              {purchaseIntent !== "gift" && 
               totalCartAmount >= 15000 && 
               hasMajorGadget && (
                <div
                  onClick={() => setPaymentType("commitment")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    paymentType === "commitment" ? "border-orange-500 bg-orange-100/50 ring-4 ring-orange-500/5" : "border-slate-100 bg-white hover:border-orange-500/30"
                  }`}
                >
                  <div className="font-black text-slate-900 uppercase tracking-tight text-xs">Payment on Delivery</div>
                  <div className="space-y-2 mt-2">
                    <p className="text-[10px] font-black text-slate-700">Pay 10k deposit now, balance on arrival.</p>
                    <p className="text-[10px] font-bold text-slate-400 italic">Recipient/You will pay the balance at the door.</p>
                  </div>
                  {paymentType === "commitment" && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-orange-500 rounded-full">
                       <Check className="w-2.5 h-2.5 text-white" />
                       <span className="text-[8px] font-black text-white uppercase">Selected</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* FULL PAYMENT OPTION */}
              {(
                <div
                  onClick={() => setPaymentType("full")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    paymentType === "full" ? "border-orange-500 bg-orange-100/50 ring-4 ring-orange-500/5" : "border-slate-100 bg-white hover:border-orange-500/30"
                  }`}
                >
                  <div className="font-black text-slate-900 uppercase tracking-tight text-xs">Full Upfront Payment</div>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">Complete payment now for the fastest delivery.</p>
                  {paymentType === "full" && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20">
                       <Check className="w-2.5 h-2.5 text-white" />
                       <span className="text-[9px] font-black text-white uppercase tracking-wider">Selected</span>
                    </div>
                  )}
                </div>
              )}
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
                   <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Order Details</h3>
                </div>

                <div className="space-y-3">
                  {/* Purchase Intent Label */}
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <Gift className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Order Purpose</p>
                      <p className={`text-xs font-black ${purchaseIntent === 'gift' ? 'text-purple-600' : purchaseIntent === 'assisted' ? 'text-blue-600' : 'text-slate-900'}`}>
                        {purchaseIntent === "gift" ? "🎁 SURPRISE GIFT" : purchaseIntent === "assisted" ? "🤝 ASSISTED PURCHASE" : "📦 PERSONAL ORDER"}
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
                      <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase">
                        {purchaseIntent === "gift" 
                          ? `Paying full ₦${totalCartAmount.toLocaleString()} for ${currentSelectedAddress?.fullName || 'a friend'}.`
                          : paymentType === 'commitment'
                            ? `Paying ₦10,000 DEPOSIT for ${currentSelectedAddress?.fullName || 'your'} order.`
                            : `Paying FULL ₦${totalCartAmount.toLocaleString()} for ${currentSelectedAddress?.fullName || 'your'} order.`
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
                          ? purchaseIntent !== "personal"
                            ? `NOTHING! ${currentSelectedAddress?.fullName || 'THE RECIPIENT'} JUST RECEIVES THE GADGET.`
                            : "NOTHING! ORDER IS FULLY PAID." 
                          : purchaseIntent !== "personal" 
                            ? `${currentSelectedAddress?.fullName || 'THE RECIPIENT'} PAYS ₦${(totalCartAmount - 10000).toLocaleString()} AT DOOR.`
                            : `YOU PAY ₦${(totalCartAmount - 10000).toLocaleString()} AT DOOR.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleInitiatePaystackPayment}
              disabled={
                isProcessingOrder || 
                cartItems?.items?.length === 0 || 
                !currentSelectedAddress || 
                !isAddressConfirmed
              }
              className={`w-full h-12 mt-8 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg transition-all border-none text-white ${
                isProcessingOrder ? "bg-slate-400 cursor-not-allowed scale-[0.98]" : "bg-primary hover:bg-primary/90 hover:scale-[1.02]"
              }`}
            >
              {isProcessingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Locking Gadgets...
                </>
              ) : (
                paymentType === "commitment" ? `PAY DEPOSIT (₦10,000)` : "PROCESS FULL PAYMENT"
              )}
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
