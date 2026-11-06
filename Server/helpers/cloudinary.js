const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    // 1. Primary: Upload directly to self-hosted Contabo VPS image server
    const response = await fetch("https://images.afkit.ng/upload-base64", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.IMAGE_SERVER_KEY || "afkit_secret_images_key_2026",
      },
      body: JSON.stringify({ dataUri: file }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.secure_url) {
        return {
          url: data.url,
          secure_url: data.secure_url,
          public_id: data.public_id,
        };
      }
    }
    throw new Error(`VPS upload failed with status ${response.status}`);
  } catch (vpsError) {
    console.warn("VPS Upload failed, falling back to Cloudinary:", vpsError.message);
    // 2. Fallback: Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return result;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
