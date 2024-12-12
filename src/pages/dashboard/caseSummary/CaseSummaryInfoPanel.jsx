import React from "react";
import { Box, Typography, Grid, Stack, styled, Tooltip } from "@mui/material";
import { useCaseSummary } from "./CaseSummaryContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../../theme/theme";
import WorkSearch from "../../../components/caseHeader/WorkSearch";
import IssuesCreatedData from "../../../components/caseHeader/IssuesCreatedData";
import JobReferrals from "../../../components/caseHeader/JobReferrals";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const LabelTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  padding: "0.7rem",
  paddingRight: "0.3rem",
  fontSize: "0.9rem",
}));

const ValueTypography = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  padding: "0.2rem",
}));

const accordionStyle = {
  border: `1px solid #d1cece`,
  padding: "0.3rem",
  fontSize: "0.9rem",
};

const CaseSummaryInfoPanel = () => {
  const { caseSummaryData } = useCaseSummary();

  const {
    stage,
    weeksFiled,
    orientationDt,
    firstSubsequentApptDt,
    secondSubsequentApptDt,
    synopsis,
    indicators,
    status,
    profileScore,
    initialAppttDt,
    jobReferral,
    workSearch,
    issues,
    jobReferrals,
  } = caseSummaryData;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ pb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Stage:
            </LabelTypography>
            <ValueTypography component={"span"}>{stage}</ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Weeks Filed:
            </LabelTypography>
            <ValueTypography component={"span"}>{weeksFiled}</ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Orientation Date:
            </LabelTypography>
            <ValueTypography component={"span"}>
              {orientationDt}
            </ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              1<sup>st</sup> Sub Appt Date:
            </LabelTypography>
            <ValueTypography component={"span"}>
              {firstSubsequentApptDt}
            </ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Indicators:
            </LabelTypography>
            <ValueTypography component={"span"}>{indicators}</ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Status:
            </LabelTypography>
            <ValueTypography component={"span"}>{status}</ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Profile Score:
            </LabelTypography>
            <ValueTypography component={"span"}>{profileScore}</ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              Initial Appt Date:
            </LabelTypography>
            <ValueTypography component={"span"}>
              {initialAppttDt}
            </ValueTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              2<sup>nd</sup> Sub Appt Date:
            </LabelTypography>
            <ValueTypography component={"span"}>
              {secondSubsequentApptDt}
            </ValueTypography>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={2.4}>
            <LabelTypography component={"span"} className="label-text">
              F: Job Referral:
            </LabelTypography>
            <ValueTypography component={"span"}>{jobReferral}</ValueTypography>
          </Grid> */}
          <Grid
            style={{ display: synopsis.length > 200 ? "flex" : "" }}
            item
            xs={12}
            sm={12}
            md={12}
          >
            <LabelTypography component={"span"} className="label-text">
              Synopsis:
            </LabelTypography>
            {synopsis.length > 200 ? (
              <>
                <Stack component={"span"} direction="row" alignItems="center">
                  <ValueTypography component={"span"}>
                    {synopsis.slice(0, 200)}
                  </ValueTypography>

                  <Tooltip title={synopsis} placement="right-start">
                    <MoreHorizIcon />
                  </Tooltip>
                </Stack>
              </>
            ) : (
              <ValueTypography component={"span"}>{synopsis}</ValueTypography>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, p: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack width="100%" spacing={0.75}>
            <Accordion sx={accordionStyle}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Work Search
              </AccordionSummary>
              <AccordionDetails>
                <WorkSearch data={workSearch || []} />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={accordionStyle}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                Issues Created
              </AccordionSummary>
              <AccordionDetails>
                <IssuesCreatedData data={issues || []} />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={accordionStyle}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                Job Referrals
              </AccordionSummary>
              <AccordionDetails>
                <JobReferrals data={jobReferrals || []} />
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default CaseSummaryInfoPanel;
