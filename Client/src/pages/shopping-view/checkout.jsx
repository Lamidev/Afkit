import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchLastUsedAddress } from "@/store/shop/address-slice";
import { CreditCard, Truck, Check, AlertCircle, Gift, User, ChevronLeft, Loader2, MapPin, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRouteFromRegion, REGION_MAPPING, getDeliveryDays, getDeliveryPolicy } from "@/utils/common";


function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // --- Core State ---
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentType, setPaymentType] = useState(location.state?.paymentType || "full");
  const [purchaseIntent, setPurchaseIntent] = useState("personal");
  const [isPodConfirmed, setIsPodConfirmed] = useState(false);
  const [receiptOwner, setReceiptOwner] = useState("me"); // "me", "recipient", "other"
  const [customReceiptName, setCustomReceiptName] = useState("");
  const [customReceiptEmail, setCustomReceiptEmail] = useState("");

  // --- Address UI State ---
  // true = show summary card, false = show address list/form
  const [showAddressSummary, setShowAddressSummary] = useState(false);
  // true = user has explicitly confirmed the address in the summary card
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  // Separate doorstep confirmation for non-lagos doorstep delivery
  const [isDoorstepConfirmed, setIsDoorstepConfirmed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Derived Values ---
  const totalCartAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : 0;

  const hasMajorGadget = cartItems?.items?.some(
    (item) => item.category && ["smartphones", "laptops", "monitors"].includes(item.category)
  );

  const canUsePOD = purchaseIntent === "personal" && totalCartAmount >= 15000 && hasMajorGadget;

  // --- Effects ---

  // Enforce correct payment type based on cart & intent
  useEffect(() => {
    // 1. Force "Full Payment" if POD is not eligible (intent change, cart amount, etc.)
    if (!canUsePOD && paymentType === "commitment") {
      setPaymentType("full");
      setIsPodConfirmed(false);
    }
    
    // 2. Default to POD if no choice was made in cart and user is eligible
    if (!location.state?.paymentType && canUsePOD && paymentType === "full" && cartItems?.items?.length > 0) {
      setPaymentType("commitment");
    }
  }, [canUsePOD, paymentType, location.state?.paymentType, cartItems?.items?.length]);


  // When intent changes, fetch the last-used address for that intent
  useEffect(() => {
    if (!user?.id) return;

    const type = purchaseIntent === "personal" ? "personal" : "recipient";

    // Reset state when intent changes
    setCurrentSelectedAddress(null);
    setIsAddressConfirmed(false);
    setIsDoorstepConfirmed(false);
    setShowAddressSummary(false);

    dispatch(fetchLastUsedAddress({ userId: user.id, type })).then((result) => {
      if (result?.payload?.success && result.payload.data) {
        // Returning user: auto-recall and show summary (pending confirmation)
        setCurrentSelectedAddress(result.payload.data);
        setShowAddressSummary(true);
        setIsAddressConfirmed(false); // Still requires manual confirm
      } else {
        // First-time: show address form
        setShowAddressSummary(false);
      }
    });
  }, [purchaseIntent, user?.id, dispatch]);

  // --- Handlers ---

  function handleAddressSelected(addr) {
    setCurrentSelectedAddress(addr);
    setIsAddressConfirmed(false);
    setIsDoorstepConfirmed(false); // must re-agree for each address selection
    setShowAddressSummary(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleInitiatePaystackPayment() {
    if (isProcessingOrder) return;
    if (!cartItems?.items?.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!currentSelectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (!isAddressConfirmed) {
      toast.error("Please confirm your delivery information before paying.");
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
        region: currentSelectedAddress?.region,
        logisticsRoute: currentSelectedAddress?.logisticsRoute || getRouteFromRegion(currentSelectedAddress?.region),
        phone: currentSelectedAddress?.phone,
        backupPhone: currentSelectedAddress?.backupPhone,
        notes: currentSelectedAddress?.notes,
        isGift: purchaseIntent !== "personal",
        isAssisted: false,
        recipientEmail: purchaseIntent !== "personal" ? currentSelectedAddress?.email : null,
        deliveryPreference: currentSelectedAddress?.deliveryPreference || "hub",
        // Admin View Sync logic
        receiptInfo: {
          name: receiptOwner === 'me' ? (user?.userName || "Registered User") : currentSelectedAddress?.fullName,
          email: receiptOwner === 'me' ? user?.email : (currentSelectedAddress?.email || ""),
          phone: receiptOwner === 'me' ? (user?.phone || "") : (currentSelectedAddress?.phone || ""),
          address: receiptOwner === 'me' ? "" : (currentSelectedAddress?.address || ""),
          ownerType: receiptOwner
        },
        shippingInfo: {
          name: currentSelectedAddress?.fullName,
          phone: currentSelectedAddress?.phone,
          backupPhone: currentSelectedAddress?.backupPhone,
          location: currentSelectedAddress?.address,
        },
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
        toast.error(data?.payload?.message || "Failed to initialize payment. Please try again.");
      }
    });
  }

  const needsDoorstepConfirm =
    currentSelectedAddress?.deliveryPreference === 'doorstep' &&
    currentSelectedAddress?.region !== 'Lagos' &&
    !isDoorstepConfirmed;

  const isPayButtonDisabled =
    isProcessingOrder ||
    !cartItems?.items?.length ||
    !currentSelectedAddress ||
    !isAddressConfirmed ||
    needsDoorstepConfirm;

  // --- Render ---
  return (
    <div className="flex flex-col">
      {/* ── Step Tracker ── */}
      <div className="bg-white border-b border-slate-100 py-3 sm:py-5 lg:sticky lg:top-[120px] -mx-4 sm:-mx-6 lg:-mx-8 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-xs sm:max-w-sm mx-auto relative px-2">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            {[
              { label: "Ship", active: true },
              { label: "Pay", active: !!currentSelectedAddress && isAddressConfirmed },
              { label: "Done", active: false },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-sm transition-all ${
                    step.active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                      : "bg-white border-2 border-slate-200 text-slate-300"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-widest ${
                    step.active ? "text-slate-900" : "text-slate-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Back link ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
        <button
          onClick={() => navigate("/shop/listing")}
          className="group flex items-center gap-1.5 text-slate-400 hover:text-orange-600 transition-colors font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 sm:py-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* 1. Who is receiving? (Purchaser vs Someone Else) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border-2 border-slate-100">
            <h2 className="text-sm sm:text-base font-bold flex items-center gap-3 text-slate-800 uppercase tracking-tight mb-5">
              <div className="p-2 bg-blue-600/10 rounded-lg">
                <Gift className="w-4 h-4 text-blue-600" />
              </div>
              Who is this order for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Myself */}
              <button
                onClick={() => { setPurchaseIntent("personal"); setIsPodConfirmed(false); }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 text-left relative focus:outline-none ${
                  purchaseIntent === "personal"
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${purchaseIntent === "personal" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white text-slate-400 border border-slate-100"}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900 uppercase tracking-widest block leading-none">For Myself</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase mt-1.5 block">I am collecting it personally</span>
                </div>
                {purchaseIntent === "personal" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Someone Else */}
              <button
                onClick={() => setPurchaseIntent("gift")}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 text-left relative focus:outline-none ${
                  purchaseIntent !== "personal"
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${purchaseIntent !== "personal" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white text-slate-400 border border-slate-100"}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900 uppercase tracking-widest block leading-none">Someone Else</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase mt-1.5 block">Buying for a friend or family</span>
                </div>
                {purchaseIntent !== "personal" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 2. DELIVERY LOCATION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-slate-100 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-4 text-slate-900 uppercase">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                DELIVERY
              </h2>
              
              {/* Dynamic Delivery Days Badge */}
              {currentSelectedAddress && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 animate-in slide-in-from-right-4 duration-500 ${
                  ["Lagos", "Oyo", "Ogun", "Osun", "Ondo", "Ekiti"].includes(currentSelectedAddress.region)
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  <span className="text-xl">🚚</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Estimated Arrival</span>
                    <span className="text-xs font-black uppercase">
                      {getDeliveryDays(currentSelectedAddress.region)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {showAddressSummary && currentSelectedAddress ? (
              /* ── Summary Card ── */
              <div className={`p-4 sm:p-5 rounded-2xl border-2 relative transition-all ${
                isAddressConfirmed 
                  ? "border-orange-500 bg-orange-50/20 shadow-sm"
                  : "border-slate-200 bg-slate-50/50"
              }`}>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {purchaseIntent === "personal" ? "Selected Address" : "Recipient Info"}
                    </span>
                  </div>
                  {isAddressConfirmed && (
                    <span className="text-[7px] font-black uppercase text-orange-500 tracking-widest bg-orange-50 px-2 py-0.5 rounded">Verified</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                   <p className="text-[9px] font-bold text-slate-800 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
                      📍 {currentSelectedAddress.region} State
                   </p>
                   {currentSelectedAddress.region === 'Lagos' ? (
                     <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        🏠 Free Home Delivery
                     </p>
                   ) : (
                     <p className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        currentSelectedAddress.deliveryPreference === 'doorstep' 
                        ? 'text-orange-600 bg-orange-50 border-orange-100' 
                        : 'text-blue-600 bg-blue-50 border-blue-100'
                     }`}>
                         {currentSelectedAddress.deliveryPreference === 'doorstep' ? '🏠 Home Delivery (Pay Rider)' : 
                          REGION_MAPPING[currentSelectedAddress.region] === 'park' ? '🏢 Free Car Park Pickup' : '✈️ Free Airport Pickup'}
                     </p>
                   )}
                </div>
                <p className="text-sm font-bold text-slate-900 uppercase">{currentSelectedAddress.fullName}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase leading-relaxed">
                  {currentSelectedAddress.address}
                </p>
                <p className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1.5 font-mono whitespace-nowrap">
                  <span>📞</span> <span className="tracking-tighter">{currentSelectedAddress.phone}</span>
                </p>
                 {currentSelectedAddress.email && (
                   <p className="text-[10px] font-semibold text-slate-400 mt-1">
                     ✉️ {currentSelectedAddress.email}
                   </p>
                 )}
                 
                 {currentSelectedAddress.notes && (
                   <div className="mt-3 p-3 bg-slate-900/5 rounded-xl border border-slate-100">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logistics Note:</p>
                     <p className="text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
                       {currentSelectedAddress.notes.replace(/<[^>]*>?/gm, "")}
                     </p>
                   </div>
                 )}

                 {currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' && (
                    <div className="mt-4 p-4 bg-orange-50/50 border border-orange-200 rounded-xl animate-in zoom-in-95 duration-500">
                      <div className="flex items-start gap-3">
                        <div 
                          onClick={() => setIsDoorstepConfirmed(!isDoorstepConfirmed)}
                          className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                            isDoorstepConfirmed ? 'bg-orange-500 border-orange-600' : 'bg-white border-slate-300'
                          }`}
                        >
                          {isDoorstepConfirmed && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => setIsDoorstepConfirmed(!isDoorstepConfirmed)}>
                           <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-normal">
                             I agree to pay the local rider for my doorstep delivery (from the station to my house).
                           </p>
                           <p className="text-[9px] font-medium text-slate-500 uppercase mt-1">
                             I understand this is separate from my product payment.
                           </p>
                        </div>
                      </div>
                    </div>
                 )}

                {/* Confirm button */}
                {!isAddressConfirmed && (
                  <button
                    onClick={() => setIsAddressConfirmed(true)}
                    disabled={currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' && !isDoorstepConfirmed}
                    className={`mt-6 w-full h-11 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-widest ${
                      (currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' && !isDoorstepConfirmed)
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800 shadow-xl hover:shadow-blue-500/25 transform active:scale-95"
                    }`}
                  >
                    Use this address
                  </button>
                )}
                {/* Change link */}
                <button
                  onClick={() => {
                    setShowAddressSummary(false);
                    setIsAddressConfirmed(false);
                  }}
                  className="mt-3 w-full text-[10px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest transition-colors text-center"
                >
                  Change {purchaseIntent === "personal" ? "Address" : "Recipient"} →
                </button>
              </div>
            ) : (
              /* ── Address List / Form ── */
              <div>
                 <Address
                   selectedId={currentSelectedAddress}
                   filterType={purchaseIntent === "personal" ? "personal" : "recipient"}
                   setCurrentSelectedAddress={handleAddressSelected}
                   hideHeader={true}
                   isCheckoutPage={true}
                 />
              </div>
            )}

            {/* ── Contextual Delivery Info & Service Standards ── */}
            {currentSelectedAddress && isAddressConfirmed && (
               <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className={`p-6 rounded-[2rem] border-2 shadow-sm ${
                    currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl ${
                        currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' ? 'bg-orange-500/10' : 'bg-blue-600/10'
                      }`}>
                         <Truck className={`w-5 h-5 ${
                           currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' ? 'text-orange-600' : 'text-blue-600'
                         }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${
                          currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          Delivery Conditions
                        </p>
                        <div className="mt-3 space-y-3">
                          <p className="text-[13px] font-bold text-slate-800 leading-snug flex items-center gap-2">
                            <span className="text-xl">🏠</span>
                            {currentSelectedAddress.region === 'Lagos' 
                              ? `Your gadget will be delivered straight to your doorstep for FREE within ${getDeliveryDays(currentSelectedAddress.region)}.`
                              : currentSelectedAddress.deliveryPreference === 'doorstep'
                              ? `Sent to the nearest ${REGION_MAPPING[currentSelectedAddress.region] === 'park' ? 'Car Park/Station' : 'Airport'} first, then a rider brings it to your house. (Rider fee is paid on arrival)` 
                              : `Sent to the nearest ${REGION_MAPPING[currentSelectedAddress.region] === 'park' ? 'Car Park' : 'Airport'} for FREE. You'll go there to pick it up in ${getDeliveryDays(currentSelectedAddress.region)}.`}
                          </p>
                          
                          <div className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase">
                             <Check className={`w-4 h-4 shrink-0 ${
                               currentSelectedAddress.deliveryPreference === 'doorstep' && currentSelectedAddress.region !== 'Lagos' ? 'text-orange-600' : 'text-blue-600'
                             }`} />
                             6 Months Warranty included on core parts.
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase italic">
                             <Check className="w-4 h-4 text-slate-400 shrink-0" />
                             By paying, you agree to our transparent delivery and return terms.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            )}
          </div>

          {/* 3. RECEIPT OWNERSHIP */}
          {purchaseIntent !== "personal" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-slate-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-4 text-slate-900 uppercase mb-8">
                <div className="p-3 bg-blue-900 rounded-2xl shadow-lg shadow-blue-900/20">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                RECEIPT
              </h2>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Whose name should be on the receipt & warranty?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {/* Me */}
                 <button
                   onClick={() => setReceiptOwner("me")}
                   className={`p-5 rounded-2xl border-2 transition-all text-left relative ${
                     receiptOwner === 'me' ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-white hover:border-slate-200"
                   }`}
                 >
                   <span className="font-black text-xs text-slate-900 uppercase tracking-widest block">Me (My Profile)</span>
                   <span className="text-[10px] font-medium text-slate-500 uppercase mt-1 leading-tight block">Use my account: {user?.userName}</span>
                   {receiptOwner === 'me' && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-orange-600" /></div>}
                 </button>

                 {/* Recipient */}
                 <button
                   disabled={!currentSelectedAddress}
                   onClick={() => setReceiptOwner("recipient")}
                   className={`p-5 rounded-2xl border-2 transition-all text-left relative ${
                     !currentSelectedAddress ? "opacity-50 cursor-not-allowed border-slate-50" :
                     receiptOwner === 'recipient' ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-white hover:border-slate-200"
                   }`}
                 >
                   <span className="font-black text-xs text-slate-900 uppercase tracking-widest block">The Recipient</span>
                   <span className="text-[10px] font-medium text-slate-500 uppercase mt-1 leading-tight block">Name on delivery address</span>
                   {receiptOwner === 'recipient' && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-orange-600" /></div>}
                 </button>
              </div>
            </div>
          )}

          {/* 4. PAYMENT METHOD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-slate-100">
            <h2 className="text-lg sm:text-xl font-black mb-8 flex items-center gap-4 text-slate-900 uppercase">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              PAYMENT
            </h2>

            {/* POD BLUE POLICY BOX */}
            {paymentType === "commitment" && (
              <div className="mb-8 bg-blue-900 rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Truck className="w-24 h-24" />
                </div>
                
                <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                   Payment on Delivery Policy
                </h3>
                
                <div className="space-y-4 relative z-10">
                   {[
                     { text: "Commitment Fee: ₦10,000 required before dispatch (Fully Refundable)." },
                     { text: "Purpose: This secure deposit filters out prank orders and covers logistics costs." },
                     { text: "Balance: Pay the remaining amount only after inspecting the gadget." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-white/40" />
                        <p className="text-xs sm:text-sm font-black leading-relaxed text-slate-100 uppercase tracking-tight">
                          {item.text}
                        </p>
                     </div>
                   ))}
                   
                   <p className="pt-4 text-xs sm:text-sm font-black text-white leading-relaxed italic border-t border-white/10">
                     This ensures fairness, transparency, and a smooth delivery experience for both you and Afkit.
                   </p>

                   <div className="mt-4 bg-orange-600/20 p-4 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-600/10 animate-pulse">
                      <p className="text-[10px] sm:text-xs font-black text-white leading-tight uppercase tracking-widest text-center sm:text-left">
                        🚨 IMPORTANT: DOORSTEP POD is Lagos-only. Outside Lagos, pickup is at the nearest Car Park/Airport.
                      </p>
                   </div>
                </div>
              </div>
            )}

            {/* Accessory notice */}
            {!hasMajorGadget && cartItems?.items?.length > 0 && (
              <div className="mb-6 bg-slate-900 rounded-2xl p-5 flex gap-4 items-start border border-slate-800">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 leading-none">Accessory Notice</p>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    Pay on Delivery is only for Smartphones, Laptops and Monitors. Please use Full Payment for accessories.
                  </p>
                </div>
              </div>
            )}

            <div className={`grid gap-4 ${canUsePOD ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {/* POD Option */}
              {canUsePOD && (
                <button
                  onClick={() => setPaymentType("commitment")}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative text-left focus:outline-none ${
                    paymentType === "commitment"
                      ? "border-orange-500 bg-orange-50/30 ring-8 ring-orange-500/5"
                      : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                  }`}
                >
                  <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Payment on Delivery</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Commitment Fee: ₦10,000</p>
                  {paymentType === "commitment" && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20">
                      <Check className="w-3 h-3 text-white" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Active</span>
                    </div>
                  )}
                </button>
              )}

              {/* Full Payment Option */}
              <button
                onClick={() => setPaymentType("full")}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative text-left focus:outline-none ${
                  paymentType === "full"
                    ? "border-orange-500 bg-orange-50/30 ring-8 ring-orange-500/5"
                    : "border-slate-50 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Full Payment</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Pay once, expect delivery</p>
                {paymentType === "full" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20">
                    <Check className="w-3 h-3 text-white" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Active</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Order Summary ── */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100 lg:sticky lg:top-28">
            <h2 className="text-base sm:text-lg font-bold mb-5 text-slate-900 uppercase tracking-tight">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
              {cartItems?.items?.length > 0 ? (
                cartItems.items.map((item) => (
                  <UserCartItemsContent cartItem={item} key={item.productId} />
                ))
              ) : (
                <p className="text-slate-400 font-bold uppercase text-[10px] text-center py-8">Cart is empty</p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-8 space-y-4 border-t-2 border-slate-100 pt-6">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span>Items Subtotal</span>
                <span className="text-slate-900">₦{totalCartAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-start text-sm font-bold text-blue-600 uppercase tracking-tight gap-4">
                <span className="shrink-0">Delivery Method</span>
                <span className="text-right leading-tight text-xs sm:text-sm">
                   {!currentSelectedAddress ? "Pending Selection" : 
                    currentSelectedAddress.region === 'Lagos' ? "Free Home Delivery" :
                    currentSelectedAddress.deliveryPreference === 'doorstep' ? "Home Delivery (Pay Rider)" : 
                    REGION_MAPPING[currentSelectedAddress.region] === 'park' ? "Free Car Park Pickup" : "Free Airport Pickup"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-5 border-t-2 border-slate-900">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Final Total</span>
                <span className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tighter">
                  ₦{totalCartAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* POD Breakdown */}
            {paymentType === "commitment" && (
              <div className="bg-slate-900 p-4 rounded-xl mt-4 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Deposit Due Now</span>
                  <span className="text-xl font-bold text-white">₦10,000</span>
                </div>
                <div className="flex justify-between text-[10px] text-white/40 mt-2 font-semibold uppercase tracking-widest border-t border-white/10 pt-2">
                  <span>Balance on Arrival</span>
                  <span className="text-amber-400">₦{(totalCartAmount - 10000).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Responsibility Summary */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
                Order Details
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <Gift className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Order Purpose</p>
                  <p className={`text-[11px] font-bold ${purchaseIntent !== "personal" ? "text-purple-600" : "text-slate-900"}`}>
                    {purchaseIntent !== "personal" ? "🎁 GIFT / SOMEONE ELSE" : "📦 PERSONAL ORDER"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">You Pay Now</p>
                  <p className="text-[11px] font-bold text-slate-900 uppercase leading-relaxed">
                    {paymentType === "commitment"
                      ? `₦10,000 DEPOSIT`
                      : `FULL ₦${totalCartAmount.toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Payment at Door</p>
                  <p className={`text-[11px] font-bold leading-relaxed ${paymentType === "full" && currentSelectedAddress?.deliveryPreference !== 'doorstep' ? "text-emerald-600" : "text-orange-600"}`}>
                    {paymentType === "full"
                      ? currentSelectedAddress?.deliveryPreference === 'doorstep' && currentSelectedAddress?.region !== 'Lagos'
                        ? "PAY RIDER FOR DELIVERY"
                        : "NOTHING — PAID IN FULL"
                      : `₦${(totalCartAmount - 10000).toLocaleString()}${currentSelectedAddress?.deliveryPreference === 'doorstep' && currentSelectedAddress?.region !== 'Lagos' ? " + FEE TO RIDER" : ""}`}
                  </p>
                  <p className="text-[8px] font-medium text-slate-400 uppercase mt-0.5">Payable when items arrive</p>
                </div>
              </div>

              {/* Recipient box (only for gift orders) */}
              {purchaseIntent !== "personal" && currentSelectedAddress && (
                <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                    <User className="w-3 h-3 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Recipient Name</p>
                    <p className="text-[11px] font-bold text-purple-700 uppercase">
                      {currentSelectedAddress.fullName}
                    </p>
                  </div>
                </div>
              )}

              {/* Doorstep Confirmation Badge for Summary */}
              {currentSelectedAddress?.deliveryPreference === 'doorstep' && currentSelectedAddress?.region !== 'Lagos' && (
                <div className="pt-2 border-t border-slate-100">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50/50 border border-orange-200/60 rounded-lg animate-in zoom-in-95 duration-500">
                      <Truck className="w-3 h-3 text-orange-600" />
                      <span className="text-[9px] font-bold text-orange-700 uppercase tracking-tight">🏠 Doorstep Delivery Confirmed</span>
                   </div>
                   <p className="text-[8px] font-medium text-slate-400 uppercase mt-1 px-1">
                      Local rider fee to be paid on arrival.
                   </p>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <div className="sticky bottom-0 bg-white pt-2 pb-4 sm:static sm:bg-transparent sm:p-0">
              <Button
                onClick={handleInitiatePaystackPayment}
                disabled={isPayButtonDisabled}
                className={`w-full h-14 sm:h-12 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all border-none text-white ${
                  isPayButtonDisabled
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:scale-[1.02]"
                }`}
              >
                {isProcessingOrder ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : !currentSelectedAddress ? (
                  "Select Delivery Address"
                ) : !isAddressConfirmed ? (
                  "Confirm Address to Continue"
                ) : (
                  <span className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    {paymentType === "commitment" ? "PAY DEPOSIT (₦10,000)" : `PAY ₦${totalCartAmount.toLocaleString()}`}
                  </span>
                )}
              </Button>
            </div>

            {!isAddressConfirmed && currentSelectedAddress && (
              <p className="text-center text-[9px] font-bold text-orange-500 mt-3 uppercase tracking-widest animate-pulse">
                ↑ Confirm your address above to unlock payment
              </p>
            )}

            <p className="text-center text-[9px] font-bold text-slate-300 mt-3 px-4 leading-relaxed uppercase tracking-widest">
              Secured by Paystack • End-to-End Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
