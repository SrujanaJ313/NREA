import moment from "moment";
import { getBufferParameters } from "../utils/session";
import { MEETING_INVITE_SHOW_BUFFER_DURATION } from "./Constants";
import { decodeJwt } from "../utils/cookies";

export const getIsPastAppointment = (event) => {
  const { CURR_APP_PREP_TIME } = getBufferParameters();
  const appointmentDateTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  );
  const adjustedDateTime = appointmentDateTime.subtract(
    CURR_APP_PREP_TIME,
    "minutes"
  );
  const isPastAppointment = moment().isAfter(adjustedDateTime);
  return isPastAppointment;
};

//startTime<currentTime<endTime
export const isInCurrentAppointmentWindow = (event) => {
  const { CURR_APP_PREP_TIME, CURR_APP_CLSOUT_TIME } = getBufferParameters();
  const appointmentStartTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).subtract(CURR_APP_PREP_TIME, "minutes");
  const appointmentEndTime = moment(
    `${event.appointmentDt} ${event.endTime}`
  ).add(CURR_APP_CLSOUT_TIME, "minutes");
  const currentTime = moment();
  return (
    appointmentStartTime.isBefore(currentTime) &&
    currentTime.isBefore(appointmentEndTime)
  );
};

export const isInFutureAppointmentWindow = (event) => {
  const { RESEA_CAL_LAPSE_TIME } = getBufferParameters();
  const appointmentDateTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  );
  const adjustedDateTime = appointmentDateTime.add(
    RESEA_CAL_LAPSE_TIME,
    "minutes"
  );
  const isFutureAppointment = moment().isBefore(adjustedDateTime);
  return isFutureAppointment;
};

// currentTime-90days<appointmentStartTime<currentTime+10days
// for now we don't have to put +10days buffer. So currentTime-90days<appointmentStartTime is good enough
export const isInRTWBufferPeriod = (event) => {
  const { RESEA_RTW_PAST_DAYS } = getBufferParameters();
  const beforeBuffer = moment().subtract(RESEA_RTW_PAST_DAYS, "days");
  const appointmentDateTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  );

  return beforeBuffer.isBefore(appointmentDateTime);
};

// startTime-30mins<current time< endTime+480  || currentTime>endTime+480
export const isInAppointmenDetailsWindow = (event) => {
  const { CURR_APP_PREP_TIME, CURR_APP_CLSOUT_TIME } = getBufferParameters();
  const appointmentStartDateTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).subtract(CURR_APP_PREP_TIME, "minutes");
  const appointmentEndDateTime = moment(
    `${event.appointmentDt} ${event.endTime}`
  ).add(CURR_APP_CLSOUT_TIME, "minutes");

  const currentTime = moment();
  const isWithinAppointmentWindow =
    (appointmentStartDateTime.isBefore(currentTime) &&
      currentTime.isBefore(appointmentEndDateTime)) ||
    currentTime.isAfter(appointmentEndDateTime);

  return isWithinAppointmentWindow;
};

//currentTime<startTime+10mins
export const isInAvailableAppointmentWindow = (event) => {
  const { RESEA_CAL_LAPSE_TIME } = getBufferParameters();
  const appointmentStartTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).add(RESEA_CAL_LAPSE_TIME, "minutes");
  const currentTime = moment();

  return currentTime.isBefore(appointmentStartTime);
};

//startTime+30mins<currentTime<endTime+30mins
export const isInCurrentZoomWindow = (event) => {
  const { CURR_APP_PREP_TIME, RESEA_CAL_LAPSE_TIME } = getBufferParameters();
  const appointmentStartTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).subtract(CURR_APP_PREP_TIME, "minutes");
  const appointmentStartTimeAfterBuffer = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).add(RESEA_CAL_LAPSE_TIME, "minutes");
  const currentTime = moment();
  return (
    appointmentStartTime.isBefore(currentTime) &&
    currentTime.isBefore(appointmentStartTimeAfterBuffer)
  );
};

export const isCaseAccessPresent = (accessFlagField, event, caseDetails) => {
  switch (accessFlagField) {
    case "rescheduleAccess": {
      return (
        ((caseDetails?.[accessFlagField] === "Y" ||
          caseDetails?.[accessFlagField] === "V") &&
          isInFutureAppointmentWindow(event)) ||
        caseDetails?.reopenInd === "Y"
      );
    }
    case "switchModeAccess": {
      const decodedJwt = decodeJwt();
      const checkInitialAppointmentCondition =
        event.usageDesc === "Initial Appointment"
          ? decodedJwt?.roleId === 95 || decodedJwt?.roleId === 54
          : true;
      return (
        (caseDetails?.[accessFlagField] === "Y" ||
          caseDetails?.[accessFlagField] === "V") &&
        checkInitialAppointmentCondition &&
        isInFutureAppointmentWindow(event)
      );
    }
    case "returnToWorkAccess": {
      return (
        (caseDetails?.[accessFlagField] === "Y" ||
          caseDetails?.[accessFlagField] === "V") &&
        isInRTWBufferPeriod(event)
      );
    }
    case "appointmentAccess": {
      return (
        ((caseDetails?.[accessFlagField] === "Y" ||
          caseDetails?.[accessFlagField] === "V") &&
          isInAppointmenDetailsWindow(event)) ||
        caseDetails?.reopenInd === "Y"
      );
    }
    case "noShowAccess": {
      return (
        ((caseDetails?.[accessFlagField] === "Y" ||
          caseDetails?.[accessFlagField] === "V") &&
          isInCurrentAppointmentWindow(event)) ||
        caseDetails?.reopenInd === "Y"
      );
    }
    default:
      return false;
  }
};
