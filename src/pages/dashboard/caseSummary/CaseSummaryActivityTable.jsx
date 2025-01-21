import React, { useEffect, useState } from "react";
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
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useCaseSummary } from "./CaseSummaryContext";
import AddIcon from "@mui/icons-material/Add";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { tableSortActiveLabelWithoutHover } from "../../../helpers/styles";
import { caseSummaryActivityURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { useParams } from "react-router-dom";

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  // textAlign: "center",
  lineHeight: "1rem",
}));
const StyledRowTableCell = styled(TableCell)(({ theme }) => ({
  lineHeight: "1rem",
}));

const extractTimestamp = (data = []) => {
  return data.map((item) => ({
    ...item,
    activityDt: item?.activityDt?.split(" ")[0],
  }));
};

const CaseSummaryActivityTable = () => {
  const { caseSummaryData } = useCaseSummary();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [activityData, setActivityData] = useState(
    extractTimestamp(caseSummaryData?.activitySummary)
  );
  const { caseId } = useParams();

  const [sortBy, setSortBy] = useState({
    field: "Date",
    direction: "desc",
  });

  const fetchActivityData = async (sortValue = "DESC") => {
    setErrorMessages([]);
    setLoading(true);
    try {
      const url = `${caseSummaryActivityURL}/${caseId}/${sortValue}`;
      const response = await client.get(url);
      setActivityData(extractTimestamp(response));
      setLoading(false);
    } catch (errorResponse) {
      setLoading(false);
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_LOOKUP_URL}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy.field === property && sortBy.direction === "asc";
    const sortPayload = {
      field: property,
      direction: isAsc ? "desc" : "asc",
    };
    setSortBy(sortPayload);
    fetchActivityData(sortPayload.direction.toUpperCase());
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead style={{ backgroundColor: "#183084" }}>
            <TableRow>
              <TableSortLabel
                active="Date"
                direction={sortBy.field === "Date" ? sortBy.direction : "asc"}
                onClick={() => handleRequestSort("Date")}
                sx={tableSortActiveLabelWithoutHover}
              >
                <StyledHeaderTableCell
                  style={{
                    border: "1px solid #183084",
                    marginBottom: "0.1rem",
                  }}
                >
                  Date
                </StyledHeaderTableCell>
              </TableSortLabel>
              <StyledHeaderTableCell>Stage</StyledHeaderTableCell>
              <StyledHeaderTableCell>Activity</StyledHeaderTableCell>
              <StyledHeaderTableCell>User</StyledHeaderTableCell>
              <StyledHeaderTableCell>
                Activity Description
              </StyledHeaderTableCell>
              <StyledHeaderTableCell></StyledHeaderTableCell>
              <StyledHeaderTableCell>Follow-up</StyledHeaderTableCell>
              <StyledHeaderTableCell></StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityData?.map((row, index) => (
              <TableRow key={index}>
                <StyledRowTableCell>{row.activityDt}</StyledRowTableCell>
                <StyledRowTableCell>{row.stage}</StyledRowTableCell>
                <StyledRowTableCell>{row.activity}</StyledRowTableCell>
                <StyledRowTableCell>{row.user}</StyledRowTableCell>
                <StyledRowTableCell>
                  <Stack
                    sx={{ width: "80%" }}
                    direction="row"
                    alignItems="center"
                  >
                    <Typography sx={{ flexGrow: 1 }}>
                      {row.description}
                    </Typography>
                    <Tooltip title={row.detail} placement="right-start">
                      <MoreHorizIcon />
                    </Tooltip>
                  </Stack>
                </StyledRowTableCell>
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
    </Box>
  );
};

export default CaseSummaryActivityTable;
