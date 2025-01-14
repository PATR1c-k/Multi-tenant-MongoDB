import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const CustomerList = () => {
  const [tenantID, setTenantID] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    if (!tenantID) {
      setError("Tenant ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:4500/customers`, {
        params: { tenantID },
      });

      setCustomers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to fetch customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 4, marginTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        Customer List
      </Typography>

      <TextField
        label="Tenant ID"
        variant="outlined"
        value={tenantID}
        onChange={(e) => setTenantID(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={fetchCustomers}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Customers"}
      </Button>

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#f0eac4",
              "& th": {
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#806c6c",
              },
            }}
          >
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>{customer.customerEmail}</TableCell>
                  <TableCell>{customer.customerPhone || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerList;
