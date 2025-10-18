// const express = require("express");
// const router = express.Router();
// const Product = require("../../models/products"); // Adjust path if needed

// // This route returns proper OG meta tags for social sharing
// router.get("/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // Full image URL (make sure to replace with your actual domain)
//     const imageUrl = product.image?.startsWith("http")
//       ? product.image
//       : `https://afkit.ng/${product.image}`;

//     // Return HTML with Open Graph meta tags
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${product.title}</title>
//         <meta name="description" content="${product.description.slice(0, 150)}">

//         <!-- Open Graph / Facebook / WhatsApp -->
//         <meta property="og:type" content="product" />
//         <meta property="og:title" content="${product.title}" />
//         <meta property="og:description" content="${product.description.slice(0, 150)}" />
//         <meta property="og:image" content="${imageUrl}" />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:url" content="https://afkit.ng/shop/product/${product._id}" />
//         <meta property="og:site_name" content="Afkit" />

//         <!-- Twitter -->
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="${product.title}" />
//         <meta name="twitter:description" content="${product.description.slice(0, 150)}" />
//         <meta name="twitter:image" content="${imageUrl}" />

//         <script>
//           // Redirect humans to the actual React route
//           window.location.href = "https://afkit.ng/shop/product/${product._id}";
//         </script>
//       </head>
//       <body>
//         <p>Redirecting...</p>
//       </body>
//       </html>
//     `);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating share preview");
//   }
// });

// module.exports = router;
