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
      className="bg-white p-4 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
    >
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h2>
        <p className="text-slate-500 font-medium">Track your recent purchases and their delivery status.</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Order ID</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Date</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 uppercase text-[10px] tracking-widest">Status</TableHead>
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
                    <TableCell className="font-mono text-xs text-slate-400 font-medium">#{orderItem?.orderId || orderItem?._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="font-medium text-slate-600 italic">{new Date(orderItem?.orderDate).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Badge
                        className={`px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-wider ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-slate-900">₦{orderItem?.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          className="bg-slate-50 hover:bg-primary hover:text-white text-slate-600 font-bold h-9 px-6 rounded-xl transition-all active:scale-95"
                        >
                          Details
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
