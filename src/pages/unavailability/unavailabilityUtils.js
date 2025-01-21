import {
  approveRequestValidationSchema,
  newOrEditRequestValidationSchema,
  rejectRequestValidationSchema,
  withdrawRequestValidationSchema,
} from "./validations";

export const getValidationSchema = (action) => {
  switch (action) {
    case "New":
      return newOrEditRequestValidationSchema;
    case "Edit":
      return newOrEditRequestValidationSchema;
    case "Approve":
      return approveRequestValidationSchema;
    case "Reject":
      return rejectRequestValidationSchema;
    case "Withdraw":
      return withdrawRequestValidationSchema;
    default:
      return newOrEditRequestValidationSchema;
  }
};

export const getAlertMessage = (action) => {
  switch (action) {
    case "New":
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
    case "Edit":
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
    case "Approve":
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
    case "Reject":
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
    case "Withdraw":
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
    default:
      return "Changes to an unavailability request must be recorded by Staff before moving to the next unavailability request.";
  }
};
