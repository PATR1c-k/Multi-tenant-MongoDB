const dotenv = require("dotenv");
const { connect } = require("./db_connection.js");
const mongoose = require("mongoose");

dotenv.config();
const url = process.env.MONGOURL;
let db; // Cached db

// Tenant Schema
const tenantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Get the cached admin database connection or create a new one.
 * @returns {Promise<mongoose.Connection>}
 */
const getDb = async () => {
  if (db) {
    return db;
  }
  try {
    db = await connect(url);
    console.log("Connected to the admin database");
    return db;
  } catch (error) {
    console.error("Failed to connect to the admin database:", error);
    throw error;
  }
};

/**
 * Get the tenant model for interacting with the tenants collection.
 * @returns {Promise<mongoose.Model>} - The tenant model.
 */
const getTenantModel = async () => {
  const adminDb = await getDb();
  return adminDb.model("tenants", tenantSchema);
};

module.exports = {
  getTenantModel,
};
