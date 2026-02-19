require("dotenv").config();
const axios = require("axios");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  getNewsletterSubscriberTemplate,
  getAdminNewsletterTemplate,
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
  
  // Log the sender to verify identity
  console.log("📤 Attempted Sender:", sender.email);
  
  // Don't throw if we want non-blocking delivery
};

// ─── AUTH EMAILS ──────────────────────────────────────────────────────────────

// Send Verification Email
exports.sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  console.log("Verification token:", verificationToken);
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

// Send Welcome Email using Mailtrap Template API
exports.sendWelcomeEmail = async (email, userName) => {
  const recipient = [{ email }];
  const templateUUID = "7847782c-f195-4de0-b39e-432e13a1d90a";
  try {
    await axios.post(
      MAILTRAP_ENDPOINT,
      {
        from: sender,
        to: recipient,
        template_uuid: templateUUID,
        template_variables: {
          company_info_name: "Afkit",
          name: userName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
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
    console.log("Password reset request email sent successfully");
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
    console.log("Password reset success email sent successfully");
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
