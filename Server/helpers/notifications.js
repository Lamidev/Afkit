const axios = require("axios");

/**
 * Send directly to Meta WhatsApp Cloud API using our approved template
 */
const sendMetaWhatsAppAlert = async (to, templateName, templateData) => {
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
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: templateData.orderId || "N/A" },
              { type: "text", text: templateData.customerName || "Customer" },
              { type: "text", text: templateData.paymentTypeStr || "Standard" },
              { type: "text", text: templateData.itemsList || "Items list" },
              { type: "text", text: templateData.paymentSummary || "Total" },
              { type: "text", text: templateData.shippingRegion || "Nigeria" }
            ]
          }
        ]
      }
    };

    console.log(`📡 Attempting META DIRECT WHATSAPP (${templateName}) to ${cleanNumber}...`);
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    
    const response = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${metaToken}`,
        "Content-Type": "application/json"
      }
    });

    if (response.data && response.data.messages) {
      console.log(`✅ META WhatsApp alert sent to ${cleanNumber}. Msg ID: ${response.data.messages[0].id}`);
    }
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error(`❌ Meta API Error [${templateName}]:`, JSON.stringify(errorData, null, 2));
    throw error; // Let caller catch it
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
  
  // Decide which template to use (meta already approved both)
  const templateToUse = isBalanceUpdate ? "admin_payment_alert" : "admin_new_order_alert";
  
  // Prepare variables for Meta Template
  const customerName = order.addressInfo?.fullName || "A Customer";
  const paymentTypeStr = isPOD ? "Pay on Delivery (POD)" : "Full Payment";
  
  const itemsList = (order.cartItems || [])
    .map((item) => `[${item.title} x${item.quantity}]`)
    .join(" ") || "No items listed";

  const total = order.totalAmount?.toLocaleString() || "0";
  const paid = order.amountPaid?.toLocaleString() || "0";
  const balance = order.balanceAmount?.toLocaleString() || "0";

  const paymentSummary = isPOD && order.balanceAmount > 0
    ? `Total: ₦${total} | Commitment: ✅ ₦${paid} | Balance: 🔴 ₦${balance}`
    : `Total: ₦${total} | Status: ✅ Fully Paid (${isBalanceUpdate ? "Balance Cleared" : "Paid in Full"})`;

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
    try {
      // Fire Meta direct WhatsApp
      await sendMetaWhatsAppAlert(number, templateToUse, templateData);
    } catch (err) {
      console.error(`❌ Failed to send WhatsApp to ${number}:`, err.message);
    }
  }
};

module.exports = {
  sendAdminAlerts,
};
