const mongoose = require("mongoose");

// MongoDB URI
const url = process.env.ADMIN_URL; // Ensure this is not undefined

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
