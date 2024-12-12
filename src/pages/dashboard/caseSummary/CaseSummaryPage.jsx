import React from "react";
import { CaseSummaryProvider, useCaseSummary } from "./CaseSummaryContext";
import CaseSummaryHeader from "./CaseSummaryHeader";
import CaseSummaryInfoPanel from "./CaseSummaryInfoPanel";
import CaseSummaryActivityTable from "./CaseSummaryActivityTable";
import { Box, CircularProgress, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import CaseSummaryAddActivity from "./CaseSummaryAddActivity";

const CaseSummaryPage = () => {
  const { loading, errorMessages } = useCaseSummary();
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (errorMessages?.length > 0)
    return (
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        {errorMessages?.map((x) => (
          <div>
            <span className="errorMsg">*{x}</span>
          </div>
        ))}
      </Stack>
    );
  return (
    <Box
      sx={{ backgroundColor: "white", p: 1, minHeight: "calc(100vh - 5rem)" }}
    >
      <CaseSummaryHeader />
      <CaseSummaryInfoPanel />
      <CaseSummaryActivityTable />
      <CaseSummaryAddActivity />
    </Box>
  );
};

const CaseSummaryPageWithProvider = () => {
  const { caseId } = useParams();
  return (
    <CaseSummaryProvider caseId={caseId}>
      <CaseSummaryPage />
    </CaseSummaryProvider>
  );
};

export default CaseSummaryPageWithProvider;
