import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment/moment";
import React from "react";
import { UNAVAILABILITY_TIMES } from "./unavailabilityConstants";

const UnavailabilityDates = ({ recurring, formik, disableForm }) => {
  return !recurring ? (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={1}>
          <DatePicker
            disabled={disableForm}
            label="*From"
            slotProps={{
              textField: {
                size: "small",
                sx: { maxWidth: "9rem" },
                error:
                  Boolean(formik.touched?.startDt) &&
                  Boolean(formik.errors.startDt),
                helperText:
                  Boolean(formik.touched?.startDt) && formik.errors.startDt,
              },
            }}
            value={formik.values.startDt}
            onChange={(date) => formik.setFieldValue("startDt", date)}
            onBlur={formik.handleBlur}
          />
        </Stack>
      </LocalizationProvider>

      <FormControl
        size={"small"}
        style={{ marginLeft: 10, marginRight: 20, width: "7rem" }}
      >
        <InputLabel id="startTime">*At</InputLabel>
        <Select
          id="startTime-select"
          disabled={disableForm}
          label="*At"
          error={
            Boolean(formik.touched?.startTime) &&
            Boolean(formik.errors.startTime)
          }
          helperText={
            Boolean(formik.touched?.startTime) && formik.errors.startTime
          }
          onBlur={formik.handleBlur}
          value={formik.values.startTime}
          onChange={(e) => formik.setFieldValue("startTime", e.target.value)}
          name={"startTime"}
        >
          {UNAVAILABILITY_TIMES.map((t) => {
            return (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            );
          })}
        </Select>
        {Boolean(formik.touched?.startTime) &&
          Boolean(formik.errors.startTime) && (
            <FormHelperText style={{ color: "red" }}>
              {formik.errors.startTime}
            </FormHelperText>
          )}
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={1} style={{ marginLeft: "7rem" }}>
          <DatePicker
            disabled={disableForm}
            label="*To"
            slotProps={{
              textField: {
                size: "small",
                sx: { maxWidth: "9rem", marginLeft: "5rem" },
                error:
                  Boolean(formik.touched?.endDt) &&
                  Boolean(formik.errors.endDt),
                helperText:
                  Boolean(formik.touched?.endDt) && formik.errors.endDt,
              },
            }}
            value={formik.values.endDt}
            onChange={(date) => formik.setFieldValue("endDt", date)}
            onBlur={formik.handleBlur}
          />
        </Stack>
      </LocalizationProvider>

      <FormControl size={"small"} style={{ marginLeft: 10, width: "7rem" }}>
        <InputLabel id="endTime">*At</InputLabel>
        <Select
          id="endTime-select"
          disabled={disableForm}
          label="*At"
          error={
            Boolean(formik.touched?.endTime) && Boolean(formik.errors.endTime)
          }
          helperText={Boolean(formik.touched?.endTime) && formik.errors.endTime}
          onBlur={formik.handleBlur}
          value={formik.values.endTime}
          onChange={(e) => formik.setFieldValue("endTime", e.target.value)}
          name={"endTime"}
        >
          {UNAVAILABILITY_TIMES.map((t) => {
            return (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            );
          })}
        </Select>
        {Boolean(formik.touched?.endTime) && Boolean(formik.errors.endTime) && (
          <FormHelperText style={{ color: "red" }}>
            {formik.errors.endTime}
          </FormHelperText>
        )}
      </FormControl>
    </>
  ) : (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={1}>
          <DatePicker
            label="Start Date"
            slotProps={{
              textField: {
                size: "small",
                sx: { maxWidth: "9rem" },
                error:
                  Boolean(formik.touched?.startDt) &&
                  Boolean(formik.errors.startDt),
                helperText:
                  Boolean(formik.touched?.startDt) && formik.errors.startDt,
              },
            }}
            value={formik.values.startDt}
            onChange={(date) => formik.setFieldValue("startDt", date)}
            onBlur={formik.handleBlur}
            disabled={disableForm}
          />
        </Stack>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={1}>
          <DatePicker
            label="End Date"
            slotProps={{
              textField: {
                size: "small",
                sx: { maxWidth: "9rem" },
                error:
                  Boolean(formik.touched?.endDt) &&
                  Boolean(formik.errors.endDt),
                helperText:
                  Boolean(formik.touched?.endDt) && formik.errors.endDt,
              },
            }}
            value={formik.values.endDt}
            onChange={(date) => formik.setFieldValue("endDt", date)}
            onBlur={formik.handleBlur}
            disabled={disableForm}
          />
        </Stack>
      </LocalizationProvider>
      <Typography className="label-text" style={{ marginLeft: "7rem" }}>
        Recurring time off:
      </Typography>
      <FormControl size={"small"} style={{ marginLeft: 10, width: "7rem" }}>
        <InputLabel id="startTime">*At</InputLabel>
        <Select
          id="startTime-select"
          disabled={disableForm}
          label="*At"
          error={
            Boolean(formik.touched?.startTime) &&
            Boolean(formik.errors.startTime)
          }
          helperText={
            Boolean(formik.touched?.startTime) && formik.errors.startTime
          }
          // onBlur={formik.handleBlur}
          value={formik.values.startTime}
          onChange={(e) => formik.setFieldValue("startTime", e.target.value)}
          name={"startTime"}
        >
          {UNAVAILABILITY_TIMES.map((t) => {
            return (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            );
          })}
        </Select>
        {Boolean(formik.touched?.startTime) &&
          Boolean(formik.errors.startTime) && (
            <FormHelperText style={{ color: "red" }}>
              {formik.errors.startTime}
            </FormHelperText>
          )}
      </FormControl>
      <FormControl size={"small"} style={{ marginLeft: 10, width: "7rem" }}>
        <InputLabel id="endTime">*At</InputLabel>
        <Select
          id="endTime-select"
          disabled={disableForm}
          label="*At"
          error={
            Boolean(formik.touched?.endTime) && Boolean(formik.errors.endTime)
          }
          helperText={Boolean(formik.touched?.endTime) && formik.errors.endTime}
          // onBlur={formik.handleBlur}
          value={formik.values.endTime}
          onChange={(e) => formik.setFieldValue("endTime", e.target.value)}
          name={"endTime"}
        >
          {UNAVAILABILITY_TIMES.map((t) => {
            return (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            );
          })}
        </Select>
        {Boolean(formik.touched?.endTime) && Boolean(formik.errors.endTime) && (
          <FormHelperText style={{ color: "red" }}>
            {formik.errors.endTime}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default UnavailabilityDates;
