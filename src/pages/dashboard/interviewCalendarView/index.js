import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Box from "@mui/material/Box";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AvailableEvent from "./AvailableEvent";
import CustomModal from "../../../components/customModal/CustomModal";
import ScheduleEvent from "./ScheduleEvent";
import { calendarDetailsURL, caseHeaderURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { CookieNames, getCookieItem } from "../../../utils/cookies";
import GroupIcon from "@mui/icons-material/Group";
import { AVAILABLE_LINK_BEFORE_DURATION } from "../../../helpers/Constants";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import Stack from "@mui/material/Stack";
import { isInAvailableAppointmentWindow } from "../../../helpers/timerBuffer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";

const localizer = momentLocalizer(moment);

function InterviewCalendarView({ userId, userName }) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState();
  const [caseDetails, setCaseDetails] = useState();
  const [events, setEvents] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentDateRange, setCurrentDateRange] = useState({
    start: moment().startOf("week").add(1, "days").format("MM/DD/YYYY"),
    end: moment().endOf("week").subtract(1, "days").format("MM/DD/YYYY"),
  });

  const showEventInfo = async (event) => {
    if (
      event.eventTypeDesc === "Available" &&
      isInAvailableAppointmentWindow(event)
    ) {
      setEvent(event);
      setOpen(true);
    } else if (
      event.eventTypeDesc === "In Use" &&
      (event.usageDesc === "Initial Appointment" ||
        event.usageDesc === "1st Subsequent Appointment" ||
        event.usageDesc === "2nd Subsequent Appointment")
    ) {
      try {
        setErrorMessages([]);
        const response = await client.get(`${caseHeaderURL}/${event.eventId}`);
        setCaseDetails(response);
        setEvent(event);
        setOpen(true);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_CASE_HEADER}`,
          errorResponse
        );
        setErrorMessages(newErrMsgs);
      }
    }
  };

  useEffect(() => {
    getCalendarEvents(currentDateRange.start, currentDateRange.end);
  }, [userId]);

  const getCalendarEvents = async (start, end) => {
    try {
      setErrorMessages([]);

      const payload = {
        userId: userId,
        startDt: start,
        endDt: end,
      };
      const response = await client.post(calendarDetailsURL, payload);
      const data = response.map((event) => {
        const startDate = moment(
          `${event.appointmentDt} ${event.startTime}`,
          "MM/DD/YYYY hh:mm A"
        ).toDate();

        const endDate = moment(
          `${event.appointmentDt} ${event.endTime}`,
          "MM/DD/YYYY hh:mm A"
        ).toDate();
        return {
          id: event.eventId,
          title: title(event),
          start: startDate,
          end: endDate,
          ...event,
        };
      });
      setEvents(data);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_CALENDAR_DETAILS}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  const statusIconMap = {
    completed: (
      <CheckCircleOutlineIcon
        sx={{
          color: "green",
          margin: "0.1rem",
          height: "0.85rem",
          width: "1rem",
        }}
      />
    ),
    failed: (
      <CancelIcon
        sx={{
          color: "red",
          margin: "0.15rem",
          height: "0.85rem",
          width: "1rem",
        }}
      />
    ),
  };

  const renderStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const isRTW = normalizedStatus.includes("return to work");

    const baseStatus = isRTW
      ? normalizedStatus?.split(" - ")[0]
      : normalizedStatus;
    const icon = statusIconMap[baseStatus];
    if (!icon) return null;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <Tooltip
          title={status}
          placement="right-start"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "-0.35rem",
          }}
        >
          {icon}
        </Tooltip>
        {isRTW && (
          <span
            style={{
              color: "rgb(69 65 65)",
              fontSize: "0.5rem",
              fontWeight: "bold",
            }}
          >
            RTW
          </span>
        )}
      </div>
    );
  };

  const title = (event) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {event?.usageDesc === "2nd Subsequent Appointment" &&
        event?.label?.toLowerCase() !== "unused" &&
        event?.label?.toLowerCase() !== "available" &&
        event?.label?.length > 12 ? (
          <span style={{ fontSize: "0.73rem" }}>{event?.label}</span>
        ) : (
          event?.label
        )}
        {event.appointmentType === "V" && <GroupIcon />}
        {event?.mtgStatusDesc && renderStatusIcon(event.mtgStatusDesc)}
      </div>
    );
  };

  /*
    mapping
    eventTypeDesc-> values -> Do not schedule, Available, In Use,Unused
    usageDesc-> values -> Time-Off, State Holiday, Initial Appointment, 1st Subsequent Appointment, 2nd Subsequent Appointment
    ----
    Do not schedule -> Time-Off, State Holiday
    Available, In Use,Unused-> Initial Appointment, 1st Subsequent Appointment, 2nd Subsequent Appointment
   */
  const eventPropGetter = (event) => {
    let backgroundColor = "#CAD5DA";
    let color = "black";

    if (event.eventTypeDesc === "Available") {
      color = "red";
      backgroundColor = "white";
    } else if (event.eventTypeDesc === "Unused") {
      backgroundColor = "#c3ccd4";
    } else if (event.usageDesc === "Time-Off") {
      backgroundColor = "#fbe3d6";
    } else if (event.usageDesc === "State Holiday") {
      backgroundColor = "#bfbdbf";
    } else if (event.usageDesc === "Initial Appointment") {
      backgroundColor = "#dcebf6";
    } else if (event.usageDesc === "1st Subsequent Appointment") {
      backgroundColor = "#DDDBD2";
    } else if (event.usageDesc === "2nd Subsequent Appointment") {
      backgroundColor = "#c2f1c9";
    }

    return {
      style: {
        backgroundColor,
        color,
        fontSize: "1rem",
        textAlign: "center",
        height: "auto",
      },
    };
  };

  const formats = {
    eventTimeRangeFormat: () => {
      return "";
    },
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      const startMonth = localizer.format(start, "MMMM", culture);
      const startYear = localizer.format(start, "yyyy", culture);
      const startDay = localizer.format(start, "DD", culture);
      const endMonth = localizer.format(end, "MMMM", culture);
      const endYear = localizer.format(end, "yyyy", culture);
      const endDay = localizer.format(end, "DD", culture);
      if (startMonth !== endMonth || startYear !== endYear) {
        return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
      } else {
        return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
      }
    },
  };

  const getTitle = () => {
    if (event?.eventTypeDesc?.toLowerCase() === "available") {
      // return `AVAILABLE ${event.usageDesc}: ${event.appointmentDt} from ${event.startTime} to ${event.endTime}`;
      return (
        <div
          style={{
            width: "120%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <div>AVAILABLE</div>

          <div style={{ fontSize: "14px" }}>
            {`${event.usageDesc}: ${event.appointmentDt} from ${event.startTime} to ${event.endTime}`}
          </div>
        </div>
      );
    } else {
      const appointmentStatus = caseDetails.appointmentStatus
        ? `(Appointment Status: ${caseDetails.appointmentStatus})`
        : "";
      if (event.usageDesc === "Initial Appointment") {
        return `Initial Appointment: ${event.appointmentDt} from ${event.startTime} to ${event.endTime} ${appointmentStatus}`;
      } else if (event.usageDesc === "1st Subsequent Appointment") {
        return `1st Subsequent Appointment: ${event.appointmentDt} from ${event.startTime} to ${event.endTime} ${appointmentStatus}`;
      } else if (event.usageDesc === "2nd Subsequent Appointment") {
        return `2nd Subsequent Appointment: ${event.appointmentDt} from ${event.startTime} to ${event.endTime} ${appointmentStatus}`;
      }
    }
  };

  const getEndTitle = () => {
    return event.appointmentType === "V" ? (
      <GroupIcon style={{ position: "relative", bottom: "-3px" }} />
    ) : null;
  };

  const onRangeChange = useCallback(
    (range) => {
      const start = moment(range[0]).format("MM/DD/YYYY");
      const end = moment(range[range.length - 1]).format("MM/DD/YYYY");
      setCurrentDateRange({ start, end });
      getCalendarEvents(start, end);
    },
    [userId]
  );

  const onSubmitModalClose = () => {
    setOpen(false);
    getCalendarEvents(currentDateRange.start, currentDateRange.end);
  };

  return (
    <Box
      sx={{
        paddingTop: 1,
        paddingBottom: 2,
        transform: "scaleY(0.9)",
        position: "relative",
        top: "-1.5rem",
      }}
    >
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        {errorMessages.map((x) => (
          <div>
            <span className="errorMsg">*{x}</span>
          </div>
        ))}
      </Stack>
      <Calendar
        localizer={localizer}
        tooltipAccessor={null}
        defaultDate={useMemo(
          () => ({
            defaultDate: new Date(),
          }),
          []
        )}
        defaultView="work_week"
        events={events}
        style={{ height: "90vh" }}
        onSelectEvent={(event) => showEventInfo(event)}
        showMultiDayTimes={false}
        onRangeChange={onRangeChange}
        step={30}
        formats={formats}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 18, 0, 0)}
        eventPropGetter={eventPropGetter}
        views={{
          month: false,
          week: false,
          work_week: true,
          day: false,
          agenda: false,
        }}
      />

      {open && event && (
        <CustomModal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          title={getTitle()}
          endTitle={getEndTitle()}
          maxWidth={"xl"}
        >
          {event &&
          event.eventTypeDesc.toLowerCase() === "available" &&
          [
            "1st Subsequent Appointment",

            "2nd Subsequent Appointment",

            "Initial Appointment",
          ].includes(event?.usageDesc) ? (
            <>
              <AvailableEvent
                event={event}
                userName={userName}
                userId={userId}
                onSubmitClose={onSubmitModalClose}
                onCancel={() => setOpen(false)}
              />
            </>
          ) : (
            <>
              <ScheduleEvent
                caseDetails={caseDetails}
                event={event}
                onSubmitClose={onSubmitModalClose}
              />
            </>
          )}
        </CustomModal>
      )}
    </Box>
  );
}

export default InterviewCalendarView;
