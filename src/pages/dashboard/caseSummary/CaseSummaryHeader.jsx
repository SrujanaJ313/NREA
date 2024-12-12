import React from "react";
import { useCaseSummary } from "./CaseSummaryContext";
import { Box, Typography, Grid, styled, Tooltip, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const LabelTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  padding: "0.7rem",
  paddingRight: "0.3rem",
  fontSize: "1rem",
}));

const ValueTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  padding: "0.2rem",
}));

const CaseSummaryHeader = () => {
  const { caseSummaryData } = useCaseSummary();
  const { byeDt, caseManagerName, claimantName, ssnLast4Digits } =
    caseSummaryData;
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "white",
        alignItems: "center",
        mb: 2,
        padding: "0.8rem 0",
        color: "#183084",
        boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={6} md={2.5}>
          <LabelTypography component={"span"} className="label-text">
            CASE SUMMARY
          </LabelTypography>
        </Grid>
        <Grid item xs={12} sm={6} md={3.5}>
          <LabelTypography component={"span"} className="label-text">
            Claimant:
          </LabelTypography>
          <ValueTypography component={"span"}>{claimantName}</ValueTypography>
          {ssnLast4Digits && (
            <ValueTypography
              component={"span"}
              style={{ position: "relative" }}
            >
              <Tooltip title={ssnLast4Digits} placement="right-start">
                <MoreHorizIcon style={{ position: "absolute" }} />
              </Tooltip>
            </ValueTypography>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LabelTypography component={"span"} className="label-text">
            Bye:
          </LabelTypography>
          <ValueTypography component={"span"}>{byeDt}</ValueTypography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LabelTypography component={"span"} className="label-text">
            Case Manager:
          </LabelTypography>
          <ValueTypography component={"span"}>
            {caseManagerName}
          </ValueTypography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseSummaryHeader;
