import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchLastUsedAddress } from "@/store/shop/address-slice";
import { CreditCard, Truck, Check, AlertCircle, Gift, User, ChevronLeft, Loader2, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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

  // --- Address UI State ---
  // true = show summary card, false = show address list/form
  const [showAddressSummary, setShowAddressSummary] = useState(false);
  // true = user has explicitly confirmed the address in the summary card
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

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
    if (purchaseIntent !== "personal") {
      setPaymentType("full");
      setIsPodConfirmed(false);
    } else if (!location.state?.paymentType) {
      if (canUsePOD) {
        setPaymentType("commitment");
      } else {
        setPaymentType("full");
      }
    }
  }, [purchaseIntent, canUsePOD, location.state?.paymentType]);

  // When intent changes, fetch the last-used address for that intent
  useEffect(() => {
    if (!user?.id) return;

    const type = purchaseIntent === "personal" ? "personal" : "recipient";

    // Reset state when intent changes
    setCurrentSelectedAddress(null);
    setIsAddressConfirmed(false);
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
    setIsAddressConfirmed(false); // Always force manual confirm after a selection
    setShowAddressSummary(true);  // Collapse to summary view
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
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        isGift: purchaseIntent !== "personal",
        isAssisted: false,
        recipientEmail: purchaseIntent !== "personal" ? currentSelectedAddress?.email : null,
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

  const isPayButtonDisabled =
    isProcessingOrder ||
    !cartItems?.items?.length ||
    !currentSelectedAddress ||
    !isAddressConfirmed;

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
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-[10px] sm:text-sm transition-all ${
                    step.active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                      : "bg-white border-2 border-slate-200 text-slate-300"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${
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
          className="group flex items-center gap-1.5 text-slate-400 hover:text-orange-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* 1. Purchase Intent */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm sm:text-base font-black flex items-center gap-3 text-slate-800 uppercase tracking-tight mb-5">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Gift className="w-4 h-4 text-orange-500" />
              </div>
              Who is this for?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Myself */}
              <button
                onClick={() => { setPurchaseIntent("personal"); setIsPodConfirmed(false); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center relative focus:outline-none ${
                  purchaseIntent === "personal"
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-slate-100 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <User className={`w-6 h-6 ${purchaseIntent === "personal" ? "text-orange-500" : "text-slate-400"}`} />
                <span className="font-black text-[10px] text-slate-900 uppercase tracking-widest leading-none">Myself</span>
                {purchaseIntent === "personal" && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Someone Else */}
              <button
                onClick={() => setPurchaseIntent("gift")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 text-center relative focus:outline-none ${
                  purchaseIntent !== "personal"
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-slate-100 bg-slate-50/50 hover:border-orange-200"
                }`}
              >
                <Truck className={`w-6 h-6 ${purchaseIntent !== "personal" ? "text-orange-500" : "text-slate-400"}`} />
                <span className="font-black text-[10px] text-slate-900 uppercase tracking-widest leading-none">Someone Else</span>
                {purchaseIntent !== "personal" && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 2. Delivery / Recipient Address */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm sm:text-base font-black flex items-center gap-3 text-slate-900 uppercase mb-5">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Truck className="w-4 h-4 text-orange-500" />
              </div>
              {purchaseIntent === "personal" ? "1. Delivery Location" : "1. Recipient Details"}
            </h2>

            {showAddressSummary && currentSelectedAddress ? (
              /* ── Summary Card ── */
              <div className="p-5 rounded-2xl border-2 border-orange-400 bg-orange-50/20 relative">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    {purchaseIntent === "personal" ? "Delivery Address" : "Recipient Info"}
                  </span>
                  {isAddressConfirmed && (
                    <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                      <span className="text-[8px] font-black text-emerald-600 uppercase">Confirmed</span>
                    </div>
                  )}
                </div>

                <p className="text-sm font-black text-slate-900 uppercase">{currentSelectedAddress.fullName}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase leading-relaxed">
                  {currentSelectedAddress.address}, {currentSelectedAddress.city}
                </p>
                <p className="text-xs font-black text-slate-700 mt-2 flex items-center gap-1.5 font-mono whitespace-nowrap">
                  <span>📞</span> {currentSelectedAddress.phone}
                </p>
                {currentSelectedAddress.email && (
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">
                    ✉️ {currentSelectedAddress.email}
                  </p>
                )}

                {/* Confirm button */}
                <button
                  onClick={() => setIsAddressConfirmed((prev) => !prev)}
                  className={`mt-4 w-full h-11 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest ${
                    isAddressConfirmed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  {isAddressConfirmed ? <Check className="w-4 h-4" /> : null}
                  {isAddressConfirmed ? "✓ Information Confirmed" : "Tap to Confirm This Info"}
                </button>

                {/* Change link */}
                <button
                  onClick={() => {
                    setShowAddressSummary(false);
                    setIsAddressConfirmed(false);
                  }}
                  className="mt-3 w-full text-[10px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-widest transition-colors text-center"
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
                />
                {currentSelectedAddress && (
                  <button
                    onClick={() => setShowAddressSummary(true)}
                    className="mt-3 w-full text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest text-center"
                  >
                    ← Back to Summary
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm sm:text-base font-black mb-5 flex items-center gap-3 text-slate-900 uppercase">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="w-4 h-4 text-orange-500" />
              </div>
              2. Payment Method
            </h2>

            {/* Accessory notice */}
            {!hasMajorGadget && cartItems?.items?.length > 0 && (
              <div className="mb-4 bg-amber-50 border-2 border-amber-200 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase">Accessory Cart</p>
                  <p className="text-[10px] font-bold text-amber-800 mt-0.5 uppercase leading-relaxed">
                    Pay on Delivery is only available for Major Gadgets. Full payment required.
                  </p>
                </div>
              </div>
            )}

            {/* Gift locked notice */}
            {purchaseIntent !== "personal" && (
              <div className="mb-4 bg-orange-50 border-2 border-orange-200 p-4 rounded-xl flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-orange-900 uppercase">Full Payment Required</p>
                  <p className="text-[10px] font-bold text-orange-700/80 uppercase mt-0.5">Recipient orders require full upfront payment.</p>
                </div>
              </div>
            )}

            <div className={`grid gap-3 ${canUsePOD ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {/* POD Option */}
              {canUsePOD && (
                <button
                  onClick={() => setPaymentType("commitment")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative text-left focus:outline-none ${
                    paymentType === "commitment"
                      ? "border-orange-500 bg-orange-100/50 ring-4 ring-orange-500/5"
                      : "border-slate-100 bg-white hover:border-orange-300"
                  }`}
                >
                  <p className="font-black text-slate-900 uppercase text-xs">Payment on Delivery</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1.5">Pay ₦10k deposit now, balance on arrival.</p>
                  {paymentType === "commitment" && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-orange-500 rounded-full">
                      <Check className="w-2.5 h-2.5 text-white" />
                      <span className="text-[8px] font-black text-white uppercase">Selected</span>
                    </div>
                  )}
                </button>
              )}

              {/* Full Payment Option */}
              <button
                onClick={() => setPaymentType("full")}
                disabled={purchaseIntent !== "personal" || !canUsePOD ? false : false}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative text-left focus:outline-none ${
                  paymentType === "full"
                    ? "border-orange-500 bg-orange-100/50 ring-4 ring-orange-500/5"
                    : "border-slate-100 bg-white hover:border-orange-300"
                }`}
              >
                <p className="font-black text-slate-900 uppercase text-xs">Full Upfront Payment</p>
                <p className="text-[10px] font-bold text-slate-500 mt-1.5">Complete payment now for fastest delivery.</p>
                {paymentType === "full" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-orange-500 rounded-full">
                    <Check className="w-2.5 h-2.5 text-white" />
                    <span className="text-[8px] font-black text-white uppercase">Selected</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Order Summary ── */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100 lg:sticky lg:top-28">
            <h2 className="text-base sm:text-lg font-black mb-5 text-slate-900 uppercase tracking-tight">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
              {cartItems?.items?.length > 0 ? (
                cartItems.items.map((item) => (
                  <UserCartItemsContent cartItem={item} key={item.productId} />
                ))
              ) : (
                <p className="text-slate-400 font-black uppercase text-[10px] text-center py-8">Cart is empty</p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Items</span>
                <span className="text-slate-900">₦{totalCartAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-500 uppercase tracking-widest">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">
                  ₦{totalCartAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* POD Breakdown */}
            {paymentType === "commitment" && (
              <div className="bg-slate-900 p-4 rounded-xl mt-4 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Deposit Due Now</span>
                  <span className="text-xl font-black text-white">₦10,000</span>
                </div>
                <div className="flex justify-between text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest border-t border-white/10 pt-2">
                  <span>Balance on Arrival</span>
                  <span className="text-amber-400">₦{(totalCartAmount - 10000).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Responsibility Summary */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
                Order Details
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <Gift className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Order Purpose</p>
                  <p className={`text-[11px] font-black ${purchaseIntent !== "personal" ? "text-purple-600" : "text-slate-900"}`}>
                    {purchaseIntent !== "personal" ? "🎁 GIFT / SOMEONE ELSE" : "📦 PERSONAL ORDER"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">You Pay Now</p>
                  <p className="text-[11px] font-black text-slate-900 uppercase leading-relaxed">
                    {paymentType === "commitment"
                      ? `₦10,000 DEPOSIT`
                      : `FULL ₦${totalCartAmount.toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <User className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">At Door</p>
                  <p className={`text-[11px] font-black leading-relaxed ${paymentType === "full" ? "text-emerald-600" : "text-orange-600"}`}>
                    {paymentType === "full"
                      ? "NOTHING — FULLY PAID ✓"
                      : `₦${(totalCartAmount - 10000).toLocaleString()} TO BE PAID`}
                  </p>
                </div>
              </div>

              {/* Recipient box (only for gift orders) */}
              {purchaseIntent !== "personal" && currentSelectedAddress && (
                <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                    <MapPin className="w-3 h-3 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Recipient</p>
                    <p className="text-[11px] font-black text-purple-700 uppercase">
                      {currentSelectedAddress.fullName}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5">
                      {currentSelectedAddress.address}, {currentSelectedAddress.city}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <Button
              onClick={handleInitiatePaystackPayment}
              disabled={isPayButtonDisabled}
              className={`w-full h-12 mt-5 text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl shadow-lg transition-all border-none text-white ${
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
              ) : paymentType === "commitment" ? (
                "PAY DEPOSIT (₦10,000)"
              ) : (
                `PAY ₦${totalCartAmount.toLocaleString()}`
              )}
            </Button>

            {!isAddressConfirmed && currentSelectedAddress && (
              <p className="text-center text-[9px] font-black text-orange-500 mt-3 uppercase tracking-widest animate-pulse">
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
