const Listing = require("../models/listing");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../cloudConfig");

const allCategories = [
  "Trending",
  "Rooms",
  "Iconic cities",
  "Amazing Views",
  "Amazing pools",
  "Mountain",
  "Beach",
  "Lakefront",
  "Farms"
];

const DEFAULT_GEOMETRY = { type: "Point", coordinates: [77.209, 28.6139] };
const DEFAULT_LISTING_IMAGE = { url: "/gallery/img1.png", filename: "gallery-img1.png" };

function normalizeUploadedImage(file) {
  if (!file) return DEFAULT_LISTING_IMAGE;

  const rawPath = file.path || "";
  const isRemote = /^https?:\/\//i.test(rawPath);

  if (isRemote) {
    return {
      url: rawPath,
      filename: file.filename || path.basename(rawPath),
    };
  }

  return {
    url: `/uploads/${encodeURIComponent(file.filename)}`,
    filename: file.filename,
  };
}

async function cleanupOldListingImage(image) {
  if (!image?.url && !image?.filename) return;
  if (image.url === DEFAULT_LISTING_IMAGE.url) return;

  const isCloudinaryAsset =
    typeof image.url === "string" &&
    image.url.includes("res.cloudinary.com") &&
    typeof image.filename === "string" &&
    image.filename.includes("/");

  if (isCloudinaryAsset) {
    try {
      await cloudinary.uploader.destroy(image.filename);
    } catch (err) {
      console.warn("Failed to delete previous listing image from Cloudinary:", err.message);
    }
    return;
  }

  if (typeof image.url === "string" && image.url.startsWith("/uploads/")) {
    const fileName = decodeURIComponent(path.basename(image.url));
    const localPath = path.join(__dirname, "..", "uploads", fileName);
    fs.promises.unlink(localPath).catch(() => {});
  }
}

async function geocodeWithNominatim(location) {
  if (!location || !location.trim()) return DEFAULT_GEOMETRY;

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "jsonv2",
        limit: 1
      },
      headers: {
        "User-Agent": "wanderlust-learning-project/1.0 (self-hosted)"
      },
      timeout: 7000
    });

    const place = response?.data?.[0];
    const lon = Number(place?.lon);
    const lat = Number(place?.lat);

    if (Number.isFinite(lon) && Number.isFinite(lat)) {
      return { type: "Point", coordinates: [lon, lat] };
    }
  } catch (err) {
    console.warn("Nominatim geocoding failed. Using default coordinates.");
  }

  return DEFAULT_GEOMETRY;
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ✅ MY LISTINGS CONTROLLER
module.exports.renderMyListings = async (req, res) => {
  const userId = req.user._id;

  const listings = await Listing.find({ owner: userId });

  res.render("listings/my.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { categories: allCategories });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const geometry = await geocodeWithNominatim(req.body?.listing?.location);
  const image = normalizeUploadedImage(req.file);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = image;
  newListing.geometry = geometry;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  const rawImageUrl = listing?.image?.url || "";
  const hasCloudinaryFormat =
    rawImageUrl.includes("res.cloudinary.com") &&
    rawImageUrl.includes("/upload/");

  let originalImageUrl = hasCloudinaryFormat
    ? rawImageUrl.replace("/upload", "/upload/h_300,w_250")
    : rawImageUrl;

  res.render("listings/edit.ejs", { 
    listing, 
    originalImageUrl,
    categories: allCategories 
  });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.file) {
    await cleanupOldListingImage(listing.image);
    listing.image = normalizeUploadedImage(req.file);
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect("/listings/" + listing._id);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
