// const express = require("express");
// const router = express.Router();
// const Product = require("../../models/products");

// router.get("/product/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).lean();
//     if (!product) return res.status(404).send("Product not found");

//     const description = `Buy ${product.title} for ₦${Number(product.price).toLocaleString("en-NG")}`;
//     const mainImage = product.images?.[0] || product.image || "https://afkit.ng/default-og.png";

//     const html = `<!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <title>${product.title} - AFKiT</title>
//         <meta name="description" content="${description}">
//         <meta property="og:title" content="${product.title}">
//         <meta property="og:description" content="${description}">
//         <meta property="og:image" content="${mainImage}">
//         <meta property="og:url" content="https://afkit.ng/shop/product/${product._id}">
//         <meta property="og:type" content="product">
//         <meta property="og:site_name" content="AFKiT">
//         <meta name="twitter:card" content="summary_large_image">
//         <meta name="twitter:title" content="${product.title}">
//         <meta name="twitter:description" content="${description}">
//         <meta name="twitter:image" content="${mainImage}">
//         <meta property="product:price:amount" content="${product.price}">
//         <meta property="product:price:currency" content="NGN">
//       </head>
//       <body></body>
//     </html>`;

//     res.send(html);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;
