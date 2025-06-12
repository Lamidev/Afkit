const express = require("express");
const router = express.Router();
const Product = require("../../models/products"); // adjust path if needed

const BASE_URL = "https://afkit.ng";

router.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find({}, "_id"); // or use slug if available

    let urls = [
      `${BASE_URL}/shop/home`,
      `${BASE_URL}/shop/listing`,
      `${BASE_URL}/shop/about`,
      `${BASE_URL}/shop/search`,
    ];

    products.forEach((product) => {
      urls.push(`${BASE_URL}/shop/product/${product._id}`);
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
</url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemapXml);
  } catch (err) {
    console.error("Failed to generate sitemap", err);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
