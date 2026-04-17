const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const isCloudinaryConfigured = Boolean(
  process.env.CLOUD_NAME &&
    process.env.CLOUD_API_KEY &&
    process.env.CLOUD_API_SECRET
);
const isProduction = process.env.NODE_ENV === "production";
let uploadConfigError = null;

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: isProduction ? "wanderlust" : "wanderlust_dev",
      allowedFormats: ["png", "jpg", "jpeg", "webp"],
    },
  });
} else if (isProduction) {
  storage = multer.memoryStorage();
  uploadConfigError =
    "Image uploads require Cloudinary on production. Add CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET in Vercel.";
  console.warn(uploadConfigError);
} else {
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase();
      const safeExt = ext || ".jpg";
      const uniqueName = `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
      cb(null, uniqueName);
    },
  });

  console.warn("Cloudinary config missing. Using local disk uploads in /uploads.");
}

module.exports = {
  cloudinary,
  storage,
  isCloudinaryConfigured,
  uploadConfigError,
};
