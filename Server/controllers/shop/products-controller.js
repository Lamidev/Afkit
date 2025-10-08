

const Product = require("../../models/products");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      brand = [],
      condition = [],
      storage = [],
      ram = [],
      processor = [],
      extraFeatures = [],
      laptopType = [],
      screenSize = [],
      frameStyle = [],
      screenResolution = [],
      ports = [],
      monitorType = [],
      accessoryCategory = [],
      specificAccessory = [],
      minPrice,
      maxPrice,
      sortBy = "price-hightolow fi",
    } = req.query;

    let filters = { isHidden: { $ne: true } };

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    if (condition.length) {
      filters.condition = { $in: condition.split(",") };
    }

    if (storage.length) {
      filters.storage = { $in: storage.split(",") };
    }

    if (ram.length) {
      filters.ram = { $in: ram.split(",") };
    }
    if (processor.length) {
      filters.processor = { $in: processor.split(",") };
    }
    if (extraFeatures.length) {
      filters.extraFeatures = { $in: extraFeatures.split(",") };
    }
    if (laptopType.length) {
      filters.laptopType = { $in: laptopType.split(",") };
    }
    if (screenSize.length) {
      filters.screenSize = { $in: screenSize.split(",") };
    }
    if (frameStyle.length) {
      filters.frameStyle = { $in: frameStyle.split(",") };
    }
    if (screenResolution.length) {
      filters.screenResolution = { $in: screenResolution.split(",") };
    }
    if (ports.length) {
      filters.ports = { $in: ports.split(",") };
    }
    if (monitorType.length) {
      filters.monitorType = { $in: monitorType.split(",") };
    }
    if (accessoryCategory.length) {
      filters.accessoryCategory = { $in: accessoryCategory.split(",") };
    }
    if (specificAccessory.length) {
      filters.specificAccessory = { $in: specificAccessory.split(",") };
    }

    if (minPrice && maxPrice) {
      filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filters.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filters.price = { $lte: Number(maxPrice) };
    }

    let sort = {};

    switch (sortBy) {
      case "latest-arrival":
        sort.createdAt = -1;
        break;
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      default:
        sort.createdAt = -1;
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
    const product = await Product.findOne({ _id: id, isHidden: { $ne: true } });

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

const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand parameter is required",
      });
    }

    const products = await Product.find({ brand, isHidden: { $ne: true } });

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

module.exports = {
  getFilteredProducts,
  getProductDetails,
  getProductsByBrand,
};