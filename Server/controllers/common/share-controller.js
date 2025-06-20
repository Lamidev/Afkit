const LinkShare = require("../../models/link-share");
const Product = require("../../models/products"); // Assuming you have a Product model

const recordLinkShare = async (req, res) => {
  const { productId, shareDestination, sourcePage, sessionId } = req.body;
  const userId = req.user?.id; // From authMiddleware if authenticated

  if (!productId || !shareDestination || !sourcePage) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: productId, shareDestination, sourcePage",
    });
  }

  // Determine who shared the link
  let sharedById = userId || sessionId;
  let isGuest = !userId;

  if (!sharedById) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No user or session ID found.",
    });
  }

  try {
    // Fetch product title for easier logging/display
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newLinkShare = new LinkShare({
      productId,
      productTitle: product.title,
      sharedBy: sharedById,
      isGuest,
      shareDestination,
      sourcePage,
    });

    await newLinkShare.save();

    res.status(201).json({ success: true, message: "Link share recorded successfully" });
  } catch (error) {
    console.error("Error recording link share:", error);
    res.status(500).json({ success: false, message: "Failed to record link share" });
  }
};

module.exports = { recordLinkShare };