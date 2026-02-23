import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { formatAestheticId } from "@/utils/common";
import { Gift, MapPin, Truck } from "lucide-react";

const REGION_MAPPING = {
  "Lagos": "lagos",
  "Oyo": "south-west", "Ogun": "south-west", "Osun": "south-west", "Ondo": "south-west", "Ekiti": "south-west",
  "Abia": "south-east-south", "Anambra": "south-east-south", "Ebonyi": "south-east-south", "Enugu": "south-east-south", "Imo": "south-east-south",
  "Akwa Ibom": "south-east-south", "Bayelsa": "south-east-south", "Cross River": "south-east-south", "Delta": "south-east-south", "Edo": "south-east-south", "Rivers": "south-east-south",
  "FCT": "north", "Adamawa": "north", "Bauchi": "north", "Benue": "north", "Borno": "north", "Gombe": "north", "Jigawa": "north", "Kaduna": "north",
  "Kano": "north", "Katsina": "north", "Kebbi": "north", "Kogi": "north", "Kwara": "north", "Nasarawa": "north", "Niger": "north", "Plateau": "north",
  "Sokoto": "north", "Taraba": "north", "Yobe": "north", "Zamfara": "north"
};

const ROUTE_LABELS = {
  "lagos": "Lagos Doorstep Delivery",
  "south-west": "South-West Regional Hub",
  "south-east-south": "Eastern/Southern Hub",
  "north": "Northern/Abuja Hub"
};

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
          <div className="font-semibold text-lg">Delivery Information</div>
          <div className="grid gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recipient</span>
              <span className="font-bold text-slate-900">{orderDetails?.addressInfo?.fullName}</span>
              {orderDetails?.addressInfo?.isGift && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded block w-fit mt-1">
                  Receipt Owner: {orderDetails?.addressInfo?.receiptName}
                </span>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Delivery Address</span>
              <span className="text-sm text-slate-700 font-medium">
                {orderDetails?.addressInfo?.address}
                {orderDetails?.addressInfo?.city && !['Included','N/A',''].includes(orderDetails.addressInfo.city)
                  ? `, ${orderDetails.addressInfo.city}` : ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">State</span>
                <span className="text-sm font-bold text-slate-900">{orderDetails?.addressInfo?.region || "Lagos"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Logistics Route</span>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 block w-fit">
                  {ROUTE_LABELS[orderDetails?.addressInfo?.logisticsRoute] ||
                   ROUTE_LABELS[REGION_MAPPING[orderDetails?.addressInfo?.region]] ||
                   "Lagos Doorstep Delivery"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{orderDetails?.addressInfo?.phone}</span>
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
