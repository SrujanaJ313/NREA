import React, { useState } from "react";
import { Box } from "@mui/material";
import CaseLookUpSearch from "./CaseLookUpSearch";
import CaseLookUpResult from "./CaseLookUpResult";

function CaseLookUpPage() {
  const [lookUpSummary, setLookUpSummary] = useState([]);
  const [reqPayload, setReqPayload] = useState({});
  return (
    <Box display="flex" style={{ height: "calc(100vh - 3rem)" }}>
      {/* Left Panel */}
      <CaseLookUpSearch
        setLookUpSummary={setLookUpSummary}
        setReqPayload={setReqPayload}
      />

      {/* Right Panel */}
      <Box width="85%" bgcolor="#f1f3f8" p={1}>
        <CaseLookUpResult
          lookUpSummary={lookUpSummary}
          reqPayload={reqPayload}
        />
      </Box>
    </Box>
  );
}

export default CaseLookUpPage;
