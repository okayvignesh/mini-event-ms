const mongoose = require("mongoose");

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mini_event_ms";

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

module.exports = { connectToDatabase };


