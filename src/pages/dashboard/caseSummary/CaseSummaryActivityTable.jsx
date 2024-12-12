import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
import { useCaseSummary } from "./CaseSummaryContext";
import AddIcon from "@mui/icons-material/Add";

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  // textAlign: "center",
  lineHeight: "1rem",
}));
const StyledRowTableCell = styled(TableCell)(({ theme }) => ({
  lineHeight: "1rem",
}));

const CaseSummaryActivityTable = () => {
  const { caseSummaryData } = useCaseSummary();

  const sortActivityData = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.activityDt);
      const dateB = new Date(b.activityDt);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;

      return b.activityId - a.activityId;
    });
  };
  const data = sortActivityData(caseSummaryData?.activitySummary || []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Date</StyledHeaderTableCell>
              <StyledHeaderTableCell>Stage</StyledHeaderTableCell>
              <StyledHeaderTableCell>Activity</StyledHeaderTableCell>
              <StyledHeaderTableCell>User</StyledHeaderTableCell>
              <StyledHeaderTableCell>Activity Synopsis</StyledHeaderTableCell>
              <StyledHeaderTableCell></StyledHeaderTableCell>
              <StyledHeaderTableCell>Follow-up</StyledHeaderTableCell>
              <StyledHeaderTableCell></StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={index}>
                <StyledRowTableCell>{row.activityDt}</StyledRowTableCell>
                <StyledRowTableCell>{row.stage}</StyledRowTableCell>
                <StyledRowTableCell>{row.activity}</StyledRowTableCell>
                <StyledRowTableCell>{row.user}</StyledRowTableCell>
                <StyledRowTableCell>{row.synopsis}</StyledRowTableCell>
                <StyledRowTableCell>- -</StyledRowTableCell>
                {/* <StyledRowTableCell>{row.followUpInd}</StyledRowTableCell>
                <StyledRowTableCell>{row.addFollowUpInd}</StyledRowTableCell>
                <StyledRowTableCell>{row.noteInd}</StyledRowTableCell>
                <StyledRowTableCell>{row.addNoteInd}</StyledRowTableCell> */}
                <StyledRowTableCell>
                  <AddIcon />
                </StyledRowTableCell>
                <StyledRowTableCell>
                  <AddIcon />
                </StyledRowTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CaseSummaryActivityTable;
