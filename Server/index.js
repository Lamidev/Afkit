const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes")
const adminProductsRouter = require("./routes/admin/products-routes");
const adminUserStatsRouter = require("./routes/admin/user-stats-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopSearchRouter = require("./routes/shop/search-routes")
const commonFeaturesRouter = require("./routes/common/features-routes")
const sitemapRouter = require("./routes/common/sitemap-routes")
const shareRouter = require("./routes/common/share-routes");
const shareOGRouter = require("./routes/common/share-og-routes");

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
   // Middleware setup
app.use(
  cors({
    origin: [
      "https://afkit.ng",
      "https://www.afkit.ng",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cache-Control",
      "Expires",
      "Pragma"
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
  })
);
    
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/auth", authRouter);
    app.use("/api/admin/products", adminProductsRouter);
    app.use("/api/admin/user-stats",adminUserStatsRouter);
    app.use("/api/shop/products", shopProductsRouter);
    app.use("/api/shop/cart", shopCartRouter);
    app.use("/api/shop/search", shopSearchRouter);
    app.use("/api/common/features", commonFeaturesRouter);
    app.use("/", sitemapRouter)
    app.use("/api/shares", shareRouter);
    app.use("/og", shareOGRouter);
 
    // Start the server
    app.listen(PORT, () =>
      console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
    );
  })
  .catch((error) => console.error("Failed to connect to MongoDB", error));

  
  