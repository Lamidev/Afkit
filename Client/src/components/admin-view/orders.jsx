import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Gift, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOrderDetailsView from "./order-details";
import { toast } from "sonner";
import { formatAestheticId } from "@/utils/common";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrderForAdmin,
} from "@/store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  function handleRefresh() {
    dispatch(getAllOrdersForAdmin()).then(() => {
      setLastUpdated(new Date());
      toast.success("Order list updated", { duration: 1000 });
    });
  }

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleDeleteOrder(order) {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    if (orderToDelete?._id) {
      dispatch(deleteOrderForAdmin(orderToDelete._id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllOrdersForAdmin());
          toast.success("Order deleted successfully");
        } else {
          toast.error(data?.payload?.message || "Failed to delete order");
        }
      });
    }
    setIsDeleteDialogOpen(false);
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    setLastUpdated(new Date());
    // Reset order details on mount to prevent the last viewed order from popping up automatically
    dispatch(resetOrderDetails());

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(getAllOrdersForAdmin()).then(() => setLastUpdated(new Date()));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails && orderDetails._id) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex flex-col">
           <CardTitle className="text-2xl font-bold">All Orders</CardTitle>
           <p className="text-[10px] text-slate-400 font-medium">
             Last synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
           </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="rounded-full h-9 w-9 p-0 border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="sm:hidden divide-y divide-slate-100">
          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (
                <div key={orderItem?._id} className="p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {formatAestheticId(orderItem?.orderId || orderItem?._id, "ORD")}
                        {orderItem?.addressInfo?.isGift && (
                          <Gift className="inline-block w-3 h-3 text-orange-500 ml-1.5 align-text-top" />
                        )}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">
                        {orderItem?.payerEmail}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        orderItem?.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <div className="px-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Total</p>
                      <p className="text-[11px] font-extrabold text-slate-900">₦{orderItem?.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="px-1 border-x border-slate-200/60">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Paid</p>
                      <p className="text-[11px] font-extrabold text-emerald-600">₦{orderItem?.amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="px-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Balance</p>
                      <p className="text-[11px] font-extrabold text-rose-600">₦{orderItem?.balanceAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Payment Type</p>
                      <Badge variant="outline" className={`w-fit text-[9px] font-black border-2 px-2 py-0 ${
                        orderItem?.paymentType === 'commitment' ? 'border-amber-100 bg-amber-50 text-amber-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                      }`}>
                         {orderItem?.paymentType === 'commitment' ? 'Pay on Delivery' : 'Full Payment'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="text-[10px] font-semibold h-8 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg"
                          >
                            Details
                          </Button>
                        <Button
                          onClick={() => handleDeleteOrder(orderItem)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Order ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Customer</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest px-0">Type</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Paid</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-600">Balance</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Total</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="font-mono text-[10px] text-slate-400">
                        {formatAestheticId(orderItem?.orderId || orderItem?._id, "ORD")}
                        {orderItem?.addressInfo?.isGift && (
                          <Gift className="inline-block w-2.5 h-2.5 text-orange-500 ml-1.5" title="Third-Party Order" />
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 text-xs">{orderItem?.payerEmail}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            orderItem?.orderStatus === "delivered"
                              ? "bg-green-600"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : orderItem?.orderStatus === "shipped"
                              ? "bg-blue-500"
                              : "bg-slate-900"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold border ${orderItem?.paymentType === 'commitment' ? 'border-orange-500/50 text-orange-600' : 'border-emerald-500/50 text-emerald-600'}`}>
                           {orderItem?.paymentType === 'commitment' ? 'POD' : 'FULL'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600 text-xs text-nowrap">
                        ₦{orderItem?.amountPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-red-600 text-xs text-nowrap">
                        ₦{orderItem?.balanceAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 text-xs text-nowrap">₦{orderItem?.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                             <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="text-[10px] font-semibold h-8 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => handleDeleteOrder(orderItem)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <AdminOrderDetailsView 
          orderDetails={orderDetails} 
          setOpenDialog={setOpenDetailsDialog} 
        />
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete order <span className="font-semibold text-gray-900">{formatAestheticId(orderToDelete?.orderId || orderToDelete?._id, "ORD")}</span>? 
              This action is permanent and cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
