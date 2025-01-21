import React, { useCallback, useState, useEffect } from "react";

import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Typography,
  Link,
  Stack,
  ButtonBase,
  InputLabel,
  FormControl,
  FormHelperText,
  styled,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import Divider from "@mui/material/Divider";
import isEmpty from "lodash/isEmpty";

import client from "../../helpers/Api";
import {
  appointmentStaffListURL,
  unavailabilityURL,
  unavailabilityDetailURL,
  unavailabilityStatusURL,
} from "../../helpers/Urls";
import { getMsgsFromErrorCode, sortAlphabetically } from "../../helpers/utils";
import moment from "moment";
import UnavailabilityForm from "./UnavailabilityForm";
import {
  CookieNames,
  getCookieItem,
  isUpdateAccessExist,
} from "../../utils/cookies";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  isCaseManager,
  isCaseOrLocalOrProgramStaffManager,
  isLocalOfficeManager,
  isLocalOrProgramStaffManager,
} from "../../utils/users";
import { useSnackbar } from "../../context/SnackbarContext";
import CustomModal from "../../components/customModal/CustomModal";
import DialogActions from "@mui/material/DialogActions";
import { getAlertMessage } from "./unavailabilityUtils";
import { tableSortActiveLabelWithoutHover } from "../../helpers/styles";

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  // textAlign: "center",
  lineHeight: "1rem",
}));
const StyledRowTableCell = styled(TableCell)(({ theme }) => ({
  lineHeight: "1rem",
}));

const UnavailabilityList = ({}) => {
  const [appointmentStaffList, setAppointmentStaffList] = useState([]);
  const [staffStatusList, setStaffStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errors, setErrors] = useState([]);

  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [recurring, setRecurring] = useState(false);
  const [action, setAction] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const showSnackbar = useSnackbar();

  const [sortBy, setSortBy] = useState({
    field: "period",
    direction: "asc",
  });

  useEffect(() => {
    async function fetchAppointmentStaffListData() {
      try {
        const data = await client.get(appointmentStaffListURL);
        const sortedData = sortAlphabetically(data);
        setAppointmentStaffList(sortedData);
        setErrors([]);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_APPOINTMENT_STAFF_LIST}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }

    if (isCaseManager()) {
      const caseManagerUserId = getCookieItem(CookieNames.USER_ID);
      const caseManagerName = JSON.parse(
        getCookieItem(CookieNames.USER)
      )?.userName;
      setAppointmentStaffList([
        {
          id: caseManagerUserId,
          name: caseManagerName,
        },
      ]);
      setUserId(caseManagerUserId);
    } else {
      fetchAppointmentStaffListData();
    }
  }, []);

  const fetchStaffUnavailability = async (event) => {
    if (!userId || !startDate) return;
    try {
      const body = {
        userId: userId,
        startDt: moment(startDate).format("MM/DD/YYYY"),
        ...(endDate && { endDt: moment(endDate).format("MM/DD/YYYY") }),
        ...(selectedStatus && { status: selectedStatus }),
      };
      const data = await client.post(unavailabilityURL, body);
      setData(data);
      setErrors([]);
      if (event && isEmpty(data)) {
        showSnackbar(
          "No data found for the selected staff and date range",
          5000,
          "info"
        );
      }
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_UNAVAILABILITY}`,
        errorResponse
      );
      setErrors(newErrMsgs);
    }
  };

  const fetchInitialOrSortStaffUnavailability = async (sortBy = null) => {
    try {
      let body = {};
      if (sortBy) {
        body = {
          sortBy: sortBy,
          ...(userId && { userId: userId }),
          ...(startDate && { startDt: moment(startDate).format("MM/DD/YYYY") }),
          ...(selectedStatus && { status: selectedStatus }),
          ...(endDate && { endDt: moment(endDate).format("MM/DD/YYYY") }),
        };
      }
      const data = await client.post(unavailabilityURL, body);
      setData(data);
      setErrors([]);
      if (event && isEmpty(data)) {
        showSnackbar(
          "No data found for the selected staff and date range",
          5000,
          "info"
        );
      }
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_UNAVAILABILITY}`,
        errorResponse
      );
      setErrors(newErrMsgs);
    }
  };

  const fetchStaffUnavailabilityStatus = async () => {
    try {
      const data = await client.get(unavailabilityStatusURL);
      setStaffStatusList(data);
      setErrors([]);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_UNAVAILABILITY}`,
        errorResponse
      );
      setErrors(newErrMsgs);
    }
  };

  useEffect(() => {
    if (isLocalOfficeManager()) {
      fetchInitialOrSortStaffUnavailability();
    }
    fetchStaffUnavailabilityStatus();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = sortBy.field === property && sortBy.direction === "asc";
    const sortPayload = {
      field: property,
      direction: isAsc ? "desc" : "asc",
    };
    setSortBy(sortPayload);
    if (data.length) fetchInitialOrSortStaffUnavailability(sortPayload);
  };

  const handleOneTimeShow = () => {
    setRecurring(false);
    setSelectedItem();
    setAction("New");
  };

  const onCancel = () => {
    setRecurring(false);
    setSelectedItem();
    setAction("");
    setIsFormDirty(false);
  };

  const handleRecurringShow = () => {
    setRecurring(true);
    setSelectedItem();
    setAction("New");
  };

  const fetchUnavailabilityDetails = async (
    unavailabilityId,
    recurring,
    action
  ) => {
    try {
      const data = await client.get(
        `${unavailabilityDetailURL}/${unavailabilityId}`
      );
      setSelectedItem(data);
      setRecurring(recurring);
      setAction(action);
      setErrors([]);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `GET:${process.env.REACT_APP_UNAVAILABILITY_DETAIL}`,
        errorResponse
      );
      setErrors(newErrMsgs);
    }
  };

  const showEditIcon = (row) => {
    return (
      isCaseOrLocalOrProgramStaffManager() &&
      row.editable === "Y" &&
      isUpdateAccessExist()
    );
  };

  const enableRequestButton = () => {
    return (
      isCaseOrLocalOrProgramStaffManager() && isUpdateAccessExist() && userId
    );
  };

  const showApproveIcon = (row) => {
    return (
      isLocalOrProgramStaffManager() &&
      row.approveInd === "Y" &&
      isUpdateAccessExist()
    );
  };

  const showRejectIcon = (row) => {
    return (
      isLocalOrProgramStaffManager() &&
      row.rejectInd === "Y" &&
      isUpdateAccessExist()
    );
  };

  const showWithdrawIcon = (row) => {
    const isLoggedInUserSelectedCaseManager =
      userId === getCookieItem(CookieNames.USER_ID);
    return (
      isLoggedInUserSelectedCaseManager &&
      row.withdrawInd === "Y" &&
      isUpdateAccessExist()
    );
  };

  const handleFormIconClick = (unavailabilityId, recurring, currentAction) => {
    if (isFormDirty) {
      setAlertDialogOpen(true);
      return;
    }
    fetchUnavailabilityDetails(unavailabilityId, recurring, currentAction);
  };

  return (
    <Box sx={{ paddingBottom: 0, paddingTop: 0.5 }}>
      <Stack spacing={1}>
        <Stack
          direction="row"
          style={{ marginTop: "0.5rem" }}
          spacing={1}
          alignItems="center"
        >
          <FormControl sx={{ width: "15rem" }} size="small">
            <InputLabel id="select-source-label">Staff name *</InputLabel>
            <Select
              labelId="select-source-label"
              size="small"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setStartDate(null);
                setEndDate(null);
              }}
              label="Staff name:"
            >
              {appointmentStaffList.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
                  {staff.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography className="label-text">
            Unavailability between:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={1}>
              <DatePicker
                label="Start Date *"
                slotProps={{
                  textField: { size: "small" },
                }}
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
                renderInput={(params) => (
                  <TextField {...params} size="small" variant="outlined" />
                )}
              />
            </Stack>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={1}>
              <DatePicker
                label="End Date"
                slotProps={{
                  textField: { size: "small" },
                }}
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                renderInput={(params) => (
                  <TextField {...params} size="small" variant="outlined" />
                )}
              />
            </Stack>
          </LocalizationProvider>
          <FormControl sx={{ width: "12rem" }} size="small">
            <InputLabel id="select-source-label-status">
              Staff Status
            </InputLabel>
            <Select
              labelId="select-source-label-status"
              size="small"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              label="Staff Status:"
            >
              <MenuItem value="">None</MenuItem>
              {staffStatusList?.map((status) => (
                <MenuItem key={status?.id} value={status?.id}>
                  {status?.desc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip
            title={
              !userId || !startDate
                ? "Please select staff name and start date "
                : "Refresh"
            }
            placement="right"
          >
            <IconButton
              onClick={(e) => fetchStaffUnavailability(e)}
              // disabled={}
            >
              <AutorenewIcon fontSize="small" style={{ color: "#183084" }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <TableContainer
          component={Paper}
          style={{ maxHeight: "12rem", marginTop: "10px" }}
        >
          <Table
            sx={{ tableLayout: "fixed", width: "100%" }}
            aria-label="unavailability table"
            size="small"
            stickyHeader
          >
            <TableHead style={{ backgroundColor: "#183084" }}>
              <TableRow>
                <StyledHeaderTableCell sx={{ width: "15%" }}>
                  Staff Name
                </StyledHeaderTableCell>
                <StyledHeaderTableCell sx={{ width: "10%" }}>
                  Type
                </StyledHeaderTableCell>
                <StyledHeaderTableCell sx={{ width: "25%" }}>
                  <TableSortLabel
                    active="period"
                    direction={
                      sortBy.field === "period" ? sortBy.direction : "asc"
                    }
                    onClick={() => handleRequestSort("period")}
                    sx={tableSortActiveLabelWithoutHover}
                  >
                    Period
                  </TableSortLabel>
                </StyledHeaderTableCell>

                <StyledHeaderTableCell sx={{ width: "10%" }}>
                  Reason
                </StyledHeaderTableCell>
                <StyledHeaderTableCell sx={{ width: "10%" }}>
                  Status
                </StyledHeaderTableCell>
                {/* <StyledHeaderTableCell>Notes</StyledHeaderTableCell> */}
                <StyledHeaderTableCell></StyledHeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={row.unavailabilityId}>
                  <StyledRowTableCell>{row.staffName}</StyledRowTableCell>
                  <StyledRowTableCell>{row.type}</StyledRowTableCell>
                  <StyledRowTableCell>{row.period}</StyledRowTableCell>
                  <StyledRowTableCell>{row.reason}</StyledRowTableCell>
                  <StyledRowTableCell>{row.status}</StyledRowTableCell>
                  {/* <StyledRowTableCell sx={{ width: "30rem" }}>
                    {row.notes.length > 20
                      ? `${row.notes.substring(0, 40)}...`
                      : row.notes}
                  </StyledRowTableCell> */}
                  <StyledRowTableCell>
                    <Stack direction="row">
                      <Tooltip title={"View Details"} placement="top">
                        <IconButton
                          sx={{
                            padding: "0px",
                            marginRight: "20px !important",
                          }}
                          onClick={() =>
                            handleFormIconClick(
                              row.unavailabilityId,
                              row.recurring,
                              "View"
                            )
                          }
                        >
                          <RemoveRedEyeIcon
                            fontSize="small"
                            style={{ color: "#183084" }}
                          />
                        </IconButton>
                      </Tooltip>
                      {showEditIcon(row) && (
                        <Tooltip title={"Edit"} placement="top">
                          <IconButton
                            sx={{
                              padding: "0px",
                              marginRight: "20px !important",
                            }}
                            onClick={() =>
                              handleFormIconClick(
                                row.unavailabilityId,
                                row.recurring,
                                "Edit"
                              )
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              style={{ color: "#183084" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      {showApproveIcon(row) && (
                        <Tooltip title={"Approve"} placement="top">
                          <IconButton
                            sx={{
                              padding: "0px",
                              marginRight: "20px !important",
                            }}
                            onClick={() =>
                              handleFormIconClick(
                                row.unavailabilityId,
                                row.recurring,
                                "Approve"
                              )
                            }
                          >
                            <CheckCircleIcon
                              fontSize="small"
                              style={{ color: "green" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      {showRejectIcon(row) && (
                        <Tooltip title={"Reject"} placement="top">
                          <IconButton
                            sx={{
                              padding: "0px",
                              marginRight: "20px !important",
                            }}
                            onClick={() =>
                              handleFormIconClick(
                                row.unavailabilityId,
                                row.recurring,
                                "Reject"
                              )
                            }
                          >
                            <CancelPresentationIcon
                              fontSize="small"
                              style={{ color: "red" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      {showWithdrawIcon(row) && (
                        <Tooltip title={"Withdraw"} placement="top">
                          <IconButton
                            sx={{
                              padding: "0px",
                              marginRight: "20px !important",
                            }}
                            onClick={() =>
                              handleFormIconClick(
                                row.unavailabilityId,
                                row.recurring,
                                "Withdraw"
                              )
                            }
                          >
                            <SystemUpdateAltIcon
                              fontSize="small"
                              style={{ color: "#e08341" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
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
          {errors.map((x) => (
            <div>
              <span className="errorMsg">*{x}</span>
            </div>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            color="primary"
            size={"small"}
            onClick={handleOneTimeShow}
            disabled={!enableRequestButton()}
          >
            + Request One-time Unavailability
          </Button>
          <Button
            variant="text"
            color="primary"
            size={"small"}
            onClick={handleRecurringShow}
            disabled={!enableRequestButton()}
          >
            + Request Recurring Unavailability
          </Button>
        </Stack>
        <Divider />
        {action && (
          <Stack>
            <UnavailabilityForm
              //this key is to ensure compomemt force remount on action chnage to refresh form data
              key={
                action +
                (recurring || selectedItem?.recurring) +
                (selectedItem?.unavailabilityId || "")
              }
              userId={userId}
              recurring={recurring}
              selectedItem={selectedItem}
              action={action}
              onCancel={onCancel}
              fetchStaffUnavailability={fetchStaffUnavailability}
              setAlertDialogOpen={setAlertDialogOpen}
              setIsFormDirty={setIsFormDirty}
            />
          </Stack>
        )}
        <CustomModal
          open={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          title="Alert"
        >
          <Typography sx={{ padding: "1.25rem" }}>
            {getAlertMessage(action)}
          </Typography>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              onClick={() => setAlertDialogOpen(false)}
              sx={{ margin: "0 1rem 1rem 1rem" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </CustomModal>
      </Stack>
    </Box>
  );
};
export default UnavailabilityList;
