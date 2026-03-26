const axios = require("axios");

/**
 * Sends an automated notification via Termii (or compatible API).
 */
const sendTermiiMessage = async (to, message, type = "whatsapp") => {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    
    // Safety check for API Key
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 10) {
      console.log(`⚠️ ${type.toUpperCase()} skipped: No valid TERMII_API_KEY detected.`);
      return;
    }

    // Clean the phone number: Remove spaces, dashes, + and ensure it starts with 234
    let cleanNumber = to.replace(/[\s\-\+]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "234" + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith("234")) {
      cleanNumber = "234" + cleanNumber;
    }

    const payload = {
      to: cleanNumber,
      from: process.env.TERMII_WHATSAPP_SENDER || "Afkit",
      sms: message,
      type: type === "sms" ? "plain" : "whatsapp",
      channel: type === "sms" ? "dnd" : "whatsapp", // "dnd" enables delivery even to numbers with DND active
      api_key: apiKey,
    };

    console.log(`📡 Attempting ${type.toUpperCase()} to ${cleanNumber}...`);
    
    const response = await axios.post("https://v3.api.termii.com/api/sms/send", payload);
    
    if (response.data && (response.data.code === "ok" || response.data.message?.includes("successfully"))) {
      console.log(`✅ ${type.toUpperCase()} alert sent to ${cleanNumber}`);
      return response.data;
    } else {
      console.error(`❌ Termii API error [${type}]:`, response.data);
    }
  } catch (error) {
    console.error(`❌ Network Error [${type}]:`, error.response?.data || error.message);
  }
};

/**
 * Notify the Sales/Admin team about a new order or balance.
 */
const sendAdminAlerts = async (order, isBalanceUpdate = false) => {
  if (!order) return;

  const adminNumbersString = process.env.ADMIN_WHATSAPP_NUMBER || "2348164014304";
  const adminNumbers = adminNumbersString.split(",").map(num => num.trim()).filter(Boolean);

  const orderId = order.orderId || order._id;
  const isPOD = order.paymentType === "commitment";
  
  // Dynamic Headings
  const whatsappHeader = isBalanceUpdate ? "💰 *BALANCE COMPLETED!*" : "📦 *NEW AFKIT ORDER!*";
  const smsHeader = isBalanceUpdate ? "BALANCE PAID!" : (isPOD ? "POD Alert!" : "NEW PAID ORDER!");

  const statusIcon = order.paymentStatus === "paid" ? "✅" : "💳";
  const statusText = order.paymentStatus === "paid" 
    ? (isBalanceUpdate ? "Remaining Balance Cleared" : "Full Payment received") 
    : "POD (Commitment Paid)";
  
  // Safe item mapping (fallback to empty array)
  const itemsList = (order.cartItems || [])
    .map((item) => `• ${item.title} (x${item.quantity})`)
    .join("\n") || "No items listed";

  const total = order.totalAmount?.toLocaleString() || "0";
  const paid = order.amountPaid?.toLocaleString() || "0";
  const balance = order.balanceAmount?.toLocaleString() || "0";

  const paymentSummary = isPOD && order.balanceAmount > 0
    ? `Total: ₦${total}
*Commitment Paid (10k):* ✅ ₦${paid}
*Collect on Delivery:* 🔴 ₦${balance}`
    : `Total: ₦${total}
*Status:* ✅ Fully Paid (${isBalanceUpdate ? "Balanced Cleared Online" : "Paid in Full"})`;

  // 1. WhatsApp Template
  const whatsappMessage = `${whatsappHeader}
━━━━━━━━━━━━━━
*Order ID:* \`${orderId}\`
*Payment:* ${statusIcon} _${statusText}_

🛒 *Gadgets:*
${itemsList}

💰 *Payment Breakdown:*
${paymentSummary}

📍 *Shipping to:*
Name: ${order.addressInfo?.fullName || "N/A"}
Place: ${order.addressInfo?.region || "N/A"}

━━━━━━━━━━━━━━
${isBalanceUpdate ? "_Payment verified—No need to collect cash on delivery._" : "_Check your dashboard to process dispatch._"}`;

  // 2. SMS Template (Short & Instant)
  const smsBody = `${smsHeader} ID: ${orderId}. Total: N${total}. ${order.balanceAmount > 0 ? `Collect: N${balance}` : "Fully Paid (No balance)."}`;

  // Send to all administrators
  for (const number of adminNumbers) {
    // Send without waiting (async)
    sendTermiiMessage(number, whatsappMessage, "whatsapp");
    sendTermiiMessage(number, smsBody, "sms");
  }
};

module.exports = {
  sendAdminAlerts,
};
