// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// require("dotenv").config();
// const authRouter = require("./routes/auth/auth-routes")
// const adminProductsRouter = require("./routes/admin/products-routes");
// const adminUserStatsRouter = require("./routes/admin/user-stats-routes");
// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");
// const shopSearchRouter = require("./routes/shop/search-routes")
// const commonFeaturesRouter = require("./routes/common/features-routes")
// const sitemapRouter = require("./routes/common/sitemap-routes")


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
//     app.use("/api/admin/user-stats",adminUserStatsRouter);
//     app.use("/api/shop/products", shopProductsRouter);
//     app.use("/api/shop/cart", shopCartRouter);
//     app.use("/api/shop/search", shopSearchRouter);
//     app.use("/api/common/features", commonFeaturesRouter);
//     app.use("/", sitemapRouter)
 
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
require("dotenv").config(); // Ensure dotenv is loaded first

// Route imports
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminUserStatsRouter = require("./routes/admin/user-stats-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const commonFeaturesRouter = require("./routes/common/features-routes");
const sitemapRouter = require("./routes/common/sitemap-routes");

const dbURL = process.env.MONGODB_URL; // Fetch the database URL from the environment variables

// Connect to MongoDB
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express(); // Initialize the Express app
    const PORT = process.env.PORT || 9050;

    // CRITICAL: Trust proxy if deployed behind one (e.g., Nginx, cloud load balancer)
    // This correctly determines req.protocol (http/https) and req.ip
    app.set("trust proxy", 1);

    // Middleware setup
    app.use(
      cors({
        origin: [
          "https://afkit.ng",
          "https://www.afkit.ng",
          "http://localhost:5173", // Keep for local development
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Cache-Control",
          "Expires",
          "Pragma",
        ],
        credentials: true, // IMPORTANT: Allows cookies to be sent with cross-origin requests
      })
    );

    app.use(express.json()); // Body parser for JSON
    app.use(cookieParser()); // Cookie parser

    // Route usage
    app.use("/api/auth", authRouter);
    app.use("/api/admin/products", adminProductsRouter);
    app.use("/api/admin/user-stats", adminUserStatsRouter);
    app.use("/api/shop/products", shopProductsRouter);
    app.use("/api/shop/cart", shopCartRouter);
    app.use("/api/shop/search", shopSearchRouter);
    app.use("/api/common/features", commonFeaturesRouter);
    app.use("/", sitemapRouter); // Assuming sitemap is at root

    // Start the server
    app.listen(PORT, () =>
      console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
    );
  })
  .catch((error) => console.error("Failed to connect to MongoDB", error));