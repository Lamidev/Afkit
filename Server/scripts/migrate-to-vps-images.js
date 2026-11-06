const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/products");
const Feature = require("../models/features");
const Order = require("../models/order");

function convertCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("cloudinary.com/dc0odjwhj")) return url;

  // Extracts the filename (public_id + ext) after /upload/ (ignoring version v123.../ if present)
  const regex = /https:\/\/res\.cloudinary\.com\/dc0odjwhj\/image\/upload\/(?:v\d+\/)?(.+)$/i;
  const match = url.match(regex);
  if (match) {
    return `https://images.afkit.ng/${match[1]}`;
  }
  return url;
}

async function migrate() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("==================================================");
  console.log(`   AFKIT DATABASE IMAGE MIGRATION: CLOUDINARY -> VPS`);
  console.log(`   Mode: ${isDryRun ? "SIMULATION (DRY RUN)" : "LIVE UPDATE"}`);
  console.log("==================================================");

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB successfully.\n");

  // 1. PRODUCTS
  console.log("Scanning Products...");
  const products = await Product.find({});
  let productsUpdated = 0;
  let totalImagesUpdated = 0;
  const productBackups = [];

  for (const prod of products) {
    let changed = false;
    const oldImages = Array.isArray(prod.images) ? [...prod.images] : [];
    const newImages = oldImages.map((img) => {
      const converted = convertCloudinaryUrl(img);
      if (converted !== img) {
        changed = true;
        totalImagesUpdated++;
      }
      return converted;
    });

    if (changed) {
      productBackups.push({ id: prod._id, title: prod.title, oldImages, newImages });
      productsUpdated++;
      if (!isDryRun) {
        await Product.updateOne({ _id: prod._id }, { $set: { images: newImages } });
      }
    }
  }

  console.log(`Products: Found ${products.length} total. Modified: ${productsUpdated}. Total image URLs updated: ${totalImagesUpdated}`);

  // 2. FEATURES
  console.log("\nScanning Features / Banners...");
  const features = await Feature.find({});
  let featuresUpdated = 0;
  const featureBackups = [];

  for (const feat of features) {
    if (feat.image && feat.image.includes("cloudinary.com/dc0odjwhj")) {
      const newImage = convertCloudinaryUrl(feat.image);
      featureBackups.push({ id: feat._id, oldImage: feat.image, newImage });
      featuresUpdated++;
      if (!isDryRun) {
        await Feature.updateOne({ _id: feat._id }, { $set: { image: newImage } });
      }
    }
  }
  console.log(`Features: Modified ${featuresUpdated}.`);

  // 3. ORDERS
  console.log("\nScanning Orders...");
  const orders = await Order.find({ "cartItems.image": /cloudinary\.com\/dc0odjwhj/i });
  let ordersUpdated = 0;
  const orderBackups = [];

  for (const ord of orders) {
    let orderChanged = false;
    const newCartItems = ord.cartItems.map((item) => {
      if (item.image && item.image.includes("cloudinary.com/dc0odjwhj")) {
        orderChanged = true;
        return { ...item.toObject(), image: convertCloudinaryUrl(item.image) };
      }
      return item.toObject();
    });

    if (orderChanged) {
      orderBackups.push({ id: ord._id, oldCart: ord.cartItems, newCart: newCartItems });
      ordersUpdated++;
      if (!isDryRun) {
        await Order.updateOne({ _id: ord._id }, { $set: { cartItems: newCartItems } });
      }
    }
  }
  console.log(`Orders: Modified ${ordersUpdated}.`);

  // Save backup to disk
  const backupFile = path.join(__dirname, "migration_backup.json");
  fs.writeFileSync(
    backupFile,
    JSON.stringify({ timestamp: new Date().toISOString(), productBackups, featureBackups, orderBackups }, null, 2)
  );
  console.log(`\n💾 Backup saved locally to: ${backupFile}`);

  console.log("\n==================================================");
  console.log(`MIGRATION ${isDryRun ? "SIMULATION" : "COMPLETION"} SUMMARY:`);
  console.log(`- Products updated: ${productsUpdated}`);
  console.log(`- Product images converted: ${totalImagesUpdated}`);
  console.log(`- Features updated: ${featuresUpdated}`);
  console.log(`- Orders updated: ${ordersUpdated}`);
  console.log("==================================================");

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});

