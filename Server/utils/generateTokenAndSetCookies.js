// const jwt = require("jsonwebtoken");

// const generateTokenAndSetCookie = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "6h",
//   });

//   const isProduction = process.env.NODE_ENV === "production";
//   const cookieOptions = {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? 'none' : 'lax',
//     maxAge: 6 * 60 * 60 * 1000,
//     path: '/',
//   };

//   if (isProduction) {
//     cookieOptions.domain = '.afkit.ng';
//   }

//   res.cookie("token", token, cookieOptions);
//   return token;
// };

// module.exports = { generateTokenAndSetCookie };


// utils/generateTokenAndSetCookies.js
const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    // 'none' for cross-site in production (requires secure: true)
    // 'lax' for same-site in development (default, allows some cross-site with initial navigation)
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 6 * 60 * 60 * 1000, // 6 hours
    path: '/',
  };

  if (isProduction && process.env.COOKIE_DOMAIN) { // Only set domain if in production AND domain is provided
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie("token", token, cookieOptions);
  return token;
};

module.exports = { generateTokenAndSetCookie };