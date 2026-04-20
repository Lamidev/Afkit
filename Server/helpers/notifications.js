const axios = require("axios");

/**
 * Send directly to Meta WhatsApp Cloud API using our approved template
 */
const sendMetaWhatsAppAlert = async (to, templateData) => {
  try {
    const metaToken = process.env.META_WHATSAPP_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

    if (!metaToken || !phoneNumberId) {
       console.log(`⚠️ META WHATSAPP skipped: Missing META_WHATSAPP_TOKEN or META_PHONE_NUMBER_ID in .env`);
       return;
    }

    let cleanNumber = to.replace(/[\s\-\+]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "234" + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith("234")) {
      cleanNumber = "234" + cleanNumber;
    }

    const payload = {
      messaging_product: "whatsapp",
      to: cleanNumber,
      type: "template",
      template: {
        name: "admin_payment_alert",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: templateData.orderId },
              { type: "text", text: templateData.customerName },
              { type: "text", text: templateData.paymentTypeStr },
              { type: "text", text: templateData.itemsList },
              { type: "text", text: templateData.paymentSummary },
              { type: "text", text: templateData.shippingRegion }
            ]
          }
        ]
      }
    };

    console.log(`📡 Attempting META DIRECT WHATSAPP to ${cleanNumber}...`);
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    
    const response = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${metaToken}`,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ META WhatsApp alert sent to ${cleanNumber}. Status:`, response.data.contacts[0].input);
    return response.data;
  } catch (error) {
    console.error(`❌ Meta API Error:`, error.response?.data || error.message);
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
  
  // Prepare variables for Meta Template
  const customerName = order.addressInfo?.fullName || "A Customer";
  const paymentTypeStr = isPOD ? "Pay on Delivery (POD)" : "Full Payment";
  
  const itemsList = (order.cartItems || [])
    .map((item) => `- ${item.title} (x${item.quantity})`)
    .join("\n") || "No items listed";

  const total = order.totalAmount?.toLocaleString() || "0";
  const paid = order.amountPaid?.toLocaleString() || "0";
  const balance = order.balanceAmount?.toLocaleString() || "0";

  const paymentSummary = isPOD && order.balanceAmount > 0
    ? `Total: ₦${total}\nCommitment Paid (10k): ✅ ₦${paid}\nCollect on Delivery: 🔴 ₦${balance}`
    : `Total: ₦${total}\nStatus: ✅ Fully Paid (${isBalanceUpdate ? "Balanced Cleared Online" : "Paid in Full"})`;

  const shippingRegion = order.addressInfo?.region || "N/A";

  const templateData = {
    orderId,
    customerName,
    paymentTypeStr,
    itemsList,
    paymentSummary,
    shippingRegion
  };

  // Send to all administrators
  for (const number of adminNumbers) {
    // Fire Meta direct WhatsApp
    sendMetaWhatsAppAlert(number, templateData);
  }
};

module.exports = {
  sendAdminAlerts,
};
