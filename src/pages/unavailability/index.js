import React, { useCallback, useState } from "react";

import { Box, Grid, Typography } from "@mui/material";
import PerformanceMetrics from "../dashboard/performancemetrics/PerformanceMetrics";
import UnavailabilityList from "./UnavailabilityList";

const StaffUnavailability = () => {
  return (
    <Box sx={{ padding: "8px" }}>
      <Typography variant="h6" style={{ color: "#183084", fontWeight: "bold" }}>
        Staff Unavailability
      </Typography>
      {/*<Grid container sx={{ border: "2px solid #000" }}>*/}
      {/*  <Grid item xs={12} sm={3} xl={3}>*/}
      {/*    <PerformanceMetrics />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={12} sm={9} xl={9} maxHeight={"100%"} sx={{ padding: 1 }}>*/}
      {/*    <Box>*/}
      <UnavailabilityList />
      {/*    </Box>*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
    </Box>
  );
};
export default StaffUnavailability;
