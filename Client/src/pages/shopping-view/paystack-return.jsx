import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrCreateSessionId } from "@/components/utils/session";

function PaystackReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("reference");

  const hasCaptured = useRef(false);

  useEffect(() => {
    if (paymentId && !hasCaptured.current) {
      hasCaptured.current = true;
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          
          // Clear cart in Redux by fetching the empty cart from server
          const userId = user?.id || user?._id;
          const sessionId = getOrCreateSessionId();
          dispatch(fetchCartItems({ userId, sessionId }));

          navigate("/shop/payment-success", { 
            state: { 
              orderData: data.payload.data 
            } 
          });
        }
      });
    }
  }, [paymentId, dispatch, navigate, user]);

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-center">Processing Payment... Please wait.</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaystackReturnPage;
