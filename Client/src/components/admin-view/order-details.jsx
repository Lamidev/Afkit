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
import { CreditCard, Truck, Gift, AlertTriangle, Package, MapPin, UserCheck, DollarSign } from "lucide-react";
import { formatAestheticId } from "@/utils/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails, setOpenDialog }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    setIsUpdating(true);
    dispatch(
      updateOrderStatus({ 
        id: orderDetails?._id, 
        orderStatus: status,
        paymentStatus: status === 'delivered' ? 'paid' : orderDetails?.paymentStatus,
        amountPaid: status === 'delivered' ? orderDetails?.totalAmount : orderDetails?.amountPaid
      })
    ).then((data) => {
      setIsUpdating(false);
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[92vh] border-0 shadow-2xl overflow-hidden p-0 bg-white flex flex-col">
      {/* Header with improved spacing for the 'X' button */}
      <div className="bg-slate-900 border-b border-white/5 p-6 pr-12 shrink-0">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <DialogTitle className="text-xl font-bold text-white tracking-tight">Manage Order</DialogTitle>
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">ID: {formatAestheticId(orderDetails?.orderId || orderDetails?._id, "ORD")}</p>
        </div>
        
        <button 
          onClick={() => setOpenDialog(false)}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 text-white transition-all focus-visible:outline-none"
        >
          <X className="w-5 h-5 shadow-sm" />
        </button>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border-none ${
            orderDetails?.orderStatus === 'delivered' ? 'bg-emerald-500 text-white' : 
            orderDetails?.orderStatus === 'rejected' ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            Current: {orderDetails?.orderStatus}
          </Badge>
          <div className="flex gap-2">
            <Badge className={`px-3 py-1 border-none font-bold text-[10px] uppercase tracking-wider ${orderDetails?.addressInfo?.isGift ? 'bg-orange-500/20 text-orange-400' : orderDetails?.addressInfo?.isAssisted ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>
               {orderDetails?.addressInfo?.isGift ? 'Gift' : orderDetails?.addressInfo?.isAssisted ? 'Assisted' : 'Personal'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <TabsList className="bg-slate-200/50 p-1 rounded-xl h-auto w-full sm:w-fit grid grid-cols-3 sm:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase tracking-tighter sm:tracking-widest transition-all">
              <Package className="w-3.5 h-3.5 hidden sm:block" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase tracking-tighter sm:tracking-widest transition-all">
              <Truck className="w-3.5 h-3.5 hidden sm:block" />
              Transit
            </TabsTrigger>
            <TabsTrigger value="update" className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase tracking-tighter sm:tracking-widest transition-all">
              <UserCheck className="w-3.5 h-3.5 hidden sm:block" />
              Action
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="p-6 space-y-8 pb-12">
            <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:outline-none">
              {/* Financial Summary */}
              <div className="bg-slate-900 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Total Bill</span>
                    <span className="text-base font-bold text-white">₦{orderDetails?.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">
                    <span>Paid</span>
                    <span>- ₦{orderDetails?.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Balance Due</span>
                      <span className="text-2xl font-bold text-white leading-none">₦{orderDetails?.balanceAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products List - Was Missing! */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-4 h-4" /> Items Ordered ({orderDetails?.cartItems?.length})
                </h3>
                <div className="space-y-3">
                  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                    orderDetails.cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-2">{item.title}</p>
                          {item.condition && (
                            <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-0.5 mb-0.5 ${
                              item.condition === "Brand New"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {item.condition === "Brand New" ? "✨" : "🇬🇧"} {item.condition}
                            </span>
                          )}
                          <p className="text-[10px] font-semibold text-gray-500">{item.quantity} x ₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>

            </TabsContent>

            <TabsContent value="logistics" className="mt-0 space-y-6 focus-visible:outline-none">
              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Address
                </h3>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Destination</span>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed">
                      {orderDetails?.addressInfo?.fullName}<br/>
                      {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city}
                    </p>
                    <p className="text-xs font-semibold text-blue-600 mt-2">{orderDetails?.addressInfo?.phone}</p>
                    {orderDetails?.addressInfo?.shippingInfo?.backupPhone && (
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Backup: {orderDetails?.addressInfo?.shippingInfo?.backupPhone}</p>
                    )}
                  </div>
                  
                  {orderDetails?.addressInfo?.notes && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Courier Notes</span>
                      <div className="text-[11px] font-semibold text-amber-900 mt-1" dangerouslySetInnerHTML={{ __html: orderDetails?.addressInfo?.notes }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Someone Else Details */}
              {(orderDetails?.addressInfo?.isGift || orderDetails?.addressInfo?.isAssisted) && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {/* Receipt/Ownership Info */}
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Gift className="w-4 h-4" /> Ownership (Receipt Details)
                      </h3>
                      <div className="bg-slate-900 rounded-2xl p-5 space-y-4 shadow-sm text-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">Legal Owner</span>
                            <p className="text-xs font-bold text-white uppercase">{orderDetails?.addressInfo?.receiptInfo?.name || orderDetails?.addressInfo?.receiptName || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">Warranty Email</span>
                            <p className="text-xs font-bold text-blue-400 truncate">{orderDetails?.addressInfo?.receiptInfo?.email || orderDetails?.addressInfo?.recipientEmail || "N/A"}</p>
                          </div>
                          <div className="col-span-full">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">Billing Address</span>
                            <p className="text-xs font-medium text-white/80">{orderDetails?.addressInfo?.receiptInfo?.address || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Recipient Logistics Info */}
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Recipient Logistics
                      </h3>
                      <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] font-bold text-blue-900/40 uppercase tracking-widest block mb-1">Courier Contact</span>
                            <p className="text-xs font-bold text-blue-900 uppercase">{orderDetails?.addressInfo?.shippingInfo?.name || orderDetails?.addressInfo?.fullName}</p>
                            <p className="text-xs font-bold text-blue-600 mt-1">{orderDetails?.addressInfo?.shippingInfo?.phone || orderDetails?.addressInfo?.phone}</p>
                            {orderDetails?.addressInfo?.shippingInfo?.backupPhone && (
                               <Badge variant="outline" className="mt-2 bg-white text-blue-600 border-blue-200 text-[8px] font-black tracking-widest uppercase">
                                 Backup: {orderDetails?.addressInfo?.shippingInfo?.backupPhone}
                               </Badge>
                            )}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-blue-900/40 uppercase tracking-widest block mb-1">Exact Location</span>
                            <p className="text-xs font-bold text-blue-900 leading-relaxed uppercase">{orderDetails?.addressInfo?.shippingInfo?.location || orderDetails?.addressInfo?.address}</p>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Payer Info */}
              <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Payer Context
                  </h3>
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer Email</p>
                      <p className="text-xs font-semibold text-gray-900">{orderDetails?.payerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Transaction</p>
                      <p className="text-xs font-bold text-gray-900">₦{orderDetails?.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
              </div>
            </TabsContent>

            <TabsContent value="update" className="mt-0 space-y-6 focus-visible:outline-none">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <DollarSign className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Workflow</h3>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Update Pipeline</p>
                  </div>
                </div>

                {/* Logistics Requirement */}
                <div className={`mb-6 p-4 rounded-2xl border-l-4 shadow-sm flex gap-4 items-start ${
                  orderDetails?.addressInfo?.isGift ? 'bg-orange-50 border-orange-500 text-orange-900' : 'bg-blue-50 border-blue-500 text-blue-900'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${orderDetails?.addressInfo?.isGift ? 'text-orange-500' : 'text-blue-500'}`} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Logistics Requirement</p>
                    <p className="text-xs font-semibold leading-relaxed">
                      {orderDetails?.addressInfo?.isGift 
                        ? orderDetails?.paymentType === 'commitment'
                          ? `🚨 GIFT POD: Confirm with recipient ${orderDetails?.addressInfo?.fullName} first. Balance: ₦${orderDetails?.balanceAmount.toLocaleString()}.`
                          : `📦 GIFT FULLY PAID: Ensure ${orderDetails?.addressInfo?.fullName} knows this is a gift (₦0 required).`
                        : orderDetails?.paymentType === 'commitment'
                          ? `📞 POD VERIFICATION: Confirm recipient has ₦${orderDetails?.balanceAmount.toLocaleString()} ready.`
                          : `✅ FULLY PAID: Standard delivery to ${orderDetails?.addressInfo?.fullName}.`
                      }
                    </p>
                  </div>
                </div>

                <CommonForm
                  formControls={[
                    {
                      label: "",
                      name: "status",
                      placeholder: "Change Pipeline Status",
                      componentType: "select",
                      options: [
                        { id: "pending", label: "Pending" },
                        { id: "confirmed", label: "Confirmed" },
                        { id: "shipped", label: "Shipped" },
                        { id: "delivered", label: "Delivered" },
                        { id: "cancelled", label: "Cancelled" },
                      ],
                    },
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  buttonText={isUpdating ? "Processing..." : formData.status === orderDetails?.orderStatus ? "No Change" : "Execute Transition"}
                  isBtnDisabled={isUpdating || !formData.status || formData.status === orderDetails?.orderStatus}
                  buttonClassName={`w-full h-11 text-xs uppercase font-bold tracking-widest rounded-xl transition-all ${
                    isUpdating || !formData.status || formData.status === orderDetails?.orderStatus
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                  }`}
                  onSubmit={handleUpdateStatus}
                />
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <DialogFooter className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 sm:justify-end shrink-0 pb-10 sm:pb-6">
        <Button 
          variant="outline" 
          onClick={() => setOpenDialog(false)}
          className="w-full sm:w-auto font-bold text-[10px] uppercase tracking-widest rounded-xl h-10 px-6 border-gray-200 hover:bg-white hover:text-black transition-all shadow-sm"
        >
          Dismiss Details
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
