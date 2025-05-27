
require("dotenv").config();
const axios = require("axios");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE

} = require("./email-template.js");
const { mailtrapClient, sender } = require("./mailtrap.config.js");

// Load environment variables
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
const MAILTRAP_ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Common function for handling email sending errors
const handleEmailError = (error, message) => {
  console.error(`${message}:`, error.response ? error.response.data : error.message);
  throw new Error(`${message}: ${error.message}`);
};

// Send Verification Email
exports.sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  console.log("Verification token:", verificationToken);

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });

    // console.log("Verification email sent successfully", response);
  } catch (error) {
    handleEmailError(error, "Error sending verification email");
  }
};

// Send Welcome Email using Mailtrap Template API
exports.sendWelcomeEmail = async (email, userName) => {
  const recipient = [{ email }];
  const templateUUID = "7847782c-f195-4de0-b39e-432e13a1d90a"; // Mailtrap template UUID

  try {
    const response = await axios.post(
      MAILTRAP_ENDPOINT,
      {
        from: sender,
        to: recipient,
        template_uuid: templateUUID,
        template_variables: {
          company_info_name: "Afkit Gadgets", // Matches email template variables
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
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset request email sent successfully", response);
  } catch (error) {
    handleEmailError(error, "Error sending password reset email");
  }
};

// Send Password Reset Success Email
exports.sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    handleEmailError(error, "Error sending password reset success email");
  }
};


