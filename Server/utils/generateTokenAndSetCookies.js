

// const jwt = require("jsonwebtoken");

// const generateTokenAndSetCookie = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "6h", // or "1d" for 1 day
//   });
  
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict", // Prevents CSRF attacks
//     maxAge: 6 * 60 * 60 * 1000, // 6h (match expiresIn)
//   });
  
//     return token;
//   };
  
//   module.exports = {generateTokenAndSetCookie};

const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "6h", // Or "1d" for 1 day, adjust as needed
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JS access to the cookie
    // IMPORTANT: secure should be true in production (when NODE_ENV is 'production')
    secure: process.env.NODE_ENV === "production",
    // Use 'Lax' for better compatibility in production, 'strict' locally.
    // If your frontend and backend are on completely different domains (e.g., app.example.com and api.example.com),
    // and you need to send cookies for cross-site requests, you might need "None" with secure: true.
    sameSite: process.env.NODE_ENV === "production" ? "Lax" : "strict",
    // Set the domain explicitly for production to .afkik.ng (with leading dot for subdomains like www)
    // On localhost, it should automatically work for localhost.
    domain: process.env.NODE_ENV === "production" ? ".afkit.ng" : undefined, // 'undefined' lets it default for localhost
    maxAge: 6 * 60 * 60 * 1000, // 6 hours (match expiresIn)
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };