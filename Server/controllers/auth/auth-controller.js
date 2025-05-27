

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../../models/users");
const express = require("express");

const {
  generateTokenAndSetCookie,
} = require("../../utils/generateTokenAndSetCookies");

const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../../mailtrap/emails");

// Register
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
      return res.status(400).json({ success: false, message: "User already exists!" });

    const hashPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
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

// Verify Email
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.userName);

      // Clear any existing tokens before redirecting to login
      res.clearCookie("token");
      
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User doesn't exist!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ success: false, message: "Incorrect password!" });

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    userData.id = userData._id;
    delete userData._id;
    
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userData,
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Logout
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  }).json({ success: true, message: "Logged out successfully!" });
  
};

// Forgot Password
const forgotPassword = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    console.log("Email is missing in request body");
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
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
    console.log("Error in forgotPassword function:", error);
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized! No token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const userData = user.toObject();
    userData.id = userData._id;
    delete userData._id;

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Error in checkAuth:", error); // Log the error
    res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};


module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  authMiddleware,
  checkAuth,
 
};
