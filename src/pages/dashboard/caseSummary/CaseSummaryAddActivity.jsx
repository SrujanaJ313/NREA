import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CaseSummaryAddActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.state?.from?.split("/")[2];
    path ? navigate(`/${path}`) : navigate("/");
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sm={6} md={11}>
          {/* <Box>Add Activity Component</Box> */}
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <Button
            style={{ backgroundColor: "#183084" }}
            sx={{
              margin: "1rem 0 1rem 3rem",
              padding: "0.7rem",
              color: "white",
              textTransform: "none",
              letterSpacing: "0.1rem",
            }}
            onClick={handleBack}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseSummaryAddActivity;
