

const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "6h", // or "1d" for 1 day
  });
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 6 * 60 * 60 * 1000, // 6h (match expiresIn)
  });
  
    return token;
  };
  
  module.exports = {generateTokenAndSetCookie};