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
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOrderDetailsView from "./order-details";
import { toast } from "sonner";
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
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

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
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">All Orders</CardTitle>
      </CardHeader>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="sm:hidden divide-y divide-slate-100">
          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (
                <div key={orderItem?._id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        #{orderItem?.orderId || orderItem?._id}
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">
                        {orderItem?.payerEmail}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
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

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Total Amount</p>
                      <p className="text-sm font-black text-slate-900">₦{orderItem?.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Balance</p>
                      <p className="text-sm font-black text-red-600">₦{orderItem?.balanceAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Payment</p>
                      <Badge variant="outline" className={`w-fit text-[10px] border ${orderItem?.paymentStatus === 'paid' ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'}`}>
                        {orderItem?.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                       <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="text-[10px] font-bold h-8 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg"
                          >
                            Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
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
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Order ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Customer</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Payment</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-red-600">Balance</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Total</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="font-mono text-[10px] text-slate-400">#{orderItem?.orderId || orderItem?._id}</TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs">{orderItem?.payerEmail}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${
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
                        <Badge variant="outline" className={`text-[9px] font-bold border ${orderItem?.paymentStatus === 'paid' ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'}`}>
                          {orderItem?.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-red-600 text-xs">
                        ₦{orderItem?.balanceAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-black text-slate-900 text-xs">₦{orderItem?.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Dialog
                            open={openDetailsDialog}
                            onOpenChange={() => {
                              setOpenDetailsDialog(false);
                              dispatch(resetOrderDetails());
                            }}
                          >
                            <Button
                              onClick={() => handleFetchOrderDetails(orderItem?._id)}
                              className="h-8 text-[10px] font-bold bg-primary hover:bg-primary/90 text-white px-3 rounded-lg"
                            >
                              Details
                            </Button>
                            <AdminOrderDetailsView orderDetails={orderDetails} />
                          </Dialog>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete order <span className="font-bold text-gray-900">#{orderToDelete?.orderId || orderToDelete?._id}</span>? 
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
