const express = require("express");
const { getTenantModel } = require("./admindb.js");
const { getCustomerModel } = require("./tenantdb.js");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

// enabled to talk with frontEND
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

dotenv.config();

const port = process.env.PORT;

// Middleware to parse JSON request body
app.use(express.json());

// POST endpoint to add a customer
app.post("/customer", async (req, res) => {
  console.log(req.body);

  const { tenantID, customerName, customerEmail, customerPhone } = req.body;

  if (!tenantID || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if tenant exists
  let tenantModel = await getTenantModel();
  let tenant = await tenantModel.findOne({ id: tenantID });

  if (!tenant) {
    return res.status(404).json({ error: "Tenant Not Found" });
  }

  // Get the customer model for the tenant's database
  let customerModel = await getCustomerModel(tenantID);

  // Create new customer instance
  const customer = new customerModel({
    customerName,
    customerEmail,
    customerPhone,
  });

  // Save the customer to the tenant's database
  try {
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer); // Use .json() for proper JSON response
  } catch (error) {
    console.error("Error in saving customer:", error);
    res.status(500).json({ error: "Failed to save customer data" });
  }
});

// GET endpoint to create or fetch tenant
app.get("/tenant", async (req, res) => {
  const tenantID = req.query.tenantID;
  console.log("Request Received:", req.query);

  if (!tenantID) {
    return res.status(400).send("Tenant ID is required");
  }

  try {
    const tenantModel = await getTenantModel();
    const tenant = await tenantModel.findOneAndUpdate(
      { id: tenantID },
      { id: tenantID, name: tenantID },
      { upsert: true, new: true }
    );
    res.json(tenant); // Send response as JSON
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET endpoint to fetch or create customer for a specific tenant
app.get("/customers", async (req, res) => {
  const { tenantID } = req.query;

  if (!tenantID) {
    return res.status(400).json({ error: "Tenant ID is Required" });
  }

  try {
    const customerModel = await getCustomerModel(tenantID);
    const customers = await customerModel.find();

    if (customers.length === 0) {
      return res.status(404).json({ Message: "No customers Yet!!" });
    }
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch Customers" });
  }
});

// Start the server
app.listen(port, (error) => {
  if (error) {
    console.log("Failed to Start the server.");
  } else {
    console.log(`Listening at port ${port}`);
  }
});
