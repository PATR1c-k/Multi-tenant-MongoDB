const mongoose = require("mongoose");
const dotenv = require("dotenv");

// MongoDB URI
dotenv.config();
const url = process.env.MONGOURL;

const connect = async () => {
  try {
    const connection = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    throw error;
  }
};

module.exports = { connect };
