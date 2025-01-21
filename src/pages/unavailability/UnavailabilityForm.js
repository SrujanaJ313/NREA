import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import client from "../../helpers/Api";
import {
  unavailabilityApproveURL,
  unavailabilityReasonURL,
  unavailabilityRejectURL,
  unavailabilityRequestURL,
  unavailabilityWithdrawURL,
} from "../../helpers/Urls";
import { getMsgsFromErrorCode } from "../../helpers/utils";
import { useSnackbar } from "../../context/SnackbarContext";
import { getValidationSchema } from "./unavailabilityUtils";
import UnavailabilityDates from "./UnavailabilityDates";
import AdditionalWaithdrawForm from "./AdditionalWaithdrawForm";
import AddToNotes from "./AddToNotes";
import AdditionalApprovalForm from "./AdditionalApprovalForm";
import sortBy from "lodash/sortBy";
import { isCaseManager } from "../../utils/users";
const INITIAL_DATA = {
  startDt: null,
  startTime: "",
  endDt: null,
  endTime: "",
  days: [],
  reason: "",
  notes: "",
  recurring: false,
  referenceNotes: "",
  withdrawDt: null,
  withdrawTime: null,
  withdrawOption: "as-is",
  action: "",
  isLoggedUserSameAsSelectedUser: false,
  // approvalOption: "approve-as-is",
};

const UnavailabilityForm = ({
  recurring,
  userId,
  selectedItem,
  action,
  onCancel,
  fetchStaffUnavailability,
  setIsFormDirty,
}) => {
  const [errors, setErrors] = useState([]);
  const [unavailabilityReasons, setUnavailabilityReasons] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [title, setTitle] = useState("");
  const showSnackbar = useSnackbar();

  const onFormSubmit = async (values) => {
    const body = {
      userId: userId,
      startDt: moment(values.startDt).format("MM/DD/YYYY"),
      startTime: values.startTime,
      endDt: moment(values.endDt).format("MM/DD/YYYY"),
      endTime: values.endTime,
      days: values.days || [],
      reason: values.reason,
      notes: values.notes,
      recurring: values.recurring,
    };
    try {
      switch (action) {
        case "New":
          await client.post(unavailabilityRequestURL, body);
          showSnackbar("Your request has been recorded successfully.", 5000);
          break;
        case "Approve":
          await client.post(
            `${unavailabilityApproveURL}/${selectedItem.unavailabilityId}`,
            {}
          );
          showSnackbar("Approved successfully.", 5000);
          break;
        case "Reject":
          await client.post(unavailabilityRejectURL, {
            ...body,
            unavailabilityId: selectedItem.unavailabilityId,
          });
          showSnackbar("Rejected successfully.", 5000);
          break;
        case "Withdraw":
          await client.post(unavailabilityWithdrawURL, {
            unavailabilityId: selectedItem.unavailabilityId,
            notes: values.notes,
            ...(values.withdrawOption === "withdraw-from-date" && {
              withdrawDt: moment(values.withdrawDt).format("MM/DD/YYYY"),
            }),
            ...(values.withdrawOption === "withdraw-from-date" &&
              !values.recurring && {
                withdrawTime: values.withdrawTime,
              }),
          });

          showSnackbar("Withdrawn successfully.", 5000);
          break;
        case "Edit":
          await client.post(unavailabilityRequestURL, {
            ...body,
            unavailabilityId: selectedItem.unavailabilityId,
          });
          showSnackbar("Your request has been recorded successfully.", 5000);
          break;
        default:
          break;
      }
      await fetchStaffUnavailability();
      onCancel();
      setErrors([]);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_UNAVAILABILITY_REQUEST}`,
        errorResponse
      );
      setErrors(newErrMsgs);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: getValidationSchema(action),
    onSubmit: onFormSubmit,
  });

  useEffect(() => {
    if (selectedItem) {
      formik.resetForm({
        values: {
          ...INITIAL_DATA,
          startDt: moment(selectedItem.startDt),
          startTime: selectedItem.startTime,
          endDt: moment(selectedItem.endDt),
          endTime: selectedItem.endTime,
          days: selectedItem.days || [],
          reason: selectedItem.reason,
          notes: selectedItem.notes || "",
          referenceNotes: selectedItem.referenceNotes,
          recurring: selectedItem.recurring,
          action: action,
          isLoggedUserSameAsSelectedUser: isCaseManager(),
        },
      });

      const recur = recurring ? "Recurring" : "One-Time";
      if (action === "Edit") {
        setDisableForm(false);
        setTitle(`${action} ${recur} Unavailability Request`);
      } else {
        setTitle(`${action} ${recur} Unavailability Request`);
        setDisableForm(true);
      }
    } else {
      formik.resetForm({ values: { ...INITIAL_DATA, recurring, action } });
      setDisableForm(false);
      if (recurring) {
        setTitle("Recurring Unavailability Request");
      } else {
        setTitle("One-Time Unavailability Request");
      }
    }
  }, [recurring, selectedItem, action]);

  useEffect(() => {
    async function fetchUnavailabilityReasons() {
      try {
        const data = await client.get(unavailabilityReasonURL);
        setUnavailabilityReasons(
          sortBy(data, (item) => item.desc.toLowerCase())
        );
        setErrors([]);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_CASE_UNAVAILABILITY_REASON}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }

    fetchUnavailabilityReasons();
  }, []);

  useEffect(() => {
    if (formik.dirty) {
      setIsFormDirty(true);
    }
  }, [formik.dirty]);

  const handleDaysSelection = (day, checked) => {
    const selectedDays = [...formik.values.days];
    if (checked) {
      selectedDays.push(day);
    } else {
      const index = selectedDays.findIndex((d) => d === day);
      selectedDays.splice(index, 1);
    }
    formik.setFieldValue("days", selectedDays);
  };

  return (
    <>
      <Box
        boxSizing="border-box"
        sx={{
          backgroundColor: "#183084",
          padding: "4px",
          color: "white",
        }}
      >
        {title}
      </Box>

      <Stack
        spacing={1.5}
        marginTop={1.5}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/*{action === "Approve" && (*/}
          {/*  <AdditionalApprovalForm*/}
          {/*    formik={formik}*/}
          {/*    setDisableForm={setDisableForm}*/}
          {/*  />*/}
          {/*)}*/}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <UnavailabilityDates
            recurring={recurring}
            formik={formik}
            disableForm={disableForm}
          />
        </Stack>
        {recurring && (
          <Stack direction="row">
            <Typography className="label-text" sx={{ marginRight: 2 }}>
              <span>*</span>Recurrence days:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disableForm}
                  sx={{ py: 0 }}
                  checked={formik.values.days.includes(2)}
                  onChange={(event) =>
                    handleDaysSelection(2, event.target.checked)
                  }
                  name="2"
                />
              }
              label="Monday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disableForm}
                  sx={{ py: 0 }}
                  checked={formik.values.days.includes(3)}
                  onChange={(event) =>
                    handleDaysSelection(3, event.target.checked)
                  }
                  name="3"
                />
              }
              label="Tuesday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disableForm}
                  sx={{ py: 0 }}
                  checked={formik.values.days.includes(4)}
                  onChange={(event) =>
                    handleDaysSelection(4, event.target.checked)
                  }
                  name="4"
                />
              }
              label="Wednesday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disableForm}
                  sx={{ py: 0 }}
                  checked={formik.values.days.includes(5)}
                  onChange={(event) =>
                    handleDaysSelection(5, event.target.checked)
                  }
                  name="5"
                />
              }
              label="Thursday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disableForm}
                  sx={{ py: 0 }}
                  checked={formik.values.days.includes(6)}
                  onChange={(event) =>
                    handleDaysSelection(6, event.target.checked)
                  }
                  name="6"
                />
              }
              label="Friday"
            />
          </Stack>
        )}
        {formik.touched.days && formik.errors.days && (
          <FormHelperText error>{formik.errors.days}</FormHelperText>
        )}
        <Stack direction={"column"} justifyContent={"space-between"}>
          <FormControl
            size="small"
            // fullWidth
            sx={{ width: "30rem" }}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
          >
            <InputLabel id="reason-dropdown">*Reason</InputLabel>
            <Select
              disabled={disableForm}
              label="*Reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              name="reason"
              sx={{ width: "50%" }}
            >
              {unavailabilityReasons?.map((reason) => (
                <MenuItem key={reason.id} value={reason.id}>
                  {reason.desc}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.reason && formik.errors.reason && (
              <Typography variant="caption" color="error">
                {formik.errors.reason}
              </Typography>
            )}
          </FormControl>
        </Stack>
        {action === "Withdraw" && (
          <AdditionalWaithdrawForm formik={formik} disableForm={disableForm} />
        )}
        {action !== "New" && (
          <Stack direction={"column"} spacing={2} sx={{ maxWidth: "48rem" }}>
            <TextField
              disabled={true}
              name="referenceNotes"
              label="Notes"
              size="small"
              value={formik.values.referenceNotes?.split("<br/>").join("\n")}
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              error={
                formik.touched.referenceNotes &&
                Boolean(formik.errors.referenceNotes)
              }
              helperText={
                formik.touched.referenceNotes && formik.errors.referenceNotes
              }
            />
          </Stack>
        )}

        <AddToNotes formik={formik} />
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
        <Stack direction="row" justifyContent="center" spacing={2}>
          {action !== "View" && (
            <Button variant="contained" type="submit" color="primary">
              {action === "New" || action === "Edit" ? "Request" : action}
            </Button>
          )}
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
export default UnavailabilityForm;
