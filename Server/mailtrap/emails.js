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
  getDebateThankYouTemplate,
  getDebateAdminTemplate,
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
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Buyer Email</td><td style="padding:8px 0;">${order.payerEmail}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Ship To</td><td style="padding:8px 0;">${order.addressInfo?.fullName} — ${order.addressInfo?.address}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">State</td><td style="padding:8px 0;">${order.addressInfo?.region || 'N/A'}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Preference</td><td style="padding:8px 0; font-weight:bold; color:${order.addressInfo?.deliveryPreference === 'doorstep' ? '#ea580c' : '#475569'};">${order.addressInfo?.deliveryPreference === 'doorstep' ? '🏠 Doorstep Delivery' : '🏢 Hub Pickup'}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Phone</td><td style="padding:8px 0;">${order.addressInfo?.phone}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Order Type</td><td style="padding:8px 0;">${isGift ? '🎁 GIFT / SOMEONE ELSE' : '📦 Personal Order'}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Items</td><td style="padding:8px 0;">${items}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-weight:bold;">Payment</td><td style="padding:8px 0; color:#f97316; font-weight:bold;">${paymentTypeLabel}</td></tr>
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

// ─── Warranty Activation (On Delivery) ───────────────────────────────────────
// For gift orders: sends warranty email to RECIPIENT + a separate delivery
// notification to the BUYER so both parties are informed.
exports.sendWarrantyActivationEmail = async (order) => {
  const isGift = order.addressInfo?.isGift;
  const recipientEmail = order.addressInfo?.recipientEmail;

  const warrantyHtml = getWarrantyActivationTemplate(order);

  if (isGift && recipientEmail) {
    // Send warranty/delivery info to the recipient
    try {
      await mailtrapClient.send({
        from: sender,
        to: [{ email: recipientEmail }],
        subject: `🎁 Your Gift Has Arrived! Warranty Now Active.`,
        html: warrantyHtml,
        category: "Warranty Activation",
      });
    } catch (error) {
      handleEmailError(error, "Error sending gift warranty email to recipient");
    }
  } else {
    // Personal order — send warranty to the buyer themselves
    if (!order.payerEmail) return;
    try {
      await mailtrapClient.send({
        from: sender,
        to: [{ email: order.payerEmail }],
        subject: `🛡️ Warranty Activated: Your Gadget is Now Insured!`,
        html: warrantyHtml,
        category: "Warranty Activation",
      });
    } catch (error) {
      handleEmailError(error, "Error sending warranty activation email");
    }
  }
};

// ─── Payer Delivery Confirmation (On Delivery) ──────────────────────────────────
exports.sendDeliveryConfirmationToPayer = async (order) => {
  if (!order.payerEmail) return;

  const recipient = [{ email: order.payerEmail }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `📦 Delivery Successful: Order ${order.orderId}`,
      html: getPayerDeliveryConfirmationTemplate(order),
      category: "Delivery Confirmation",
    });
  } catch (error) {
    handleEmailError(error, "Error sending delivery confirmation to payer");
  }
};

// ─── DEBATE CAMPAIGN EMAILS ───────────────────────────────────────────────────

// Send Thank-You Email (to participant)
exports.sendDebateThankYouEmail = async (registration) => {
  const html = getDebateThankYouTemplate(registration);

  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: registration.email }],
      subject: "🎤 Registration Confirmed — Afkit Debate Campaign",
      html,
      category: "Debate Registration",
    });
  } catch (error) {
    handleEmailError(error, "Error sending debate thank-you email");
  }
};

// Send Admin Notification (to info@afkit.ng)
exports.sendDebateAdminNotificationEmail = async (registration) => {
  const html = getDebateAdminTemplate(registration);

  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: "info@afkit.ng" }],
      subject: "🎤 New Debate Registration — Afkit Campaign",
      html,
      category: "Admin Notification",
    });
  } catch (error) {
    handleEmailError(error, "Error sending debate admin notification");
  }
};
