import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingOrderDetailsView from "./order-details";
import { formatAestheticId } from "@/utils/common";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-2 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100"
    >
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">What I've Bought</h2>
        <p className="text-slate-500 font-medium">See your items and if they have arrived.</p>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-4">
        {orderList && orderList.length > 0 ? (
          orderList.map((orderItem) => (
            <div 
              key={orderItem?._id}
              className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receipt #</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {formatAestheticId(orderItem?.orderId || orderItem?._id, "ORD")}
                  </span>
                </div>
                <Badge
                  className={`px-3 py-1 rounded-full border-none font-bold text-[9px] uppercase tracking-wider ${
                    orderItem?.orderStatus === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : orderItem?.orderStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {orderItem?.orderStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                  <span className="text-[11px] font-bold text-slate-700">
                    {new Date(orderItem?.orderDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</span>
                  <span className="text-[11px] font-bold text-slate-900">
                    ₦{orderItem?.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Dialog
                open={openDetailsDialog && orderDetails?._id === orderItem?._id}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                  }
                }}
              >
                <Button
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  className="w-full bg-white hover:bg-primary hover:text-white text-primary border border-primary/10 font-bold text-xs h-11 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  VIEW DETAILS
                </Button>
                <ShoppingOrderDetailsView orderDetails={orderDetails} />
              </Dialog>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 font-medium italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            You haven't placed any orders yet.
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest pl-6">Receipt #</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Date</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Item Status</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Amount</TableHead>
              <TableHead className="sr-only">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem, index) => (
                  <motion.tr 
                    key={orderItem?._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-slate-400 font-black pl-6">
                      {formatAestheticId(orderItem?.orderId || orderItem?._id, "ORD")}
                    </TableCell>
                    <TableCell className="font-bold text-slate-600 text-xs">{new Date(orderItem?.orderDate).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Badge
                        className={`px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-wider ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-slate-900">₦{orderItem?.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Dialog
                        open={openDetailsDialog && orderDetails?._id === orderItem?._id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          className="bg-white hover:bg-primary hover:text-white text-primary border border-primary/10 font-black text-[10px] tracking-widest h-9 px-6 rounded-xl transition-all active:scale-95 shadow-sm"
                        >
                          DETAILS
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </motion.tr>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium italic">
                    You haven't placed any orders yet.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

export default ShoppingOrders;
