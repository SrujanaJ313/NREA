import React, { useState } from "react";
import { Box } from "@mui/material";
import AppointmentLooKUpSearch from "./AppointmentLooKUpSearch";
import AppointmentLookUpResult from "./AppointmentLookUpResult";

function Appointments() {
  const [lookUpSummary, setLookUpSummary] = useState([]);
  const [reqPayload, setReqPayload] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <Box display="flex" style={{ height: "calc(100vh - 3rem)" }}>
      {/* Left Panel */}
      <AppointmentLooKUpSearch
        setLookUpSummary={setLookUpSummary}
        setReqPayload={setReqPayload}
        setLoading={setLoading}
      />

      {/* Right Panel */}
      <Box width="75%" bgcolor="#f1f3f8" p={1}>
        <AppointmentLookUpResult
          lookUpSummary={lookUpSummary}
          reqPayload={reqPayload}
          loading={loading}
          setLoading={setLoading}
        />
      </Box>
    </Box>
  );
}

export default Appointments;
