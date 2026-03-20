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
    if (cleanedKeyword.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const words = cleanedKeyword.split(/\s+/).filter(w => w.length > 0);
    const wordRegexes = words.map(word => new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i"));

    // Logic: Each word in the search query MUST appear in at least one of the searchable fields.
    // This allows searching for "HP 840 G7" and finding products where these words appear in any order.
    const createSearchQuery = {
      $and: [
        { isHidden: { $ne: true } },
        {
          $and: wordRegexes.map(r => ({
            $or: [
              { title: r },
              { description: r },
              { brand: r },
              { category: r }
            ]
          }))
        }
      ]
    };

    const searchResults = await Product.find(createSearchQuery);

    // Prioritize exact phrase matches in title
    const exactPhraseRegex = new RegExp(cleanedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    
    const sortedResults = searchResults.sort((a, b) => {
      const aExact = exactPhraseRegex.test(a.title);
      const bExact = exactPhraseRegex.test(b.title);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
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