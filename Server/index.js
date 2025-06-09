const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes")
const adminProductsRouter = require("./routes/admin/products-routes");
const adminVerifiedUsersRouter = require("./routes/admin/verified-user-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopSearchRouter = require("./routes/shop/search-routes")
const commonFeaturesRouter = require("./routes/common/features-routes")


const dbURL = process.env.MONGODB_URL;

 // Fetch the database URL from the environment variables

// Connect to MongoDB
mongoose
  .connect(dbURL) // Ensure options are passed
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express(); // Initialize the Express app
    const PORT = process.env.PORT || 9050;

    // Middleware setup
    app.use(
      cors({
        origin: [
          "https://afkit.ng",
          "https://www.afkit.ng",
          "http://localhost:5173"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Cache-Control",
          "Expires",
          "Pragma",
        ],
        credentials: true,
      })
    );
    
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/auth", authRouter);
    app.use("/api/admin/products", adminProductsRouter);
    app.use("/api/admin/verified-users",adminVerifiedUsersRouter);
    app.use("/api/shop/products", shopProductsRouter);
    app.use("/api/shop/cart", shopCartRouter);
    app.use("/api/shop/search", shopSearchRouter);
    app.use("/api/common/features", commonFeaturesRouter);
 
    // Start the server
    app.listen(PORT, () =>
      console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
    );
  })
  .catch((error) => console.error("Failed to connect to MongoDB", error));


// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// require("dotenv").config();

// const authRouter = require("./routes/auth/auth-routes");
// const adminProductsRouter = require("./routes/admin/products-routes");
// const adminVerifiedUsersRouter = require("./routes/admin/verified-user-routes");
// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");
// const shopSearchRouter = require("./routes/shop/search-routes");
// const commonFeaturesRouter = require("./routes/common/features-routes");

// const dbURL = process.env.MONGODB_URL;

// const allowedOrigins = [
//   "https://afkit.ng",
//   "https://www.afkit.ng",
//   "http://localhost:5173",
// ];

// mongoose
//   .connect(dbURL)
//   .then(() => {
//     console.log("Connected to MongoDB");

//     const app = express();
//     const PORT = process.env.PORT || 9050;

//     // Log incoming request origins for debugging (optional)
//     app.use((req, res, next) => {
//       console.log(`Incoming request from origin: ${req.headers.origin}`);
//       next();
//     });

//     // CORS middleware - allow only requests from allowedOrigins
//     app.use(
//       cors({
//         origin: function (origin, callback) {
//           // allow requests with no origin (like curl or mobile apps)
//           if (!origin) return callback(null, true);
//           if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
//             return callback(new Error(msg), false);
//           }
//           return callback(null, true);
//         },
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: [
//           "Content-Type",
//           "Authorization",
//           "Cache-Control",
//           "Expires",
//           "Pragma",
//         ],
//         credentials: true,
//       })
//     );

//     app.use(express.json());
//     app.use(cookieParser());

//     // Routes
//     app.use("/api/auth", authRouter);
//     app.use("/api/admin/products", adminProductsRouter);
//     app.use("/api/admin/verified-users", adminVerifiedUsersRouter);
//     app.use("/api/shop/products", shopProductsRouter);
//     app.use("/api/shop/cart", shopCartRouter);
//     app.use("/api/shop/search", shopSearchRouter);
//     app.use("/api/common/features", commonFeaturesRouter);

//     // Start server
//     app.listen(PORT, () =>
//       console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
//     );
//   })
//   .catch((error) => console.error("Failed to connect to MongoDB", error));
