import React, { useState, useEffect } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";

const AddToNotes = ({ formik, disableForm, charLimit = 200 }) => {
  const [notes, setNotes] = useState(formik.values.notes || "");
  const [charCount, setCharCount] = useState(notes.length);

  const debouncedUpdateFormik = debounce((value) => {
    formik.setFieldValue("notes", value);
  }, 100);

  useEffect(() => {
    debouncedUpdateFormik(notes);
  }, [notes]);

  const handleNotesChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setNotes(value);
      setCharCount(value.length);
    }
  };

  const showAddToNotes =
    formik.values.action !== "View" && formik.values.action !== "Approve";
  return (
    showAddToNotes && (
      <Stack direction={"column"} spacing={2} sx={{ maxWidth: "48rem" }}>
        <TextField
          disabled={disableForm}
          name="notes"
          label="*Add to Notes"
          size="small"
          value={notes}
          onChange={handleNotesChange}
          // onBlur={formik.handleBlur}
          variant="outlined"
          rows={3}
          // fullWidth
          multiline
          inputProps={{ maxLength: charLimit }}
          error={formik.touched.notes && Boolean(formik.errors.notes)}
          helperText={formik.touched.notes && formik.errors.notes}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: "0", fontSize: "0.9em", alignSelf: "end" }}
        >
          {charCount}/{charLimit}
        </Typography>
      </Stack>
    )
  );
};

export default AddToNotes;
