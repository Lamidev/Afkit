const express = require("express");
const router = express.Router();
const Product = require("../../models/products");

router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).send("Product not found");

        const description = `Buy ${product.title} for ₦${Number(product.price).toLocaleString("en-NG")}`;
        const mainImage = product.images?.[0] || product.image || "https://afkit.ng/default-og.png";
        const productUrl = `https://afkit.ng/shop/product/${product._id}`;

        const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${product.title} - AFKiT</title>
        <meta name="description" content="${description}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="product">
        <meta property="og:url" content="${productUrl}">
        <meta property="og:title" content="${product.title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${mainImage}">
        <meta property="og:site_name" content="AFKiT">
        <meta property="product:price:amount" content="${product.price}">
        <meta property="product:price:currency" content="NGN">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${productUrl}">
        <meta name="twitter:title" content="${product.title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${mainImage}">

        <!-- Redirect to actual product page -->
        <script>
            window.location.href = "${productUrl}";
        </script>
      </head>
      <body>
        <p>Redirecting to <a href="${productUrl}">${product.title}</a>...</p>
      </body>
    </html>`;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
