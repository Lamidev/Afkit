import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureMonnifyPayment, captureBalancePayment } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrCreateSessionId } from "@/components/utils/session";

function MonnifyReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const params = new URLSearchParams(location.search);
  
  // Monnify returns paymentReference or transactionReference
  const paymentId = params.get("transactionReference") || params.get("paymentReference");
  const status = params.get("status");

  const hasCaptured = useRef(false);

  useEffect(() => {
    if (paymentId && !hasCaptured.current) {
      hasCaptured.current = true;
      
      const orderIdFromUrl = params.get("orderId");
      const orderIdFromSession = JSON.parse(sessionStorage.getItem("currentOrderId"));
      const orderId = orderIdFromUrl || orderIdFromSession;
      
      const isBalancePayment = JSON.parse(sessionStorage.getItem("isBalancePayment"));

      // If status is failed, redirect immediately
      if (status === "FAILED") {
        navigate("/shop/home");
        return;
      }

      // Dynamically select capture action
      const captureAction = isBalancePayment ? captureBalancePayment : captureMonnifyPayment;

      dispatch(captureAction({ paymentId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          sessionStorage.removeItem("isBalancePayment");
          
          if (!isBalancePayment) {
            const userId = user?.id || user?._id;
            const sessionId = getOrCreateSessionId();
            dispatch(fetchCartItems({ userId, sessionId }));
          }

          navigate("/shop/payment-success", { 
            state: { 
              orderData: data.payload.data 
            } 
          });
        } else {
          navigate("/shop/home");
        }
      });
    } else if (!paymentId && !hasCaptured.current) {
        navigate("/shop/home");
    }
  }, [paymentId, status, dispatch, navigate, user, params]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full mx-auto shadow-2xl border-2 border-slate-100 rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50 py-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <CardTitle className="text-center text-xl font-black uppercase tracking-tight text-slate-800">
            Verifying Transaction
          </CardTitle>
          <p className="text-center text-slate-500 text-sm font-bold uppercase mt-2 tracking-widest">
            Please do not refresh the page
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}

export default MonnifyReturnPage;
