const mongoose = require("mongoose");

const debateRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    tikTokHandle: {
      type: String,
      required: [true, "TikTok handle is required"],
      trim: true,
    },
    instagramHandle: {
      type: String,
      required: [true, "Instagram handle is required"],
      trim: true,
    },
    brandToDefend: {
      type: String,
      required: [true, "Please choose a brand to defend"],
      enum: ["Samsung", "iPhone"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DebateRegistration", debateRegistrationSchema);
