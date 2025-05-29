// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// require("dotenv").config();
// const authRouter = require("./routes/auth/auth-routes")
// const adminProductsRouter = require("./routes/admin/products-routes");
// const adminVerifiedUsersRouter = require("./routes/admin/verified-user-routes");
// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");
// const shopSearchRouter = require("./routes/shop/search-routes")
// const commonFeaturesRouter = require("./routes/common/features-routes")


// const dbURL = process.env.MONGODB_URL;

//  // Fetch the database URL from the environment variables

// // Connect to MongoDB
// mongoose
//   .connect(dbURL) // Ensure options are passed
//   .then(() => {
//     console.log("Connected to MongoDB");

//     const app = express(); // Initialize the Express app
//     const PORT = process.env.PORT || 9050;

//     // Middleware setup
//     app.use(
//       cors({
//         origin: [
//           "https://afkit.ng",
//           "https://www.afkit.ng",
//           "http://localhost:5173"
//         ],
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
//     app.use("/api/auth", authRouter);
//     app.use("/api/admin/products", adminProductsRouter);
//     app.use("/api/admin/verified-users",adminVerifiedUsersRouter);
//     app.use("/api/shop/products", shopProductsRouter);
//     app.use("/api/shop/cart", shopCartRouter);
//     app.use("/api/shop/search", shopSearchRouter);
//     app.use("/api/common/features", commonFeaturesRouter);
 
//     // Start the server
//     app.listen(PORT, () =>
//       console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
//     );
//   })
//   .catch((error) => console.error("Failed to connect to MongoDB", error));


const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminVerifiedUsersRouter = require("./routes/admin/verified-user-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const commonFeaturesRouter = require("./routes/common/features-routes");

const dbURL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const app = express();
    const PORT = process.env.PORT || 9050;

    // 🌐 Dynamically determine allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL.replace("https://", "https://www."),
      "http://localhost:5173",
    ];

    // ✅ CORS setup with dynamic origin checking
    app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin (like Postman or curl)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error("Not allowed by CORS"));
          }
        },
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

    // ✅ API Routes
    app.use("/api/auth", authRouter);
    app.use("/api/admin/products", adminProductsRouter);
    app.use("/api/admin/verified-users", adminVerifiedUsersRouter);
    app.use("/api/shop/products", shopProductsRouter);
    app.use("/api/shop/cart", shopCartRouter);
    app.use("/api/shop/search", shopSearchRouter);
    app.use("/api/common/features", commonFeaturesRouter);

    // 🚀 Start the server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} — ready for requests!`)
    );
  })
  .catch((error) => console.error("❌ Failed to connect to MongoDB", error));
