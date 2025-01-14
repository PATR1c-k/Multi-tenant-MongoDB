import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const TenantForm = () => {
  const [tenantID, setTenantID] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4500/tenant?tenantID=${tenantID}`
      );
      setResponse(res.data);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "white", color: "black" }}>
      <Typography variant="h5">Create or Fetch Tenant</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tenant ID"
          variant="outlined"
          value={tenantID}
          onChange={(e) => setTenantID(e.target.value)}
          fullWidth
          sx={{ my: 2 }}
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

export default TenantForm;
