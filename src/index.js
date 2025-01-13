const express = require("express");
const { getTenantModel } = require("./admindb.js");
const { getCustomerModel } = require("./tenantdb.js");
const app = express();

const port = 4000;

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
app.get("/customer", async (req, res) => {
  const { tenantID, customer } = req.query;

  if (!tenantID || !customer) {
    return res.status(400).send("Tenant ID and customer name are required");
  }

  try {
    const tenantModel = await getTenantModel();
    const tenant = await tenantModel.findOne({ id: tenantID });

    if (!tenant) {
      return res.sendStatus(404); // Tenant not found
    }

    const customerModel = await getCustomerModel(tenantID);
    const customerDoc = await customerModel.findOneAndUpdate(
      { customerName: customer },
      { customerName: customer },
      { upsert: true, new: true }
    );

    res.json(customerDoc); // Send response as JSON
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
