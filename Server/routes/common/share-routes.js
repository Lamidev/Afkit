// const express = require("express");
// const router = express.Router();
// const { recordLinkShare } = require("../../controllers/common/share-controller"); // Adjust path as needed
// const { optionalAuthMiddleware } = require("../../controllers/auth/auth-controller"); // Assuming optionalAuthMiddleware path

// router.post("/record", optionalAuthMiddleware, recordLinkShare);

// module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { recordLinkShare } = require("../../controllers/common/share-controller");
const { optionalAuthMiddleware } = require("../../controllers/auth/auth-controller");
const Product = require("../../models/products"); // Make sure this path is correct

// Your existing route
router.post("/record", optionalAuthMiddleware, recordLinkShare);

// ✅ ADD THIS PRODUCT SHARE ROUTE
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log("🔄 Product share route called for:", productId);
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("❌ Invalid product ID");
      return res.redirect('https://afkit.ng');
    }

    // Fetch product from database
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log("❌ Product not found");
      return res.redirect('https://afkit.ng');
    }

    console.log("✅ Product found:", product.title);

    // Get the first product image
    let imageUrl = "https://afkit.ng/apple-touch-icon.png"; // Fallback
    
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage.startsWith("http")) {
        imageUrl = firstImage;
      } else if (firstImage.startsWith("/")) {
        imageUrl = `https://afkit.ng${firstImage}`;
      } else {
        imageUrl = `https://afkit.ng/${firstImage}`;
      }
    } else if (product.image) {
      if (product.image.startsWith("http")) {
        imageUrl = product.image;
      } else if (product.image.startsWith("/")) {
        imageUrl = `https://afkit.ng${product.image}`;
      } else {
        imageUrl = `https://afkit.ng/${product.image}`;
      }
    }

    console.log("🖼️ Image URL:", imageUrl);

    // Format price and description
    const priceFormatted = new Intl.NumberFormat('en-NG').format(product.price);
    const description = `Buy ${product.title} for ₦${priceFormatted} | AFKiT - Quality Electronics & Gadgets`;

    // Generate HTML with meta tags

const html = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <title>${product.title} - AFKiT</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${product.title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://afkit.ng/api/shares/product/${productId}"> <!-- ✅ FIXED -->
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="AFKiT">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${product.title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Redirect to actual product page -->
    <meta http-equiv="refresh" content="0; url=https://afkit.ng/shop/product/${productId}">
</head>
<body>
    <script>
        window.location.href = 'https://afkit.ng/shop/product/${productId}';
    </script>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>${product.title}</h1>
        <p>Price: ₦${priceFormatted}</p>
        <p>Redirecting to product page...</p>
        <a href="https://afkit.ng/shop/product/${productId}">
            Click here if not redirected
        </a>
    </div>
</body>
</html>
`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('❌ Product share error:', error);
    res.redirect('https://afkit.ng');
  }
});

module.exports = router;