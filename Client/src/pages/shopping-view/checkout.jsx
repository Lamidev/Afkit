import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/order-slice";
import { CreditCard, Truck } from "lucide-react";
import { useLocation } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const location = useLocation();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentType, setPaymentType] = useState(location.state?.paymentType || "commitment"); // Default to commitment fee unless specified
  const dispatch = useDispatch();

  const totalCartAmount =
  cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce(
        (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
        0
      )
    : 0;

  // Enforce full payment for orders below 15,000
  useEffect(() => {
    if (totalCartAmount > 0 && totalCartAmount < 15000 && paymentType === "commitment") {
      setPaymentType("full");
    }
  }, [totalCartAmount, paymentType]);

  function handleInitiatePaystackPayment() {
    if (cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select a shipping address to proceed.");
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="relative h-[250px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1600"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              Shipping Intelligence
            </h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              Settlement Protocol
            </h2>
            <div className={`grid grid-cols-1 ${totalCartAmount >= 15000 ? 'sm:grid-cols-2' : ''} gap-4`}>
              {totalCartAmount >= 15000 && (
                <div
                  onClick={() => setPaymentType("commitment")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    paymentType === "commitment"
                      ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                      : "border-slate-100 hover:border-primary/30"
                  }`}
                >
                  <div className="font-black text-slate-900">Pay on Delivery</div>
                  <p className="text-[11px] font-bold text-slate-500 mt-1 leading-relaxed">
                    Pay ₦10,000 security deposit, balance on arrival.
                  </p>
                  {paymentType === "commitment" && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                       <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              )}
              <div
                onClick={() => setPaymentType("full")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                  paymentType === "full"
                    ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                    : "border-slate-100 hover:border-primary/30"
                }`}
              >
                <div className="font-black text-slate-900">Full Upfront</div>
                <p className="text-[11px] font-bold text-slate-500 mt-1 leading-relaxed">
                  Clear the entire balance now for priority processing.
                </p>
                 {paymentType === "full" && (
                   <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-100 lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-black mb-6 text-slate-900 uppercase tracking-tight">Order Architecture</h2>
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
                <span>Gross Value</span>
                <span className="text-slate-900">₦{totalCartAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-500 uppercase tracking-widest leading-none">
                <span>Logistics Fee</span>
                <span>FREE</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Net Payable</span>
                  <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">₦{totalCartAmount.toLocaleString()}</span>
                </div>
              </div>

              {paymentType === "commitment" && (
                <div className="bg-slate-900 p-4 rounded-xl mt-6 border border-slate-800 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Immediate Deposit</span>
                    <span className="text-xl font-black text-white">₦10,000</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest border-t border-white/5 pt-2">
                    <span>Balance at Portal</span>
                    <span className="text-amber-500">₦{(totalCartAmount - 10000).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleInitiatePaystackPayment}
              disabled={isProcessingOrder || cartItems?.items?.length === 0}
              className="w-full h-12 mt-8 text-sm font-black uppercase tracking-widest rounded-xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] bg-slate-900 hover:bg-slate-800 transition-all hover:scale-[1.02]"
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
