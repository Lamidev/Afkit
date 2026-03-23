import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingOrderDetailsView from "./order-details";
import { formatAestheticId } from "@/utils/common";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  payOrderBalance,
} from "@/store/shop/order-slice";
import { CreditCard, Package, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES = {
  delivered: "bg-emerald-100 text-emerald-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-orange-100 text-orange-700",
};

function OrderCard({ orderItem, onViewDetails, openDetailsDialog, orderDetails }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isPOD = orderItem?.paymentType === "commitment";
  const hasBalance = orderItem?.paymentStatus === "partially_paid" && orderItem?.balanceAmount > 0;
  const isDelivered = orderItem?.orderStatus === "delivered";

  const orderId = formatAestheticId(orderItem?.orderId || orderItem?._id, "ORD");
  const products = orderItem?.cartItems || [];
  const statusStyle = STATUS_STYLES[orderItem?.orderStatus] || STATUS_STYLES.pending;

  const handlePayBalance = () => {
    dispatch(payOrderBalance(orderItem?._id)).then((data) => {
      if (data?.payload?.success) {
        sessionStorage.setItem("currentOrderId", JSON.stringify(orderItem?._id));
        sessionStorage.setItem("isBalancePayment", JSON.stringify(true));
        window.location.href = data.payload.approvalURL;
      } else {
        toast.error("Failed to initialize balance payment. Please try again.");
      }
    });
  };

  const handleContactSupport = () => {
    const productList = orderItem?.cartItems?.map(i => `• ${i.title} (x${i.quantity}) — ₦${(i.price * i.quantity).toLocaleString()}`).join("\n");
    const orderDate = orderItem?.orderDate
      ? new Date(orderItem.orderDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "N/A";
    const isPOD = orderItem?.paymentType === "commitment";
    const balanceStatus = isPOD
      ? (orderItem?.balanceAmount > 0 ? `₦${orderItem.balanceAmount.toLocaleString()} still outstanding` : "Balance fully cleared ✓")
      : "Full payment — no balance";
    const paymentLine = isPOD
      ? `Pay on Delivery (₦10,000 commitment paid | ${balanceStatus})`
      : `Full Payment (₦${orderItem?.totalAmount?.toLocaleString()})  — Paid in full`;

    const message = `Hi Afkit Customer Support,\n\nI'm having an issue with my order:\n\n📦 *Order ID:* ${orderId}\n📅 *Order Date:* ${orderDate}\n\n🛒 *Gadgets Ordered:*\n${productList}\n\n💰 *Order Total:* ₦${orderItem?.totalAmount?.toLocaleString()}\n💳 *Payment Mode:* ${paymentLine}\n🚚 *Order Status:* ${orderItem?.orderStatus?.toUpperCase()}\n\nPlease look into this for me. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/2348164014304?text=${encoded}`, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-slate-50 rounded-xl shrink-0">
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</p>
            <p className="font-mono text-xs font-black text-slate-800 truncate">{orderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={`px-2.5 py-1 rounded-full border-none font-bold text-[9px] uppercase tracking-wider ${statusStyle}`}>
            {orderItem?.orderStatus}
          </Badge>
          {isPOD && (
            <Badge className={`px-2 py-1 rounded-full border-none font-bold text-[8px] uppercase ${hasBalance && !isDelivered ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
              POD
            </Badge>
          )}
        </div>
      </div>

      {/* ── Gadgets Ordered ── */}
      <div className="px-4 pt-3 pb-2 space-y-1.5">
        {products.slice(0, expanded ? products.length : 2).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate">{item.title}</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="text-xs font-black text-slate-900 shrink-0">₦{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</p>
          </div>
        ))}
        {products.length > 2 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-1 hover:opacity-80 transition-opacity"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> +{products.length - 2} More Items</>}
          </button>
        )}
      </div>

      {/* ── Payment Summary ── */}
      <div className="mx-4 mb-3 bg-slate-50 rounded-xl p-3 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Order Total</span>
          <span className="font-black text-slate-900">₦{orderItem?.totalAmount?.toLocaleString()}</span>
        </div>
        {isPOD && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Commitment Paid</span>
              <span className="font-bold text-emerald-600">₦10,000</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200">
              <span className={`font-bold ${hasBalance && !isDelivered ? "text-amber-700" : "text-slate-400"}`}>
                {isDelivered ? "Balance (Cleared)" : "Balance Due"}
              </span>
              <span className={`font-black ${hasBalance && !isDelivered ? "text-amber-600" : "text-slate-400 line-through"}`}>
                ₦{orderItem?.balanceAmount?.toLocaleString()}
              </span>
            </div>
          </>
        )}
        {!isPOD && (
          <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-200">
            <span className="font-bold text-emerald-600 uppercase tracking-widest">Full Payment — No Balance</span>
            <span className="text-slate-400 font-bold">✓</span>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pb-4 space-y-2">
        {/* Clear Balance CTA */}
        {hasBalance && !isDelivered && (
          <button
            onClick={handlePayBalance}
            className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-amber-200"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Clear Remaining Balance</span>
            </div>
            <span className="text-sm font-black">₦{orderItem?.balanceAmount?.toLocaleString()}</span>
          </button>
        )}

        {/* Bottom row: View Details only */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onViewDetails(orderItem?._id)}
            variant="outline"
            className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-xl border-slate-200 hover:border-primary hover:text-primary transition-all"
          >
            View Details
          </Button>
        </div>

        {/* Support link — clean text, no cramped buttons */}
        <button
          onClick={handleContactSupport}
          className="w-full text-center text-[11px] font-semibold text-blue-900 hover:text-blue-800 underline underline-offset-2 transition-colors pt-1"
        >
          Having issues with your order? Contact customer support
        </button>

        <p className="text-[9px] font-bold text-slate-300 text-center uppercase tracking-widest">
          {orderItem?.orderDate
            ? new Date(orderItem.orderDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : ""}
        </p>
      </div>
    </motion.div>
  );
}

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleCloseDialog = (open) => {
    if (!open) {
      setOpenDetailsDialog(false);
      dispatch(resetOrderDetails());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">What I've Bought</h2>
        <p className="text-slate-500 text-sm font-medium">Track your orders, gadgets and payments below.</p>
      </div>

      {orderList && orderList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orderList.map((orderItem) => (
            <Dialog
              key={orderItem?._id}
              open={openDetailsDialog && orderDetails?._id === orderItem?._id}
              onOpenChange={handleCloseDialog}
            >
              <OrderCard
                orderItem={orderItem}
                onViewDetails={handleFetchOrderDetails}
                openDetailsDialog={openDetailsDialog}
                orderDetails={orderDetails}
              />
              <ShoppingOrderDetailsView orderDetails={orderDetails} />
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400 font-medium italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold uppercase tracking-widest text-[11px]">No orders yet</p>
          <p className="text-sm mt-1">Your purchases will appear here.</p>
        </div>
      )}
    </motion.div>
  );
}

export default ShoppingOrders;
