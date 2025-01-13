const { connect } = require("./db_connection.js");
const mongoose = require("mongoose");
const url = process.env.ADMIN_URL;

let db;

const customerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
  },
  { timestamps: true }
);
// This function connects to the tenant's database based on the tenantID
const getTenantDB = async (tenantID) => {
  const dbName = `tenant-${tenantID}`; // Tenant-specific database

  // Use createConnection to get a connection object
  const tenantDB = mongoose.createConnection(url, {
    dbName: dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  tenantDB.once("open", () => {
    console.log(`Connected to ${dbName} database`);
  });

  return tenantDB;
};

const getCustomerModel = async (tenantID) => {
  const tenantDb = await getTenantDB(tenantID); // Get the tenant-specific database
  // Dynamically return the customer model based on the tenant's database
  return tenantDb.model("Customer", customerSchema);
};
module.exports = {
  getCustomerModel,
};
