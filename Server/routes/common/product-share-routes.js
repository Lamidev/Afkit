const express = require("express");
const router = express.Router();
const Product = require("../../models/products"); // Your product model

// Product share page with dynamic meta tags
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.redirect('https://afkit.ng');
    }

    // Fetch product from database
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.redirect('https://afkit.ng');
    }

    // Get the first product image or fallback to logo
    let imageUrl;
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
    } else {
      imageUrl = "https://afkit.ng/apple-touch-icon.png"; // Fallback to your logo
    }

    // Format price
    const priceFormatted = new Intl.NumberFormat('en-NG').format(product.price);
    const description = `Buy ${product.title} for ₦${priceFormatted} | AFKiT - Quality Electronics & Gadgets`;

    // Generate the HTML with dynamic meta tags
    const html = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <title>${product.title} - AFKiT</title>
    <meta name="description" content="${description}">
    
    <!-- Essential Open Graph Tags -->
    <meta property="og:title" content="${product.title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://afkit.ng/share/product/${productId}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="AFKiT">
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${product.title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="@afkit">
    
    <!-- Redirect to actual product page -->
    <meta http-equiv="refresh" content="0; url=https://afkit.ng/shop/product/${productId}">
    
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${product.title}</h1>
        <p>Price: ₦${priceFormatted}</p>
        <p>Redirecting to product page...</p>
        <a href="https://afkit.ng/shop/product/${productId}" style="color: white; text-decoration: underline;">
            Click here if not redirected
        </a>
    </div>
    
    <script>
        // Immediate redirect
        window.location.href = 'https://afkit.ng/shop/product/${productId}';
    </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Product share error:', error);
    res.redirect('https://afkit.ng');
  }
});

module.exports = router;