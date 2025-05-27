// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     image: String,
//     title: String,
//     description: String,
//     category: String,
//     brand: String,
//     price: Number,
//     storage: {
//       type: String,
//       enum: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB" ],
//     },
//     totalStock: Number,
//     condition: {
//       type: String,
//       enum: ["Brand New", "Premium Used"],
//       default: "Brand New",
//     },
    
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      validate: {
        validator: function(array) {
          return array.length <= 4;
        },
        message: "Maximum of 4 images allowed"
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
      enum: ["apple", "samsung", "dell", "hp", "lenovo", "google"],
      required: true
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
      ]
    },
    ram: {
      type: String,
      enum: ["4GB", "6GB", "8GB", "12GB", "16GB", "32GB", "64GB"],
      required: function() { 
        return this.category === 'laptops' || this.category === 'smartphones'; 
      }
    },
    processor: {
      type: String,
      enum: [
        "intel-i3", "intel-i5", "intel-i7", "intel-i9", 
        "intel-celeron", "intel-pentium",
        "amd-ryzen5", "amd-ryzen7",
        "apple-m1", "apple-m2"
      ],
      required: function() { return this.category === 'laptops'; }
    },
    displayType: {
      type: String,
      enum: ["non-touchscreen", "touchscreen", "x360-convertible"],
      required: function() { return this.category === 'laptops'; }
    },
    laptopType: {
      type: String,
      enum: ["basic", "business", "gaming"],
      required: function() { return this.category === 'laptops'; }
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