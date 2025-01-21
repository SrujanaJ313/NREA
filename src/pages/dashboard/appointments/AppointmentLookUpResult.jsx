import React, { useState, useEffect } from "react";
import { visuallyHidden } from "@mui/utils";
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
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import client from "../../../helpers/Api";
import { appointmentsLookUpSummaryURL } from "../../../helpers/Urls";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { tableSortActiveLabel } from "../../../helpers/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LinearProgress from "@mui/material/LinearProgress";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  lineHeight: "1rem",
  border: "none",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: "1rem",
}));

const columns = [
  {
    id: "officeName",
    label: "Local Office",
  },
  { id: "caseManagerName", label: "Case Manager" },
  { id: "eventDateTime", label: "Event Date & Time" },
  {
    id: "eventType",
    label: "Type",
  },
  {
    id: "eventUsage",
    label: "Timeslot Usage",
  },
  {
    id: "meetingStatus",
    label: "Status",
  },
  {
    id: "claimantName",
    label: "Claimant",
  },
  {
    id: "byeDt",
    label: "BYE",
  },
  {
    id: "indicator",
    label: "Indicators",
  },
];

const LookUpAppointmentTable = ({
  lookUpSummary,
  reqPayload,
  loading,
  setLoading,
}) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [lookupReferences, setLookupReferences] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    needTotalCount: true,
  });

  const [sortBy, setSortBy] = useState({
    field: "",
    direction: "desc",
  });

  useEffect(() => {
    if (lookUpSummary.length) {
      setLookupReferences(lookUpSummary[0]?.summaryDTO);
      setTotalCount(lookUpSummary[0]?.pagination.totalItemCount);
      setPagination({
        pageNumber: 1,
        pageSize: 10,
        needTotalCount: true,
      });
      setPage(0);
      setRowsPerPage(10);
      setSortBy(lookUpSummary[0]?.sortBy);
    }
  }, [lookUpSummary]);

  const fetchAppointmentLookupList = async (payload) => {
    setLoading(true);
    setErrorMessages([]);
    try {
      const response = await client.post(appointmentsLookUpSummaryURL, payload);
      setLoading(false);
      setLookupReferences(response.summaryDTO);
      setTotalCount(response.pagination.totalItemCount);
      setLoading(false);
    } catch (errorResponse) {
      setLoading(false);
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_LOOKUP_URL}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const paginationPayload = {
      pageNumber: newPage + 1,
      pageSize: pagination.pageSize,
      needTotalCount: true,
    };
    setPagination(paginationPayload);

    const payload = {
      ...reqPayload,
      pagination: paginationPayload,
      sortBy: sortBy,
    };

    if (lookUpSummary.length) fetchAppointmentLookupList(payload);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

    const paginationPayload = {
      pageNumber: 1,
      pageSize: event.target.value,
      needTotalCount: true,
    };
    setPagination(paginationPayload);

    const payload = {
      ...reqPayload,
      pagination: paginationPayload,
      sortBy: sortBy,
    };
    if (lookUpSummary.length) fetchAppointmentLookupList(payload);
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy.field === property && sortBy.direction === "asc";
    const sortPayload = {
      field: property,
      direction: isAsc ? "desc" : "asc",
    };
    setSortBy(sortPayload);
    setPagination({
      pageNumber: 1,
      pageSize: rowsPerPage,
      needTotalCount: true,
    });
    const payload = {
      ...reqPayload,
      pagination: {
        pageNumber: 1,
        pageSize: rowsPerPage,
        needTotalCount: true,
      },
      sortBy: sortPayload,
    };
    if (lookUpSummary.length) fetchAppointmentLookupList(payload);
  };

  const renderTableCellContent = (column, row) => {
    switch (column.id) {
      case "claimantName":
        return (
          <Stack
            spacing={1.5}
            direction="row"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography sx={{ flexGrow: 1 }}>{row?.claimantName}</Typography>
            {row?.lastFourDigitsOfSSN && (
              <Tooltip title={row.lastFourDigitsOfSSN} placement="right-start">
                <MoreHorizIcon />
              </Tooltip>
            )}
          </Stack>
        );
      case "indicator":
        return row?.indicator === "LATE" ? ">21" : row.indicator;
      default:
        return row[column.id] || "";
    }
  };

  return (
    <div>
      <Box>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "calc(100vh - 6.5rem)" }}
        >
          <Table
            sx={{ minWidth: 750 }}
            size="small"
            aria-label="customized table"
            stickyHeader
          >
            <TableHead style={{ backgroundColor: "#183084" }}>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    sx={{ verticalAlign: "top" }}
                  >
                    <TableSortLabel
                      active={sortBy.field === column.id}
                      direction={
                        sortBy.field === column.id ? sortBy.direction : "asc"
                      }
                      onClick={() => handleRequestSort(column.id)}
                      sx={tableSortActiveLabel}
                    >
                      {column.label}
                      {sortBy.field === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortBy.direction === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lookupReferences?.map((row, rowIndex) => {
                return (
                  <StyledTableRow hover key={rowIndex}>
                    {columns?.map((column) => {
                      return (
                        <TableCell
                          sx={{
                            verticalAlign: "top",
                            padding: "0.4rem 0.5rem",
                          }}
                          key={column.id}
                        >
                          {renderTableCellContent(column, row)}
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <LinearProgress />}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
    </div>
  );
};

export default LookUpAppointmentTable;
