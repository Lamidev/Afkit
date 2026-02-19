import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 mt-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Order ID</p>
          <Label className="text-slate-900">{orderDetails?.orderId || orderDetails?._id}</Label>
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
          <p className="font-semibold text-slate-500">Order Amount</p>
          <Label className="text-xl font-bold">₦{orderDetails?.totalAmount.toLocaleString()}</Label>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">Payment Type:</span>
             <span className="font-medium capitalize">{orderDetails?.paymentType} Payment</span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">Amount Paid:</span>
             <span className="font-medium text-green-600">₦{orderDetails?.amountPaid.toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-bold text-slate-900">Remaining Balance:</span>
             <span className="font-bold text-red-600">₦{orderDetails?.balanceAmount.toLocaleString()}</span>
           </div>
        </div>

        <Separator />
        
        <div className="grid gap-4">
          <div className="font-semibold text-lg">Gadgets Ordered</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between bg-slate-50/50 p-2 rounded">
                    <span className="text-slate-700">{item.title}</span>
                    <span className="font-medium text-slate-500">Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>
        
        <Separator />
        
        <div className="grid gap-4">
          <div className="font-semibold text-lg">Shipping Information</div>
          <div className="grid gap-1 bg-slate-50 p-4 rounded-lg text-slate-600">
            <span className="font-bold text-slate-900">{user.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</span>
            <span>Phone: {orderDetails?.addressInfo?.phone}</span>
            {orderDetails?.addressInfo?.notes && (
               <span className="italic mt-2 text-sm text-slate-400">Note: {orderDetails?.addressInfo?.notes}</span>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
