import React, { useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { isCaseManager } from "../../utils/users";

const AdditionalApprovalForm = ({ formik, setDisableForm }) => {
  const handleRadioChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("approvalOption", value);
    setDisableForm(value === "approve-as-is");
  };

  useEffect(() => {
    if (formik.values.approvalOption === "approve-as-is") {
      setDisableForm(true);
    }
  }, []);

  return (
    <Stack direction="column" alignItems="flex-start" spacing={0}>
      {!isCaseManager() && (
        <Stack>
          <Typography sx={{ color: "#183084", fontWeight: "600" }}>
            If you would like to alter this request prior to approval, please
            use edit.
          </Typography>
        </Stack>
      )}
      <Stack>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={formik.values.approvalOption}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="approve-as-is"
              control={<Radio />}
              label="Approve as is"
            />
            <FormControlLabel
              value="approve-with-changes"
              control={<Radio />}
              label="Approve with changes"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default AdditionalApprovalForm;
