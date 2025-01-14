import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    tenantID: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4500/customer", formData);
      setResponse(res.data);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "white", color: "black" }}>
      <Typography variant="h5">Add Customer</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tenant ID"
          name="tenantID"
          value={formData.tenantID}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="Customer Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="Customer Email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="Customer Phone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
      {response && (
        <Typography variant="body1">
          Response: {JSON.stringify(response)}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerForm;
