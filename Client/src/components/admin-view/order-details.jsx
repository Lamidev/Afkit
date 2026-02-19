import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";
import { CreditCard, Truck } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ 
        id: orderDetails?._id, 
        orderStatus: status,
        // If delivered, we assume payment is finalized if it was POD
        paymentStatus: status === 'delivered' ? 'paid' : orderDetails?.paymentStatus,
        amountPaid: status === 'delivered' ? orderDetails?.totalAmount : orderDetails?.amountPaid
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[700px] border-0 shadow-2xl overflow-hidden p-0 bg-gray-50/50 backdrop-blur-xl">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center">
        <div>
          <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">Order Intelligence</DialogTitle>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ref: {orderDetails?.orderId || orderDetails?._id}</p>
        </div>
        <Badge className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest ${
          orderDetails?.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
          orderDetails?.orderStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-900 text-white'
        }`}>
          {orderDetails?.orderStatus}
        </Badge>
      </div>

      <div className="p-6 overflow-y-auto max-h-[75vh] space-y-8">
        {/* Payment Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Billing Strategy</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">
                {orderDetails?.paymentType === 'commitment' ? 'Pay on Delivery' : 'Full Advance'}
              </span>
              <div className={`p-1.5 rounded-lg ${orderDetails?.paymentType === 'commitment' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Status</p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-black uppercase tracking-tighter ${orderDetails?.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {orderDetails?.paymentStatus}
              </span>
              <div className={`p-1.5 rounded-lg ${orderDetails?.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                <Badge variant="outline" className="border-0 p-0 hover:bg-transparent">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${orderDetails?.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Summary */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
          <div className="relative space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Invoice Value</span>
              <span className="text-lg font-black text-white">₦{orderDetails?.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span>Verified Received</span>
              <span>- ₦{orderDetails?.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Balance to Collect</span>
                <span className="text-3xl font-black text-white leading-none">₦{orderDetails?.balanceAmount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-white/30 uppercase block">Last Updated</span>
                <span className="text-[10px] font-bold text-white/60">{new Date(orderDetails?.orderUpdateDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics Profile */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <Truck className="w-4 h-4" /> Logistics Profile
           </h3>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</span>
                <p className="text-sm font-black text-gray-900 leading-relaxed">
                  {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city}
                </p>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex flex-col gap-1 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Delivery Intel</span>
                  <div
                    className="text-xs font-bold text-amber-900 notes-content"
                    dangerouslySetInnerHTML={{ __html: orderDetails?.addressInfo?.notes }}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</span>
                  <p className="text-xs font-bold text-gray-700">{orderDetails?.addressInfo?.fullName}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</span>
                  <p className="text-xs font-bold text-gray-700">{orderDetails?.addressInfo?.phone}</p>
                </div>
              </div>
            </div>
        </div>

        {/* Control Interface */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
           <Separator className="mb-6 opacity-30" />
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Command Center</p>
           <CommonForm
             formControls={[
               {
                 label: "",
                 name: "status",
                 placeholder: "Modify Order Trajectory",
                 componentType: "select",
                 options: [
                   { id: "pending", label: "Pending Verification" },
                   { id: "confirmed", label: "Confirmed (Activate Stock)" },
                   { id: "processing", label: "Processing Operations" },
                   { id: "shipped", label: "Out for Delivery" },
                   { id: "delivered", label: "Delivered & Settled" },
                   { id: "rejected", label: "Rejection Protocol" },
                   { id: "cancelled", label: "Termination" },
                 ],
               },
             ]}
             formData={formData}
             setFormData={setFormData}
             buttonText={"Apply Pulse Update"}
             buttonClassName="bg-primary hover:bg-primary/90"
             onSubmit={handleUpdateStatus}
           />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
