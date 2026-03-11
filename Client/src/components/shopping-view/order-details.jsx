import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { formatAestheticId, REGION_MAPPING } from "@/utils/common";
import { Gift, MapPin, Truck } from "lucide-react";




function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          Order Details
          {orderDetails?.addressInfo?.isGift && (
            <Badge className="bg-orange-500 text-white flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold w-fit">
              <Gift className="w-3 h-3" />
              Someone Else
            </Badge>
          )}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 mt-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Order ID</p>
          <Label className="text-slate-900 font-mono font-black">
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
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Total Amount</p>
          <Label className="text-xl font-bold">₦{orderDetails?.totalAmount.toLocaleString()}</Label>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-medium capitalize">{orderDetails?.paymentType} Payment</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-medium text-green-600">₦{orderDetails?.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bold text-slate-900">Balance to Pay:</span>
              <span className="font-bold text-red-600">₦{orderDetails?.balanceAmount.toLocaleString()}</span>
            </div>
        </div>

        <Separator />
        
        <div className="grid gap-4">
          <div className="font-semibold text-lg">Gadgets Ordered</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li key={item.productId} className="flex flex-col bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] font-mono font-black text-slate-400">
                        {formatAestheticId(item.productId, "GAD")}
                      </span>
                    </div>
                    {item.condition && (
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-1 ${
                        item.condition === "Brand New"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {item.condition}
                      </span>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Qty: {item.quantity}</span>
                      <span className="font-bold text-slate-900">₦{Number(item.price * item.quantity).toLocaleString()}</span>
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
               <div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    {orderDetails?.addressInfo?.deliveryTarget === 'personal' ? "Destination (Collected By Payer)" : "Destination (Someone Else)"}
                 </span>
                 <p className="font-bold text-slate-900 uppercase">
                    {orderDetails?.addressInfo?.fullName}
                 </p>
                 <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 truncate">
                    {orderDetails?.addressInfo?.address}
                 </p>
               </div>
               <div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Warranty Owner</span>
                 <div className="flex items-center gap-2">
                   <p className="font-bold text-slate-900 uppercase">
                      {orderDetails?.addressInfo?.receiptInfo?.name || orderDetails?.addressInfo?.fullName}
                   </p>
                   <Badge className={`px-1.5 py-0 rounded text-[7px] border-0 uppercase font-bold tracking-tighter ${orderDetails?.addressInfo?.receiptInfo?.ownerType === 'me' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {orderDetails?.addressInfo?.receiptInfo?.ownerType === 'me' ? 'Me' : 'Someone Else'}
                   </Badge>
                 </div>
                 <p className="text-[10px] font-bold text-blue-600 truncate mt-1">
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
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
