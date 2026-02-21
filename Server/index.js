const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes")
const adminProductsRouter = require("./routes/admin/products-routes");
const adminUserStatsRouter = require("./routes/admin/user-stats-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes")
const shopNewsletterRouter = require("./routes/shop/newsletter-routes")
const shopDebateRouter = require("./routes/shop/debate-routes")
const adminDebateRouter = require("./routes/admin/debate-routes")
const commonFeaturesRouter = require("./routes/common/features-routes")
const sitemapRouter = require("./routes/common/sitemap-routes")
const shareRouter = require("./routes/common/share-routes");
const shareOGRouter = require("./routes/common/share-og-routes");
const commonNotificationRouter = require("./routes/common/notification-routes");

const dbURL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express(); // Initialize the Express app
    const PORT = process.env.PORT || 9050;

    // Trust proxy for rate limiting (essential for Render/Heroku/Nginx)
    app.set("trust proxy", 1);

    // Middleware setup
    app.use(
      cors({
        origin: [
          "https://afkit.ng",
          "https://www.afkit.ng",
          "http://localhost:5173"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
    app.use("/api/admin/user-stats", adminUserStatsRouter);
    app.use("/api/admin/orders", adminOrderRouter);
    app.use("/api/shop/products", shopProductsRouter);
    app.use("/api/shop/cart", shopCartRouter);
    app.use("/api/shop/address", shopAddressRouter);
    app.use("/api/shop/order", shopOrderRouter);
    app.use("/api/shop/search", shopSearchRouter);
    app.use("/api/shop/newsletter", shopNewsletterRouter);
    app.use("/api/shop/debate", shopDebateRouter);
    app.use("/api/admin/debate", adminDebateRouter);
    app.use("/api/common/features", commonFeaturesRouter);
    app.use("/", sitemapRouter)
    app.use("/api/shares", shareRouter);
    app.use("/api/og", shareOGRouter);
    app.use("/api/common/notifications", commonNotificationRouter);

    // Start the server
    app.listen(PORT, () =>
      console.log(`😍😍 Server is now running on port ${PORT} 🎉🥳`)
    );
  })
  .catch((error) => console.error("Failed to connect to MongoDB", error));
