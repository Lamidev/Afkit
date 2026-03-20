import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { formatAestheticId, REGION_MAPPING } from "@/utils/common";
import { Gift, MapPin, Truck, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { payOrderBalance } from "@/store/shop/order-slice";
import { toast } from "sonner";



function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();

  function handlePayBalance() {
    dispatch(payOrderBalance(orderDetails?._id)).then((data) => {
      if (data?.payload?.success) {
        sessionStorage.setItem("currentOrderId", JSON.stringify(orderDetails?._id));
        sessionStorage.setItem("isBalancePayment", JSON.stringify(true));
        window.location.href = data.payload.approvalURL;
      } else {
        toast.error("Failed to initialize balance payment. Please try again.");
      }
    });
  }

  const handleContactSupport = () => {
    const orderId = formatAestheticId(orderDetails?.orderId || orderDetails?._id, "ORD");
    const products = orderDetails?.cartItems.map(item => `${item.title} (x${item.quantity})`).join(", ");
    const date = orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A";
    const payment = `${orderDetails?.paymentType} Payment (${orderDetails?.paymentStatus || 'Pending'})`;
    const address = `${orderDetails?.addressInfo?.address}, ${orderDetails?.addressInfo?.region}`;
    
    const message = `Hi Afkit Support, I'm having an issue with my order:

📦 *Order ID:* ${orderId}
🛒 *Products:* ${products}
📅 *Purchased On:* ${date}
💳 *Payment:* ${payment.toUpperCase()}
📍 *Sent to:* ${address}

Please check this for me. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "2348164014304";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <DialogContent className="sm:max-w-[600px] w-full max-w-[96%] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row items-center justify-between w-full">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">Order Details</span>
            {orderDetails?.addressInfo?.isGift && (
              <Badge className="bg-orange-500 text-white flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] uppercase font-bold w-fit border-0">
                <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Gift
              </Badge>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 mt-4">
        <div className="flex flex-row items-center justify-between gap-2 overflow-hidden">
          <p className="font-semibold text-slate-500 text-sm whitespace-nowrap">Order ID</p>
          <Label className="text-slate-900 font-mono font-black text-xs sm:text-sm break-all text-right">
            {formatAestheticId(orderDetails?.orderId || orderDetails?._id, "ORD")}
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Order Date</p>
          <Label className="text-slate-900">{orderDetails?.orderDate.split("T")[0]}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Order Status</p>
          <Badge
            className={`px-3 py-1 rounded-full ${
              orderDetails?.orderStatus === "confirmed"
                ? "bg-green-500"
                : orderDetails?.orderStatus === "rejected"
                ? "bg-red-600"
                : "bg-black"
            }`}
          >
            {orderDetails?.orderStatus}
          </Badge>
        </div>
        <div className="flex flex-row items-center justify-between gap-4 overflow-hidden">
          <p className="font-semibold text-slate-500 text-sm whitespace-nowrap">Total Amount</p>
          <Label className="text-lg sm:text-xl font-bold text-slate-900 text-right">
            ₦{orderDetails?.totalAmount.toLocaleString()}
          </Label>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold capitalize text-slate-900 border-b-2 border-slate-200">{orderDetails?.paymentType}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Paid:</span>
              <span className="font-bold text-green-600">₦{orderDetails?.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-bold text-slate-900">Balance:</span>
              <span className="font-black text-red-600 text-base">₦{orderDetails?.balanceAmount.toLocaleString()}</span>
            </div>
            
            {orderDetails?.paymentStatus === 'partially_paid' && orderDetails?.balanceAmount > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button 
                  onClick={handlePayBalance}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black flex items-center justify-center gap-2 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  <CreditCard className="w-5 h-5" />
                  Clear Remaining Balance (₦{orderDetails?.balanceAmount?.toLocaleString()})
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                  Proceed to Paystack for secure balance completion
                </p>
              </div>
            )}
        </div>

        <Separator />
        
        <div className="grid gap-4">
          <div className="font-semibold text-lg">Gadgets Ordered</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li key={item.productId} className="flex flex-col bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight">{item.title}</span>
                      <span className="text-[9px] font-mono font-black text-slate-400">
                        {formatAestheticId(item.productId, "GAD")}
                      </span>
                    </div>
                    {item.condition && (
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-1 ${
                        item.condition === "Brand New"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {item.condition}
                      </span>
                    )}
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-500 font-medium">Qty: {item.quantity}</span>
                      <span className="font-bold text-slate-900 ml-2 text-right">₦{Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </div>
        
        <Separator />

        <div className="grid gap-4">
          <div className="font-semibold text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-400" />
            Delivery & Ownership
          </div>
          <div className="grid gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                <div className="pb-3 border-b sm:border-b-0 sm:border-r border-slate-100 sm:pr-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                     {orderDetails?.addressInfo?.deliveryTarget === 'personal' ? "Destination (Payer)" : "Destination (Recipient)"}
                  </span>
                  <p className="font-bold text-slate-900 uppercase text-xs sm:text-sm truncate">
                     {orderDetails?.addressInfo?.fullName}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                     {orderDetails?.addressInfo?.address}
                  </p>
                </div>
                <div className="pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Warranty Owner</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 uppercase text-xs sm:text-sm truncate">
                       {orderDetails?.addressInfo?.receiptInfo?.name || orderDetails?.addressInfo?.fullName}
                    </p>
                    <Badge className={`px-1.5 py-0 rounded text-[7px] border-0 uppercase font-bold tracking-tighter ${orderDetails?.addressInfo?.receiptInfo?.ownerType === 'me' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
                       {orderDetails?.addressInfo?.receiptInfo?.ownerType === 'me' ? 'Me' : 'Others'}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-bold text-blue-600 truncate mt-1 break-all overflow-hidden">
                     ✉️ {orderDetails?.addressInfo?.receiptInfo?.email || orderDetails?.payerEmail || "Email Pending"}
                  </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">State</span>
                <span className="text-sm font-bold text-slate-900">{orderDetails?.addressInfo?.region || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Method</span>
                {orderDetails?.addressInfo?.deliveryPreference && (
                  <Badge className={`text-[8px] font-bold uppercase tracking-widest w-fit py-0.5 ${orderDetails?.addressInfo?.deliveryPreference === 'doorstep' ? 'bg-orange-600 text-white border-0' : 'bg-blue-600 text-white border-0'}`}>
                    {orderDetails?.addressInfo?.region === 'Lagos' ? '🏠 Free Home Delivery' :
                     orderDetails?.addressInfo?.deliveryPreference === 'doorstep' ? '🏠 Home Delivery (Pay Rider)' :
                     REGION_MAPPING[orderDetails?.addressInfo?.region] === 'park' ? '🏢 Free Car Park Pickup' : '✈️ Free Airport Pickup'}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{orderDetails?.addressInfo?.phone}</span>
              </div>
              {orderDetails?.addressInfo?.backupPhone && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Backup Phone</span>
                  <span className="text-sm font-bold text-orange-600 font-mono">{orderDetails?.addressInfo?.backupPhone}</span>
                </div>
              )}
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Notes</span>
                <span className="italic text-sm text-slate-400">
                  {orderDetails?.addressInfo?.notes.replace(/<\/?[^>]+(>|$)/g, "")}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dashed border-slate-200">
           <div className="flex flex-col items-center text-center">
             <div className="p-3 bg-slate-50 rounded-full mb-3">
               <MessageCircle className="w-6 h-6 text-slate-400" />
             </div>
             <p className="text-sm font-semibold text-slate-900 mb-1">
               Having issues with your purchase?
             </p>
             <p className="text-xs text-slate-500 mb-4 max-w-[280px]">
               Our technical team is available 24/7 to assist you.
             </p>
              <Button
                onClick={handleContactSupport}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black px-6 sm:px-8 py-4 sm:py-5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs"
              >
               Contact Afkit Tech Support
             </Button>
           </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
