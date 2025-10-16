const Product = require("../../models/products");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false, // Fixed typo: 'succes' to 'success'
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $and: [
        {
          $or: [
            { title: regEx },
            { description: regEx },
            { category: regEx },
            { brand: regEx },
          ]
        },
        { isHidden: { $ne: true } } // ← ADD THIS FILTER
      ]
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
};

module.exports = { searchProducts };
