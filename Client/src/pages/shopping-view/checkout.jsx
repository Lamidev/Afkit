import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "sonner";  // changed to sonner toast
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total cart amount using only price * quantity
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
          0
        )
      : 0;

  function handleCheckout() {
    if (!cartItems.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }

    setIsProcessing(true);

    // Simulate a checkout process
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Checkout successful! Thank you for your purchase.");
      // You can add further logic here, e.g. clear cart, navigate, etc.
    }, 1500);
  }

  return (
    <div className="flex flex-col p-5">
      <h2 className="text-2xl font-bold mb-5">Checkout</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} key={item.productId} />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          {/* Order Summary */}
          <div className="p-5 bg-gray-100 rounded-lg shadow mt-4">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span>{cartItems?.items?.length || 0}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total Amount:</span>
              <span>₦{totalCartAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-4 w-full">
            <Button
              onClick={handleCheckout}
              className="w-full hover:bg-peach-600 text-white"
              disabled={isProcessing || (cartItems?.items?.length === 0)}
            >
              {isProcessing ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
