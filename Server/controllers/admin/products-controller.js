
const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/products");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the image",
    });
  }
};

const handleMultipleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided.",
      });
    }

    if (req.files.length > 8) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 8 images allowed",
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = "data:" + file.mimetype + ";base64," + b64;
      const result = await imageUploadUtil(url);
      return result.secure_url;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading images",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      images,
      title,
      description,
      category,
      brand,
      price,
      storage,
      ram,
      processor,
      extraFeatures,
      laptopType,
      screenSize,
      frameStyle,
      screenResolution,
      ports,
      monitorType,
      accessoryCategory,
      specificAccessory,
      totalStock,
      condition,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      price == null ||
      totalStock == null ||
      !condition ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all common required product details and at least one image.",
      });
    }

    const cleanedData = {
      images,
      title,
      description,
      category,
      price,
      totalStock,
      condition,
      isHidden: false,
      ...(category === "smartphones" ||
      category === "laptops" ||
      category === "monitors"
        ? { brand }
        : {}),
      ...(["smartphones", "laptops"].includes(category)
        ? { storage, ram }
        : {}),
      ...(category === "laptops"
        ? { processor, extraFeatures, laptopType }
        : {}),
      ...(category === "monitors"
        ? { screenSize, frameStyle, screenResolution, ports, monitorType }
        : {}),
      ...(category === "accessories"
        ? { accessoryCategory, specificAccessory }
        : {}),
    };

    if (["smartphones", "laptops", "monitors"].includes(category) && !brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is required for this category.",
      });
    }
    if (["laptops", "smartphones"].includes(category) && (!ram || !storage)) {
      return res.status(400).json({
        success: false,
        message: "RAM and Storage are required for this category.",
      });
    }
    if (
      category === "laptops" &&
      (!processor || !extraFeatures || !laptopType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Processor, Extra Features, and Laptop Type are required for laptops.",
      });
    }
    if (
      category === "monitors" &&
      (!screenSize ||
        !frameStyle ||
        !screenResolution ||
        !ports ||
        !monitorType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Screen Size, Frame Style, Screen Resolution, Ports, and Monitor Type are required for monitors.",
      });
    }
    if (
      category === "accessories" &&
      (!accessoryCategory || !specificAccessory)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Accessory Category and Specific Accessory are required for accessories.",
      });
    }

    const newlyCreatedProduct = new Product(cleanedData);
    await newlyCreatedProduct.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding the product.",
      error: e.message,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      images,
      title,
      description,
      category,
      brand,
      price,
      storage,
      ram,
      processor,
      extraFeatures,
      laptopType,
      screenSize,
      frameStyle,
      screenResolution,
      ports,
      monitorType,
      accessoryCategory,
      specificAccessory,
      totalStock,
      condition,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.images = images || findProduct.images;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.price = price === 0 || price ? price : findProduct.price;
    findProduct.totalStock =
      totalStock === 0 || totalStock ? totalStock : findProduct.totalStock;
    findProduct.condition = condition || findProduct.condition;

    findProduct.brand = undefined;
    findProduct.storage = undefined;
    findProduct.ram = undefined;
    findProduct.processor = undefined;
    findProduct.extraFeatures = undefined;
    findProduct.laptopType = undefined;
    findProduct.screenSize = undefined;
    findProduct.frameStyle = undefined;
    findProduct.screenResolution = undefined;
    findProduct.ports = undefined;
    findProduct.monitorType = undefined;
    findProduct.accessoryCategory = undefined;
    findProduct.specificAccessory = undefined;

    if (["smartphones", "laptops", "monitors"].includes(findProduct.category)) {
      findProduct.brand = brand;
    }
    if (["smartphones", "laptops"].includes(findProduct.category)) {
      findProduct.storage = storage;
      findProduct.ram = ram;
    }
    if (findProduct.category === "laptops") {
      findProduct.processor = processor;
      findProduct.extraFeatures = extraFeatures;
      findProduct.laptopType = laptopType;
    }
    if (findProduct.category === "monitors") {
      findProduct.screenSize = screenSize;
      findProduct.frameStyle = frameStyle;
      findProduct.screenResolution = screenResolution;
      findProduct.ports = ports;
      findProduct.monitorType = monitorType;
    }
    if (findProduct.category === "accessories") {
      findProduct.accessoryCategory = accessoryCategory;
      findProduct.specificAccessory = specificAccessory;
    }

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while editing the product.",
      error: e.message,
    });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products.",
      error: e.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: e.message,
    });
  }
};

const hideProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isHidden: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product hidden successfully",
      data: product,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while hiding the product.",
      error: e.message,
    });
  }
};

const unhideProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isHidden: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product unhidden successfully",
      data: product,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while unhiding the product.",
      error: e.message,
    });
  }
};

module.exports = {
  handleImageUpload,
  handleMultipleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  hideProduct,
  unhideProduct,
};