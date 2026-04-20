require('dotenv').config();
const { sendAdminAlerts } = require('./helpers/notifications');

const testOrder = {
  _id: "ORD-TEST-9999",
  paymentType: "full",
  paymentStatus: "paid",
  cartItems: [
    { title: "Apple MacBook Pro M3", quantity: 1 },
    { title: "Logitech MX Master 3S", quantity: 2 }
  ],
  totalAmount: 2550000,
  amountPaid: 2550000,
  balanceAmount: 0,
  addressInfo: {
    fullName: "John Doe (Tester)",
    region: "Victoria Island, Lagos"
  }
};

console.log("🚀 Running WhatsApp Template Test...");

// Execute the alert function just like a real payment would
sendAdminAlerts(testOrder, false)
  .then(() => {
    console.log("🏁 Test script finished execution.");
  })
  .catch((err) => {
    console.error("❌ Test script failed:", err);
  });
