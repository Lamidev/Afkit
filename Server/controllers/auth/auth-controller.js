

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/users");
const {
  generateTokenAndSetCookie,
} = require("../../utils/generateTokenAndSetCookies");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../../mailtrap/emails");

// Register User
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });

    const hashPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      role: "user",
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();
    generateTokenAndSetCookie(res, newUser._id);
    await sendVerificationEmail(newUser.email, verificationToken);

    const user = newUser.toObject();
    user.id = user._id;
    delete user._id;

    res.status(200).json({
      success: true,
      message: "Registration successful. Check your email for verification.",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Resend Verification Code
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is already verified" 
      });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
    await user.save();
    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ 
      success: true, 
      message: "Verification code resent successfully" 
    });
  } catch (error) {
    console.error("Error in resendVerificationCode:", error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while resending verification code" 
    });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.userName);

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User doesn't exist!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.json({ success: false, message: "Incorrect password!" });

    const now = new Date();
    user.lastLogin = now;
    user.lastActive = now;
    await user.save();

    const token = generateTokenAndSetCookie(res, user._id);

    const userData = user.toObject();
    userData.id = userData._id;
    delete userData._id;

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userData,
      token // Optional: Only if you need it in response
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    })
    .json({ success: true, message: "Logged out successfully!" });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! No token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found for token.",
      });
    }

    const now = new Date();
    const lastActiveTime = req.user.lastActive ? new Date(req.user.lastActive) : null;

    // Update lastActive if more than 1 minute passed
    if (!lastActiveTime || now - lastActiveTime > 60000) {
      await User.findByIdAndUpdate(decoded.userId, {
        $set: { lastActive: now },
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Optional Auth Middleware
const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      req.userId = null;
      req.user = null;
    }
  } else {
    req.userId = null;
    req.user = null;
  }
  next();
};

// Check Auth
const checkAuth = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const userData = user.toObject();
    userData.id = userData._id;
    delete userData._id;

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  authMiddleware,
  optionalAuthMiddleware,
  checkAuth,
};