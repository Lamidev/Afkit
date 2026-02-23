const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
      default: 'lagos'
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    logisticsRoute: {
      type: String,
      required: false,
      default: "lagos",
    },
    phone: {
      type: String,
      required: true,
    },
    backupPhone: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    addressType: {
      type: String,
      enum: ["personal", "recipient"],
      default: "personal",
    },
    isLastUsed: {
      type: Boolean,
      default: false,
    },
    isLastUsedRecipient: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
