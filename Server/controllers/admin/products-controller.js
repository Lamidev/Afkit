

const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/products");

// Single image upload handler (UNCHANGED)
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided."
      });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the image",
    });
  }
}

// Multiple image upload handler (UNCHANGED)
const handleMultipleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided."
      });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 4 images allowed"
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
      images: uploadedImages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading images",
    });
  }
}

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
      displayType,
      laptopType,
      totalStock,
      condition,
    } = req.body;

    if (!title || !description || !category || !brand || 
        price == null || totalStock == null || !condition || 
        !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product details and at least one image."
      });
    }

    const cleanedData = {
      images,
      title,
      description,
      category,
      brand,
      price,
      storage,
      ram,
      processor: category === 'laptops' ? processor : undefined,
      displayType: category === 'laptops' ? displayType : undefined,
      laptopType: category === 'laptops' ? laptopType : undefined,
      totalStock,
      condition
    };

    if (category === 'laptops' && !processor) {
      return res.status(400).json({
        success: false,
        message: "Processor is required for laptops"
      });
    }

    if (category === 'laptops' && !laptopType) {
      return res.status(400).json({
        success: false,
        message: "Laptop type is required for laptops"
      });
    }

    if (['laptops', 'smartphones'].includes(category) && !ram) {
      return res.status(400).json({
        success: false,
        message: "RAM is required for this category"
      });
    }

    if (category === 'laptops' && !storage) {
      return res.status(400).json({
        success: false,
        message: "Storage is required for laptops"
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
      error: e.message
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
      displayType,
      laptopType,
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
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = (price === 0 || price) ? price : findProduct.price;
    findProduct.storage = storage || findProduct.storage;
    findProduct.ram = ram || findProduct.ram;
    findProduct.processor = category === 'laptops' ? (processor || findProduct.processor) : undefined;
    findProduct.displayType = category === 'laptops' ? (displayType || findProduct.displayType) : undefined;
    findProduct.laptopType = category === 'laptops' ? (laptopType || findProduct.laptopType) : undefined;
    findProduct.totalStock = (totalStock === 0 || totalStock) ? totalStock : findProduct.totalStock;
    findProduct.condition = condition || findProduct.condition;

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
      error: e.message
    });
  }
};

// UNCHANGED functions below
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
      error: e.message
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
      error: e.message
    });
  }
};

module.exports = {
  handleImageUpload,
  handleMultipleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct
};