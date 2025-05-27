const Product = require("../../models/products");

const getFilteredProducts = async (req, res) => {
  try {
    const { 
      category = [], 
      brand = [], 
      condition = [], 
      storage = [],  // Add storage filter
      minPrice,      // Add minPrice filter
      maxPrice,      // Add maxPrice filter
      sortBy = "price-lowtohigh" 
    } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    if (condition.length) {
      filters.condition = { $in: condition.split(",") };
    }

    if (storage.length) {  // Add storage filter
      filters.storage = { $in: storage.split(",") };
    }

    // Add price range filter
    if (minPrice && maxPrice) {
      filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filters.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filters.price = { $lte: Number(maxPrice) };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};


const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// const getProductsByBrand = async (req, res) => {
//   try {
//     const { brand } = req.query;

//     const products = await Product.find({ brand });

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.query;
    
    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand parameter is required",
      });
    }

    const products = await Product.find({ brand });
    
    res.status(200).json({
      success: true,
      data: products, // Make sure this matches what your Redux expects
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = {
  getFilteredProducts,
  getProductDetails,
  getProductsByBrand, // 👈 include here
};
