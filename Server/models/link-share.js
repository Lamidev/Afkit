const mongoose = require("mongoose");

const LinkShareSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming you have a Product model
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    sharedBy: {
      // Can be userId for authenticated users or sessionId for guests
      type: String,
      required: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    shareDestination: {
      type: String, // e.g., "WhatsApp", "Instagram", "CopyLink"
      required: true,
    },
    sourcePage: {
      type: String, // e.g., "ProductDetails", "Checkout"
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const LinkShare = mongoose.model("LinkShare", LinkShareSchema);
module.exports = LinkShare;