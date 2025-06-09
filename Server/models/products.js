

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      validate: {
        validator: function(array) {
          return array.length <= 8;
        },
        message: "Maximum of 8 images allowed"
      }
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["smartphones", "laptops", "monitors", "accessories"],
      required: true
    },
    brand: {
      type: String,
      enum: ["apple", "samsung", "dell", "hp", "lenovo", "google-pixel", "asus", "lg"], // Updated: changed 'google' to 'google-pixel'
      required: function() {
        return ["smartphones", "laptops", "monitors"].includes(this.category);
      }
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    storage: {
      type: String,
      enum: [
        "64GB", "128GB", "256GB", "512GB", "1TB", "2TB",
        "128GB-SSD", "256GB-SSD", "512GB-SSD", "1TB-SSD",
        "500GB-HDD", "1TB-HDD", "2TB-HDD"
      ],
      required: function() {
        return ["smartphones", "laptops"].includes(this.category);
      }
    },
    ram: {
      type: String,
      enum: ["4GB", "6GB", "8GB", "12GB", "16GB", "32GB", "64GB"],
      required: function() {
        return ["laptops", "smartphones"].includes(this.category);
      }
    },
    processor: {
      type: String,
      enum: [
        "intel-i3", "intel-i5", "intel-i7", "intel-i9",
        "intel-celeron", "intel-pentium",
        "amd-ryzen3", "amd-ryzen5", "amd-ryzen7",
        "apple-m1", "apple-m2"
      ],
      required: function() { return this.category === 'laptops'; }
    },
    extraFeatures: { // Renamed from displayType
      type: String,
      enum: ["non-touchscreen", "touchscreen", "x360-convertible"],
      required: function() { return this.category === 'laptops'; }
    },
    laptopType: {
      type: String,
      enum: ["basic", "business", "gaming"],
      required: function() { return this.category === 'laptops'; }
    },
    // NEW: Monitor-specific fields
    screenSize: {
      type: String,
      enum: ["24", "27", "28", "32", "34"], // Assuming these are in inches
      required: function() { return this.category === 'monitors'; }
    },
    frameStyle: {
      type: String,
      enum: ["thick", "tiny", "frameless"],
      required: function() { return this.category === 'monitors'; }
    },
    screenResolution: {
      type: String,
      enum: ["1080p", "2k", "4k"],
      required: function() { return this.category === 'monitors'; }
    },
    ports: {
      type: String, // Assuming single port for now, can be array if multiple
      enum: ["hdmi", "type-c", "display-port", "vga", "usb"],
      required: function() { return this.category === 'monitors'; }
    },
    monitorType: { // NEW: Monitor sub-category field
      type: String,
      enum: ["office-monitors", "gaming-monitors", "curved-monitors"],
      required: function() { return this.category === 'monitors'; }
    },
    // NEW: Accessory-specific fields
    accessoryCategory: {
      type: String,
      enum: ["smartphone-accessories", "laptop-accessories", "monitor-accessories", "other-accessories"],
      required: function() { return this.category === 'accessories'; }
    },
    specificAccessory: {
      type: String,
      enum: [
        "charger", "screen-protector", "pouch", // Smartphone accessories
        "laptop-bag", "flash-drive", "laptop-charger", "laptop-stand", // Laptop accessories
        "hdmi-cable", "ports-converter", // Monitor accessories
        "external-hdd", "external-ssd", "chargers", "gaming-mouse", "gaming-laptop" // Other accessories
      ],
      required: function() { return this.category === 'accessories'; }
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0
    },
    condition: {
      type: String,
      enum: ["Brand New", "UK Used"],
      default: "Brand New"
    },
    specifications: {
      type: Map,
      of: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);