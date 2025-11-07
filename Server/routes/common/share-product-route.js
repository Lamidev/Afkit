const express = require("express");
const router = express.Router();
const Product = require("../../models/products");

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    const imageUrl = product.images?.[0] || product.image || "https://afkit.ng/default-product.png";
    const description = product.description || `Buy ${product.title} for ₦${Number(product.price).toLocaleString("en-NG")}`;

    const frontendBaseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://afkit.ng";

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${product.title} - Afkit</title>

          <!-- Open Graph -->
          <meta property="og:title" content="${product.title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${frontendBaseUrl}/shop/product/${product._id}" />
          <meta property="og:type" content="product" />

          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${product.title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
        </head>
        <body>
          <script>
            // Redirect users to SPA product page
            window.location.href = "${frontendBaseUrl}/shop/product/${product._id}";
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
