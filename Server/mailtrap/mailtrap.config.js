

require("dotenv").config();
const { MailtrapClient } = require("mailtrap");

// Load environment variables
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
let MAILTRAP_ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Ensure credentials exist
if (!MAILTRAP_TOKEN) {
  throw new Error("Missing MAILTRAP_TOKEN in environment variables.");
}

// SDK usually just wants the base URL without /api/send
if (MAILTRAP_ENDPOINT) {
  MAILTRAP_ENDPOINT = MAILTRAP_ENDPOINT.replace(/\/api\/send\/?$/, "");
  MAILTRAP_ENDPOINT = MAILTRAP_ENDPOINT.replace(/\/+$/, "");
}

// If token starts with something specific to sandbox or if user wants to force it
const isSandbox = !MAILTRAP_ENDPOINT || MAILTRAP_ENDPOINT.includes("sandbox");

const mailtrapClient = new MailtrapClient({
  endpoint: MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io",
  token: MAILTRAP_TOKEN
});



// Define the sender details
const sender = {
  email: "hello@afkit.ng",
  name: "Afkit"
};


// Export the client and sender details
module.exports = {
  mailtrapClient,
  sender
};
