import * as yup from "yup";

import moment from "moment";

const newOrEditRequestValidationSchema = yup.object().shape({
  startDt: yup
    .date()
    .nullable()
    .when("recurring", {
      is: false,
      then: () =>
        yup
          .date()
          .nullable()
          .required("Start Date is required")
          .test(
            "is-today-or-future",
            "Start Date must be today or future date",
            (value) => {
              const todayMoment = moment().startOf("day");
              const startDtMoment = moment(value).startOf("day");
              return startDtMoment.isSameOrAfter(todayMoment);
            }
          ),
      otherwise: () =>
        yup
          .date()
          .nullable()
          .required("Start Date is required")
          .test("is-future", "Start Date must be future date", (value) => {
            const todayMoment = moment().startOf("day");
            const startDtMoment = moment(value).startOf("day");
            return startDtMoment.isAfter(todayMoment);
          }),
    }),
  startTime: yup.string().required("Start Time is required"),
  //   .test(
  //     "is-valid-time",
  //     "Start Time must be between 7 AM and 5 PM",
  //     (value) => {
  //       const time = moment(value, "hh:mm A");
  //       const start = moment("07:00 AM", "hh:mm A");
  //       const end = moment("05:00 PM", "hh:mm A");
  //       return time.isSameOrAfter(start) && time.isSameOrBefore(end);
  //     }
  //   )
  //   .when("recurring", {
  //     is: false,
  //     then: () =>
  //       yup
  //         .string()
  //         .test(
  //           "is-future-time",
  //           "Start Date and Time combined must be in the future for one-time requests",
  //           function (value) {
  //             const { startDt } = this.parent;
  //             const now = moment();
  //             const start = moment(startDt).set({
  //               hour: moment(value, "hh:mm A").hour(),
  //               minute: moment(value, "hh:mm A").minute(),
  //             });
  //             return start.isAfter(now);
  //           }
  //         ),
  //   }),
  endDt: yup
    .date()
    .nullable()
    .when("recurring", {
      is: false,
      then: () =>
        yup
          .date()
          .nullable()
          .required("End Date is required")
          .test(
            "is-greater-than-or-equal-to-start-date",
            "End Date must be greater than or equal to start date",
            function (value) {
              const { startDt } = this.parent;
              const startDtMoment = moment(startDt).startOf("day");
              const endDtMoment = moment(value).startOf("day");
              return endDtMoment.isSameOrAfter(startDtMoment);
            }
          ),
      otherwise: () =>
        yup
          .date()
          .nullable()
          .required("End Date is required")
          .test(
            "is-greater-start-date",
            "End Date must be greater than start date",
            function (value) {
              const { startDt } = this.parent;
              const startDtMoment = moment(startDt).startOf("day");
              const endDtMoment = moment(value).startOf("day");
              return endDtMoment.isAfter(startDtMoment);
            }
          ),
    }),
  endTime: yup
    .string()
    .nullable()
    .when("recurring", {
      is: true,
      then: () =>
        yup
          .string()
          .nullable()
          .required("End time is required")
          .test(
            "is-valid-recurring-end-time",
            "End time must be greater than start time",
            function (value) {
              const { startTime } = this.parent;
              const startTimeMoment = moment(startTime, "hh:mm A");
              const endTimeMoment = moment(value, "hh:mm A");
              return endTimeMoment.isAfter(startTimeMoment);
            }
          ),
      otherwise: () =>
        yup
          .string()
          .nullable()
          .required("End time is required")
          .test(
            "is-valid-end-time",
            "End date time should be greater than start date time",
            function (value) {
              const { startTime, startDt, endDt } = this.parent;
              const startTimeMoment = moment(startTime, "hh:mm A");
              const endTimeMoment = moment(value, "hh:mm A");
              const startDateTimeMoment = moment(startDt).set({
                hour: startTimeMoment.hour(),
                minute: startTimeMoment.minute(),
              });
              const endDateTimeMoment = moment(endDt).set({
                hour: endTimeMoment.hour(),
                minute: endTimeMoment.minute(),
              });
              return endDateTimeMoment.isAfter(startDateTimeMoment);
            }
          ),
    }),
  reason: yup
    .string()
    .required("Reason for unavailability request is required"),
  notes: yup.string().when(["isLoggedUserSameAsSelectedUser", "action"], {
    is: (isLoggedUserSameAsSelectedUser, action) =>
      action === "New" ||
      (action === "Edit" && !isLoggedUserSameAsSelectedUser),
    then: () => yup.string().required("Notes are required"),
    otherwise: () => yup.string().nullable(),
  }),
  days: yup.array().when("recurring", {
    is: true,
    then: () =>
      yup
        .array()
        .test(
          "days-selected",
          "At least one day must be selected",
          function (value) {
            return value.length > 0;
          }
        ),
  }),
});

const approveRequestValidationSchema = yup.object().shape({
  endDt: yup
    .date()
    .nullable()
    .when("recurring", {
      is: false,
      then: () =>
        yup
          .date()
          .nullable()
          .required("End Date is required")
          .test(
            "is-greater-than-or-equal-to-start-date",
            "End Date must be greater than or equal to start date",
            function (value) {
              const { startDt } = this.parent;
              const startDtMoment = moment(startDt).startOf("day");
              const endDtMoment = moment(value).startOf("day");
              return endDtMoment.isSameOrAfter(startDtMoment);
            }
          ),
      otherwise: () =>
        yup
          .date()
          .nullable()
          .required("End Date is required")
          .test(
            "is-greater-start-date",
            "End Date must be greater than start date",
            function (value) {
              const { startDt } = this.parent;
              const startDtMoment = moment(startDt).startOf("day");
              const endDtMoment = moment(value).startOf("day");
              return endDtMoment.isAfter(startDtMoment);
            }
          ),
    }),
  endTime: yup
    .string()
    .nullable()
    .when("recurring", {
      is: true,
      then: () =>
        yup
          .string()
          .nullable()
          .required("End time is required")
          .test(
            "is-valid-recurring-end-time",
            "End time must be greater than start time",
            function (value) {
              const { startTime } = this.parent;
              const startTimeMoment = moment(startTime, "hh:mm A");
              const endTimeMoment = moment(value, "hh:mm A");
              return endTimeMoment.isAfter(startTimeMoment);
            }
          ),
      otherwise: () =>
        yup
          .string()
          .nullable()
          .required("End time is required")
          .test(
            "is-valid-end-time",
            "End date time should be greater than start date time",
            function (value, context) {
              const { startTime, startDt, endDt } = this.parent;
              const startTimeMoment = moment(startTime, "hh:mm A");
              const endTimeMoment = moment(value, "hh:mm A");
              const startDateTimeMoment = moment(startDt).set({
                hour: startTimeMoment.hour(),
                minute: startTimeMoment.minute(),
              });
              const endDateTimeMoment = moment(endDt).set({
                hour: endTimeMoment.hour(),
                minute: endTimeMoment.minute(),
              });
              return endDateTimeMoment.isAfter(startDateTimeMoment);
            }
          ),
    }),
  reason: yup
    .string()
    .required("Reason for unavailability request is required"),
  // notes: yup.string().required("Notes are required"),
  days: yup.array().when("recurring", {
    is: true,
    then: () =>
      yup
        .array()
        .test(
          "days-selected",
          "At least one day must be selected",
          function (value) {
            return value.length > 0;
          }
        ),
  }),
});

const rejectRequestValidationSchema = yup.object().shape({
  notes: yup.string().required("Notes are required"),
});

const withdrawRequestValidationSchema = yup.object().shape({
  withdrawDt: yup
    .date()
    .nullable()
    .when(["withdrawOption", "recurring"], {
      is: (withdrawOption, recurring) =>
        withdrawOption === "withdraw-from-date" && recurring === true,
      then: () =>
        yup
          .date()
          .nullable()
          .required("Withdrawal start date is required")
          .test(
            "withdrawal-date-recurring",
            "Start Date of withdrawal should be greater than start date, future date and less than end date",
            function (value) {
              const todayDtMoment = moment().startOf("day");
              const withdrawDtMoment = moment(value).startOf("day");
              const startDtMoment = moment(this.parent.startDt).startOf("day");
              const endDtMoment = moment(this.parent.endDt).startOf("day");
              return (
                withdrawDtMoment.isAfter(todayDtMoment) &&
                withdrawDtMoment.isAfter(startDtMoment) &&
                withdrawDtMoment.isBefore(endDtMoment)
              );
            }
          ),
    })
    .when(["withdrawOption", "recurring"], {
      is: (withdrawOption, recurring) =>
        withdrawOption === "withdraw-from-date" && !recurring,
      then: () =>
        yup
          .date()
          .nullable()
          .required("Withdrawal start date is required")
          .test(
            "withdrawal-date-non-recurring",
            "Start Date of withdrawal should be greater than start date, future date and less than end date",
            function (value) {
              const todayDtMoment = moment().startOf("day");
              const withdrawDtMoment = moment(value).startOf("day");
              const startDtMoment = moment(this.parent.startDt).startOf("day");
              const endDtMoment = moment(this.parent.endDt).startOf("day");
              //withdraw> start
              return (
                withdrawDtMoment.isSameOrAfter(todayDtMoment) &&
                withdrawDtMoment.isSameOrAfter(startDtMoment) &&
                withdrawDtMoment.isBefore(endDtMoment)
              );
            }
          ),
    }),
  withdrawTime: yup
    .string()
    .nullable()
    .when(["withdrawOption", "recurring"], {
      is: (withdrawOption, recurring) =>
        withdrawOption === "withdraw-from-date" && !recurring,
      then: () =>
        yup
          .string()
          .nullable()
          .required("Withdrawal time is required")
          .test(
            "is-valid-withdraw-time",
            "Withdrawal date and time should be greater than start or current date and time, and less than end time",
            function (value) {
              const startTimeMoment = moment(this.parent.startDt).set({
                hour: moment(this.parent.startTime, "hh:mm A").hour(),
                minute: moment(this.parent.startTime, "hh:mm A").minute(),
              });
              const endTimeMoment = moment(this.parent.endDt).set({
                hour: moment(this.parent.endTime, "hh:mm A").hour(),
                minute: moment(this.parent.endTime, "hh:mm A").minute(),
              });
              const withdrawTimeMoment = moment(this.parent.withdrawDt).set({
                hour: moment(this.parent.withdrawTime, "hh:mm A").hour(),
                minute: moment(this.parent.withdrawTime, "hh:mm A").minute(),
              });
              const currentTimeMoment = moment();

              // if startTimeMoment is in future
              if (startTimeMoment.isAfter(currentTimeMoment)) {
                return (
                  withdrawTimeMoment.isAfter(startTimeMoment) &&
                  withdrawTimeMoment.isBefore(endTimeMoment)
                );
              } else if (startTimeMoment.isSameOrBefore(currentTimeMoment)) {
                return (
                  withdrawTimeMoment.isAfter(currentTimeMoment) &&
                  withdrawTimeMoment.isBefore(endTimeMoment)
                );
              }
            }
          ),
    }),
  notes: yup.string().required("Notes are required"),
});

export {
  newOrEditRequestValidationSchema,
  approveRequestValidationSchema,
  rejectRequestValidationSchema,
  withdrawRequestValidationSchema,
};
