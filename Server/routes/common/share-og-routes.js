const express = require("express");
const router = express.Router();
const Product = require("../../models/products");

// Helper to escape HTML characters for safety
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).send("Product not found");

        const price = Number(product.price).toLocaleString("en-NG");
        // Enhanced description for better link preview
        const description = `₦${price} | ${product.title}. Premium UK Used Gadgets on AFKiT. 6 Months Warranty. Pay on Delivery.`;

        const mainImage = product.images?.[0] || product.image || "https://afkit.ng/default-og.png";
        const productUrl = `https://afkit.ng/shop/product/${product._id}`;

        // Escaped values for HTML attributes
        const safeTitle = escapeHtml(product.title);
        const safeDescription = escapeHtml(description);
        const safeImage = escapeHtml(mainImage);

        const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${safeTitle} - AFKiT</title>
        <meta name="description" content="${safeDescription}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="product">
        <meta property="og:url" content="${productUrl}">
        <meta property="og:title" content="${safeTitle}">
        <meta property="og:description" content="${safeDescription}">
        <meta property="og:image" content="${safeImage}">
        <meta property="og:site_name" content="AFKiT">
        <meta property="product:price:amount" content="${product.price}">
        <meta property="product:price:currency" content="NGN">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${productUrl}">
        <meta name="twitter:title" content="${safeTitle}">
        <meta name="twitter:description" content="${safeDescription}">
        <meta name="twitter:image" content="${safeImage}">

        <!-- Styled Redirect Page -->
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            color: #1f2937;
          }
          .card {
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            max-width: 420px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .product-img {
            width: 180px;
            height: 180px;
            object-fit: contain;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            background-color: #f3f4f6;
            padding: 10px;
          }
          h1 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            line-height: 1.4;
          }
          .price {
            font-size: 1.5rem;
            font-weight: 800;
            color: #2563eb;
            margin-bottom: 1.5rem;
          }
          .spinner-container {
            margin: 1rem 0;
          }
          .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .footer {
            margin-top: 1.5rem;
            font-size: 0.875rem;
            color: #6b7280;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>

        <script>
            // Immediate redirect
            window.location.href = "${productUrl}";
        </script>
      </head>
      <body>
        <div class="card">
          <img src="${safeImage}" alt="${safeTitle}" class="product-img">
          <h1>${safeTitle}</h1>
          <div class="price">₦${price}</div>
          
          <div class="spinner-container">
            <div class="spinner"></div>
          </div>
          
          <div class="footer">
            <p>Taking you to the store...</p>
            <p>If not redirected, <a href="${productUrl}">click here</a>.</p>
          </div>
        </div>
      </body>
    </html>`;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
