const express = require("express");
const router = express.Router();
const Product = require("../../models/products");

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    const getAbsoluteImageUrl = (url) => {
      if (!url) return "https://afkit.ng/default-product.png";
      if (url.startsWith("http")) return url;
      const apiBase = process.env.VITE_API_BASE_URL || "https://afkit.ng";
      return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const imageUrl = getAbsoluteImageUrl(product.images?.[0] || product.image);
    const description = product.description 
      ? product.description.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..."
      : `Buy ${product.title} for ₦${Number(product.price).toLocaleString("en-NG")} at Afkit. 6-Month Warranty & Free Delivery.`;

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
          <meta property="og:site_name" content="Afkit Gadgets" />

          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${product.title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
        </head>
        <body>
          <script>
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
