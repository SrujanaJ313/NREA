import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { UNAVAILABILITY_TIMES } from "./unavailabilityConstants";

const AdditionalWithdrawForm = ({ formik }) => {
  const handleRadioChange = (event) => {
    formik.setFieldValue("withdrawOption", event.target.value);
    if (event.target.value === "as-is") {
      formik.setFieldValue("withdrawDt", null);
      formik.setFieldValue("withdrawTime", null);
    }
  };

  return (
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={formik.values.withdrawOption}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="as-is"
            control={<Radio />}
            label="Withdraw as is"
          />
          <FormControlLabel
            value="withdraw-from-date"
            control={<Radio />}
            label="Withdraw starting from"
          />
        </RadioGroup>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={1} direction="row">
          <DatePicker
            slotProps={{
              textField: {
                size: "small",
                sx: { maxWidth: "12rem" },
                error:
                  Boolean(formik.touched?.withdrawDt) &&
                  Boolean(formik.errors.withdrawDt),
                helperText:
                  Boolean(formik.touched?.withdrawDt) &&
                  formik.errors.withdrawDt,
              },
            }}
            label="Start date of withdrawal"
            value={formik.values.withdrawDt}
            onChange={(date) => formik.setFieldValue("withdrawDt", date)}
            onBlur={formik.handleBlur}
            disabled={formik.values.withdrawOption !== "withdraw-from-date"}
          />
          {!formik.values.recurring && (
            <FormControl
              size={"small"}
              style={{ marginLeft: 10, marginRight: 20, width: "7rem" }}
            >
              <InputLabel id="withdrawTime">*At</InputLabel>
              <Select
                id="withdrawTime-select"
                disabled={formik.values.withdrawOption !== "withdraw-from-date"}
                label="*Withdrawal time"
                error={
                  Boolean(formik.touched?.withdrawTime) &&
                  Boolean(formik.errors.withdrawTime)
                }
                helperText={
                  Boolean(formik.touched?.withdrawTime) &&
                  formik.errors.withdrawTime
                }
                onBlur={formik.handleBlur}
                value={formik.values.withdrawTime}
                onChange={(e) =>
                  formik.setFieldValue("withdrawTime", e.target.value)
                }
                name={"withdrawTime"}
              >
                {UNAVAILABILITY_TIMES.map((t) => {
                  return (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  );
                })}
              </Select>
              {Boolean(formik.touched?.withdrawTime) &&
                Boolean(formik.errors.withdrawTime) && (
                  <FormHelperText style={{ color: "red" }}>
                    {formik.errors.withdrawTime}
                  </FormHelperText>
                )}
            </FormControl>
          )}
        </Stack>
      </LocalizationProvider>
    </Stack>
  );
};

export default AdditionalWithdrawForm;
