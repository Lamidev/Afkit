require("dotenv").config();
const axios = require("axios");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  getNewsletterSubscriberTemplate,
  getAdminNewsletterTemplate,
  getOrderConfirmationTemplate,
  getWarrantyActivationTemplate,
  getPayerDeliveryConfirmationTemplate,
  getDeliveryConfirmationTemplate,
} = require("./email-template.js");
const { mailtrapClient, sender } = require("./mailtrap.config.js");

// Load environment variables
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
const MAILTRAP_ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Common function for handling email sending errors with detailed logging
const handleEmailError = (error, message) => {
  const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
  console.error(`❌ AFKIT EMAIL ERROR [${message}]:`, errorDetails);
  
  if (error.response?.data?.errors) {
    console.error("🔍 Mailtrap Specific Errors:", error.response.data.errors);
  }
};


// Send Verification Email
exports.sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "🔐 Verify Your Email — Afkit",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });
  } catch (error) {
    handleEmailError(error, "Error sending verification email");
  }
};

// Send Welcome Email using Inbuilt Template
exports.sendWelcomeEmail = async (email, userName) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "🎉 Welcome to the Afkit Family!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", userName),
      category: "Welcome",
    });
  } catch (error) {
    handleEmailError(error, "Error sending welcome email");
  }
};

// Send Password Reset Email
exports.sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "🔑 Reset Your Password — Afkit",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    handleEmailError(error, "Error sending password reset email");
  }
};

// Send Password Reset Success Email
exports.sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "✅ Password Reset Successful — Afkit",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    handleEmailError(error, "Error sending password reset success email");
  }
};

// ─── NEWSLETTER EMAILS ────────────────────────────────────────────────────────

// Send Newsletter Subscription Email (to subscriber)
exports.sendNewsletterSubscriptionEmail = async (email) => {
  const recipient = [{ email }];
  const html = getNewsletterSubscriberTemplate();

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "🚀 Welcome to the Afkit Loop — You're In!",
      html,
      category: "Newsletter",
    });
  } catch (error) {
    handleEmailError(error, "Error sending newsletter subscription email");
  }
};

// Send Admin Newsletter Notification (to info@afkit.ng)
exports.sendAdminNewsletterNotificationEmail = async (subscriberEmail) => {
  const html = getAdminNewsletterTemplate(subscriberEmail);

  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: "info@afkit.ng" }],
      subject: "📬 New Newsletter Subscriber — Afkit",
      html,
      category: "Admin Notification",
    });
  } catch (error) {
    handleEmailError(error, "Error sending admin newsletter notification");
  }
};

// ─── Order Confirmation (to Buyer) ───────────────────────────────────────────
exports.sendOrderConfirmationEmail = async (order) => {
  if (!order.payerEmail) {
    console.warn("⚠️ Skipping order confirmation email: No payerEmail provided for order", order._id);
    return;
  }

  const recipient = [{ email: order.payerEmail }];
  const orderId = order.orderId || order._id.toString();
  
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `🎉 Order Confirmed! [ID: #${orderId.startsWith('ORD-') ? orderId : 'ORD-' + orderId.slice(-8).toUpperCase()}]`,
      html: getOrderConfirmationTemplate(order),
      category: "Order Confirmation",
    });
  } catch (error) {
    handleEmailError(error, "Error sending order confirmation email");
  }
};

// ─── Admin New Order Notification ─────────────────────────────────────────────
exports.sendAdminOrderNotificationEmail = async (order) => {
  const isGift = order.addressInfo?.isGift;
  const items = order.cartItems?.map(i => `${i.title} x${i.quantity}`).join(", ") || "Unknown items";
  const paymentTypeLabel = order.paymentType === "commitment" ? `Deposit (₦10,000 paid, ₦${(order.totalAmount - 10000).toLocaleString()} balance)` : `Full Payment (₦${order.totalAmount?.toLocaleString()})`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
      <div style="background: #0f172a; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="margin:0; font-size:18px;">💳 New Order Received — Afkit</h1>
        <p style="margin:4px 0 0; opacity:0.6; font-size:12px;">Order ID: ${order.orderId}</p>
      </div>
      <table style="width:100%; border-collapse: collapse; font-size:13px;">
        <!-- Payer (Receipt Information) -->
        <tr style="background:#f1f5f9;"><td colspan="2" style="padding:10px; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:1px; border-radius:6px 6px 0 0;">👤 Payer (Receipt Details)</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Name</td><td style="padding:8px 10px; font-weight:800;">${order.addressInfo?.receiptInfo?.name || order.payerEmail} <span style="font-size:10px; color:${order.addressInfo?.receiptInfo?.ownerType === 'me' ? '#2563eb' : '#ea580c'};">(${order.addressInfo?.receiptInfo?.ownerType === 'me' ? 'Account Owner' : 'Recipient'})</span></td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Email</td><td style="padding:8px 10px;">${order.addressInfo?.receiptInfo?.email || order.payerEmail}</td></tr>
        
        <!-- Recipient (Shipping Information) -->
        <tr style="background:#fff7ed;"><td colspan="2" style="padding:10px; font-weight:900; color:#9a3412; text-transform:uppercase; letter-spacing:1px; margin-top:10px;">🚚 Recipient (Shipping Details)</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Name</td><td style="padding:8px 10px; font-weight:800;">${order.addressInfo?.shippingInfo?.name || order.addressInfo?.fullName}</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Phone</td><td style="padding:8px 10px;">${order.addressInfo?.shippingInfo?.phone || order.addressInfo?.phone}</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Location</td><td style="padding:8px 10px;">${order.addressInfo?.shippingInfo?.location || order.addressInfo?.address}</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">State</td><td style="padding:8px 10px;">${order.addressInfo?.region || 'N/A'}</td></tr>
        
        <!-- Order Context -->
        <tr style="background:#f8fafc;"><td colspan="2" style="padding:10px; font-weight:900; color:#475569; text-transform:uppercase; letter-spacing:1px;">📋 Order Context</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Purchase Type</td><td style="padding:8px 10px; font-weight:bold;">${isGift ? '🎁 GIFT / SOMEONE ELSE' : '📦 Personal Purchase'}${isGift ? ` (Receipt issued to: ${order.addressInfo?.receiptInfo?.ownerType === 'me' ? 'Account Owner' : 'The Recipient'})` : ''}</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Delivery Preference</td><td style="padding:8px 10px; font-weight:bold; color:${order.addressInfo?.deliveryPreference === 'doorstep' ? '#ea580c' : '#2563eb'};">
          ${order.addressInfo?.region === 'Lagos' ? '🏠 Free Home Delivery' :
            order.addressInfo?.deliveryPreference === 'doorstep' ? '🏠 Home Delivery (Pay Rider)' :
            ['Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'].includes(order.addressInfo?.region) ? '🏢 Free Car Park Pickup' : '✈️ Free Airport Pickup'}
        </td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Items</td><td style="padding:8px 10px;">${items}</td></tr>
        <tr><td style="padding:8px 10px; color:#64748b; font-weight:bold;">Payment</td><td style="padding:8px 10px; color:#f97316; font-weight:bold;">${paymentTypeLabel}</td></tr>
      </table>
      <div style="margin-top:24px; padding:16px; background:#fff7ed; border:2px solid #f97316; border-radius:8px; font-size:12px; color:#9a3412;">
        <strong>⚡ Action Required:</strong> Log in to the admin panel to confirm and begin processing this order.
      </div>
    </div>
  `;

  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: "info@afkit.ng" }],
      subject: `⚡ New Order: ${order.orderId} — ₦${order.totalAmount?.toLocaleString()}`,
      html,
      category: "Admin Order Alert",
    });
  } catch (error) {
    handleEmailError(error, "Error sending admin order notification email");
  }
};

// ─── Delivered Status Notifications ──────────────────────────────────────────
// Consolidates all delivery emails to avoid redundancy.
// 1. Personal: ONLY 1 email to Payer (Warranty + Delivery Confirmation)
// 2. Gift (Me): ONLY 1 email to Payer (Gift Delivered + Warranty Active)
// 3. Gift (Recipient): 2 emails - Warranty to Recipient + Brief "Mission Success" to Payer
exports.sendDeliveredNotifications = async (order) => {
  const isGift = order.addressInfo?.isGift;
  const receiptInfo = order.addressInfo?.receiptInfo;
  
  // The official email for the warranty certificate
  // We prioritize the new receiptInfo.email structure, then fallback to payer/recipient
  const warrantyEmail = receiptInfo?.email || (isGift ? (order.addressInfo?.recipientEmail || order.addressInfo?.email) : order.payerEmail);
  const payerEmail = order.payerEmail;
  const ownerType = receiptInfo?.ownerType || (isGift ? "recipient" : "me");

  try {
    // SCENARIO A: The Payer holds the warranty (Personal or Gift-to-self)
    // We send ONLY ONE high-impact email.
    if (ownerType === "me" || warrantyEmail === payerEmail) {
      if (!warrantyEmail) return;

      const isPODWithBalance = order.paymentType === "commitment" && order.balanceAmount > 0;

      await mailtrapClient.send({
        from: sender,
        to: [{ email: warrantyEmail }],
        subject: isPODWithBalance 
          ? `📦 Your Order has been Delivered! [Balance Unpaid]`
          : `🛡️ Warranty Activated: Your Gadget is Now Insured!`,
        html: isPODWithBalance 
          ? getDeliveryConfirmationTemplate(order)
          : getWarrantyActivationTemplate(order),
        category: isPODWithBalance ? "Delivery Confirmation (POD)" : "Delivery & Warranty Success",
      });
      return;
    }

    // SCENARIO B: Someone else holds the warranty (Gift to Recipient or Custom Person)
    // We send TWO targeted emails.
    
    // 1. Send the Warranty Certificate (or delivery alert) to the legal owner
    if (warrantyEmail) {
      const isPODWithBalance = order.paymentType === "commitment" && order.balanceAmount > 0;

      await mailtrapClient.send({
        from: sender,
        to: [{ email: warrantyEmail }],
        subject: isPODWithBalance
          ? `🎁 A Gift has been Delivered to you!`
          : `🎁 Your Gift Has Arrived! Warranty Now Active.`,
        html: isPODWithBalance
          ? getDeliveryConfirmationTemplate(order) // Still tells them to pay balance if they are the owner
          : getWarrantyActivationTemplate(order),
        category: isPODWithBalance ? "Gift Delivery Alert" : "Gift Recipient Warranty",
      });
    }

    // 2. Send a "Mission Success" confirmation to the Payer
    if (payerEmail && payerEmail !== warrantyEmail) {
      await mailtrapClient.send({
        from: sender,
        to: [{ email: payerEmail }],
        subject: `📦 Delivery Successful: Gift for ${order.addressInfo?.fullName}`,
        html: getPayerDeliveryConfirmationTemplate(order),
        category: "Gift Payer Notification",
      });
    }

  } catch (error) {
    handleEmailError(error, `Error sending delivered notifications for order ${order._id}`);
  }
};


