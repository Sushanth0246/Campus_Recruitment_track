const mongoose = require("mongoose");

let connectionPromise;

mongoose.connection.on("disconnected", () => {
  connectionPromise = null;
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_placement_tracker";
  connectionPromise = mongoose.connect(uri)
    .then(() => {
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return mongoose.connection;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

module.exports = connectDB;
