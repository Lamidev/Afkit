const Newsletter = require("../../models/newsletter");
const { sendNewsletterSubscriptionEmail, sendAdminNewsletterNotificationEmail } = require("../../mailtrap/emails");

const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed to our newsletter!",
      });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    // Send thank you email to user (non-blocking)
    sendNewsletterSubscriptionEmail(email).catch((err) => {
      console.error("Failed to send newsletter subscriber email:", err.message);
    });

    // Notify admin (non-blocking)
    sendAdminNewsletterNotificationEmail(email).catch((err) => {
      console.error("Failed to send admin newsletter notification:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to the newsletter",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while subscribing. Please try again later.",
    });
  }
};

module.exports = { subscribeToNewsletter };
