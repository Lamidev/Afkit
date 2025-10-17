// const Product = require("../../models/products");

// const searchProducts = async (req, res) => {
//   try {
//     const { keyword } = req.params;
    
//     if (!keyword || typeof keyword !== "string") {
//       return res.status(400).json({
//         success: false, // Fixed typo: 'succes' to 'success'
//         message: "Keyword is required and must be in string format",
//       });
//     }

//     const regEx = new RegExp(keyword, "i");

//     const createSearchQuery = {
//       $and: [
//         {
//           $or: [
//             { title: regEx },
//             { description: regEx },
//             { category: regEx },
//             { brand: regEx },
//           ]
//         },
//         { isHidden: { $ne: true } } // ← ADD THIS FILTER
//       ]
//     };

//     const searchResults = await Product.find(createSearchQuery);

//     res.status(200).json({
//       success: true,
//       data: searchResults,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error searching products",
//     });
//   }
// };

// module.exports = { searchProducts };


const Product = require("../../models/products");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const cleanedKeyword = keyword.trim();
    
    // Create regex pattern that matches the exact phrase in title only
    const exactPhraseRegex = new RegExp(cleanedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    
    // Also create a flexible pattern that allows for variations in spacing/special characters
    const flexibleRegex = new RegExp(cleanedKeyword.replace(/\s+/g, '\\s*'), "i");

    const createSearchQuery = {
      $and: [
        {
          $or: [
            { title: exactPhraseRegex },
            { title: flexibleRegex }
          ]
        },
        { isHidden: { $ne: true } }
      ]
    };

    const searchResults = await Product.find(createSearchQuery);

    // Sort by exact match first, then partial matches
    const sortedResults = searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const searchText = cleanedKeyword.toLowerCase();
      
      // Exact match gets highest priority
      if (aTitle === searchText) return -1;
      if (bTitle === searchText) return 1;
      
      // Starts with search text gets next priority
      if (aTitle.startsWith(searchText)) return -1;
      if (bTitle.startsWith(searchText)) return 1;
      
      // Contains search text
      if (aTitle.includes(searchText)) return -1;
      if (bTitle.includes(searchText)) return 1;
      
      return 0;
    });

    res.status(200).json({
      success: true,
      data: sortedResults,
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