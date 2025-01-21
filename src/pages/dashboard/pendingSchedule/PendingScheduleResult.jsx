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
  Link,
  FormControlLabel,
  Radio,
  Button,
  DialogContent,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import client from "../../../helpers/Api";
import { casePendingScheduleURL } from "../../../helpers/Urls";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { tableSortActiveLabel } from "../../../helpers/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link as RouterLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "../../../components/customModal/CustomModal";
import Schedule from "../caseModeView/Schedule";
import moment from "moment";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: "1rem",
}));

const columns = [
  /* {
    id: "caseId",
    label: "Case #",
  }, */
  {
    id: "radio",
    label: "",
  },
  {
    id: "officeName",
    label: "Local Office",
  },
  /* { id: "caseManagerName", label: "Case Manager" }, */
  { id: "claimantName", label: "Claimant" },
  {
    id: "byeDt",
    label: "BYE",
  },
  {
    id: "stage",
    label: "Stage",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "weeks",
    label: "# Weeks",
  },
  {
    id: "followUp",
    label: "Follow-up",
  },
  {
    id: "indicator",
    label: "Indicators",
  },
];
const PendingScheduleResult = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [lookupReferences, setLookupReferences] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    needTotalCount: true,
  });

  const [sortBy, setSortBy] = useState({
    field: "",
    direction: "asc",
  });

  useEffect(() => {
    const payload = { pagination, sortBy };
    fetchCaseLookUpList(payload);
  }, []);

  const fetchCaseLookUpList = async (payload) => {
    setLoading(true);
    setErrorMessages([]);
    try {
      const response = await client.post(casePendingScheduleURL, payload);
      const enhancedData =
        response?.summaryDTO?.map((item, index) => ({
          ...item,
          id: uuidv4(),
        })) || [];
      setLookupReferences(enhancedData);
      setTotalCount(response?.pagination?.totalItemCount);
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
      pagination: paginationPayload,
      sortBy: sortBy,
    };

    if (lookupReferences.length) fetchCaseLookUpList(payload);
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
      pagination: paginationPayload,
      sortBy: sortBy,
    };
    if (lookupReferences.length) fetchCaseLookUpList(payload);
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
      pagination: {
        pageNumber: 1,
        pageSize: rowsPerPage,
        needTotalCount: true,
      },
      sortBy: sortPayload,
    };
    if (lookupReferences.length) fetchCaseLookUpList(payload);
  };

  const getTitle = () => {
    return (
      <>
        <span style={{ paddingRight: "5%" }}>
          Claimant Name: {selectedRow?.claimantName}
        </span>
        <span style={{ paddingRight: "5%" }}></span>
        <span style={{ paddingRight: "10%" }}>
          BYE: {moment(selectedRow?.byeDt).format("MM/DD/YYYY")}
        </span>
        <span style={{ paddingRight: "10%" }}>Stage: {selectedRow?.stage}</span>
      </>
    );
  };

  const renderTableCellContent = (column, row) => {
    switch (column.id) {
      case "radio":
        return (
          <div style={{ margin: "-0.5rem 0 0 0.5rem" }}>
            <FormControlLabel
              value={row?.id}
              control={<Radio />}
              label=""
              checked={row?.id === selectedRow?.id}
              onChange={() => setSelectedRow(row)}
            />
          </div>
        );
      case "claimantName":
        return (
          <Stack direction="row" alignItems="center" sx={{ width: "90%" }}>
            <Typography sx={{ flexGrow: 1 }}>{row?.claimantName}</Typography>
            {row?.ssnLast4Digits && (
              <Tooltip title={row.ssnLast4Digits} placement="right-start">
                <MoreHorizIcon />
              </Tooltip>
            )}
          </Stack>
        );
      case "indicator":
        return row?.indicator === "LATE" ? ">21" : row.indicator;
      case "followUp":
        return `${row?.followUpType || ""} ${row?.followUpDt || ""}`;
      case "caseId":
        return row?.caseId;
      /* case "stage":
        return (
          <Stack direction="row" alignItems="center" sx={{ width: "85%" }}>
            <Typography sx={{ flexGrow: 1 }}>{row?.stage}</Typography>
            {row?.stage !== "Terminated" && (
              <Tooltip title={row?.appointmentDate} placement="right-start">
                <MoreHorizIcon />
              </Tooltip>
            )}
          </Stack>
        ); */
      default:
        return row[column.id] || "";
    }
  };

  return (
    <div style={{ margin: "1rem", height: "calc(100vh - 6.8rem)" }}>
      <Box display="flex" justifyContent="flex-start">
        <Typography
          sx={{
            color: "#183084",
            margin: "0",
            marginBottom: "10px",
            fontWeight: "bold",
            width: "94%",
          }}
          variant="h6"
          gutterBottom
        >
          Initial Appointments to be Scheduled
        </Typography>
      </Box>
      <Box>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "calc(100vh - 10.1rem)" }}
        >
          <Table size="small" aria-label="customized table" stickyHeader>
            <TableHead style={{ backgroundColor: "#183084" }}>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    sx={{
                      verticalAlign: "top",
                      padding: "0.2rem 0.1rem 0.6rem 0.1rem",
                    }}
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
                          key={column.id}
                          sx={{
                            verticalAlign: "top",
                            padding: "0.2rem 0.1rem 0.4rem 0.1rem",
                          }}
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
        {lookupReferences.length ? (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedRow}
              onClick={() => setOpen(true)}
              style={{ margin: "-2.5rem 0 0 1.5rem" }}
            >
              Schedule
            </Button>
          </div>
        ) : null}
      </Box>

      <CustomModal title={getTitle()} open={open} maxWidth="md">
        <DialogContent dividers sx={{ paddingBottom: 1 }}>
          <Stack>
            <Schedule
              onCancel={() => setOpen(false)}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </Stack>
        </DialogContent>
      </CustomModal>
    </div>
  );
};

export default PendingScheduleResult;
