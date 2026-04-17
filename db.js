const mongoose = require("mongoose");

const dbUrl =
  process.env.ATLASDB_URL ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/wanderlust";

const globalMongoose = global.__wanderlustMongoose || {
  conn: null,
  promise: null,
};

global.__wanderlustMongoose = globalMongoose;

async function connectToDatabase() {
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  if (!globalMongoose.promise) {
    globalMongoose.promise = mongoose
      .connect(dbUrl)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        globalMongoose.promise = null;
        throw err;
      });
  }

  globalMongoose.conn = await globalMongoose.promise;
  return globalMongoose.conn;
}

module.exports = {
  connectToDatabase,
  dbUrl,
};
