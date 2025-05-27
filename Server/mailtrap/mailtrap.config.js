

require("dotenv").config();
const { MailtrapClient } = require("mailtrap");

// Load environment variables
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
const MAILTRAP_ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Ensure credentials exist before initializing the client
if (!MAILTRAP_TOKEN || !MAILTRAP_ENDPOINT) {
  throw new Error("Missing Mailtrap configuration in environment variables.");
}

// Initialize Mailtrap client securely
const mailtrapClient = new MailtrapClient({
  endpoint: MAILTRAP_ENDPOINT,
  token: MAILTRAP_TOKEN
});



// Define the sender details
const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test"
};

// Export the client and sender details
module.exports = {
  mailtrapClient,
  sender
};
