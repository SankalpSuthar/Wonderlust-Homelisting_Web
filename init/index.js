if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// mongodb database connection code
const MONGO_URL =
  process.env.ATLASDB_URL ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/wanderlust";

const categories = [
  "Trending",
  "Rooms",
  "Iconic cities",
  "Amazing Views",
  "Amazing pools",
  "Mountain",
  "Beach",
  "Lakefront",
  "Farms",
];

const DEFAULT_GEOMETRY = { type: "Point", coordinates: [77.209, 28.6139] };

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// link data.js and initializing  all data
const initDB = async ()=>{
    await Listing.deleteMany({});

    const preparedListings = initData.data.map((obj, index) => {
      const listing = {
        ...obj,
        roomsAvailable: obj.roomsAvailable ?? 1,
        category: obj.category ?? categories[index % categories.length],
        geometry: obj.geometry ?? DEFAULT_GEOMETRY,
      };

      if (process.env.SEED_OWNER_ID) {
        listing.owner = process.env.SEED_OWNER_ID;
      }

      return listing;
    });

    await Listing.insertMany(preparedListings);
    console.log(`data was initialized: ${preparedListings.length} listings inserted`);
};

initDB()
  .catch((err) => {
    console.error("Failed to initialize seed data:", err.message);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
