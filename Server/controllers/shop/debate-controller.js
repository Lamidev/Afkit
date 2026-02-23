const DebateRegistration = require("../../models/debate-registration");
const {
  sendDebateThankYouEmail,
  sendDebateAdminNotificationEmail,
} = require("../../mailtrap/emails");

// ─── Register for Debate Campaign ────────────────────────────────────────────
exports.registerForDebate = async (req, res) => {
  try {
    const { fullName, phone, email, tikTokHandle, instagramHandle, brandToDefend } = req.body;

    // Basic validation
    if (!fullName || !phone || !email || !tikTokHandle || !instagramHandle || !brandToDefend) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to participate.",
      });
    }

    // Check for duplicate registration by email
    const existing = await DebateRegistration.findOne({
      email: email.toLowerCase(),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "This email has already been registered for the debate campaign.",
      });
    }

    // Save to database
    const registration = await DebateRegistration.create({
      fullName,
      phone,
      email: email.toLowerCase(),
      tikTokHandle,
      instagramHandle,
      brandToDefend,
    });

    // Send thank-you email to the participant (non-blocking)
    sendDebateThankYouEmail(registration);

    // Notify admin at info@afkit.ng (non-blocking)
    sendDebateAdminNotificationEmail(registration);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! A confirmation email has been sent to you.",
      data: registration,
    });
  } catch (error) {
    console.error("Debate registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

// ─── Get All Debate Registrations (Admin only) ───────────────────────────────
exports.getAllDebateRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      DebateRegistration.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DebateRegistration.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: registrations,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching debate registrations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
    });
  }
};

// ─── Delete Debate Registration (Admin only) ─────────────────────────────────
exports.deleteDebateRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await DebateRegistration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting debate registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the registration.",
    });
  }
};
