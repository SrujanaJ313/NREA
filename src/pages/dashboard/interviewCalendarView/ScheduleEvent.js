import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RescheduleRequest from "./RescheduleRequest";
import ReturnedToWork from "./ReturnedToWork";
import AppointmentDetails from "./appointmentDetails";
import Switch from "./Switch";
import CaseHeader from "../../../components/caseHeader";
import NoShowup from "./noShow";
import { reOpenURL } from "../../../helpers/Urls";
import { useSnackbar } from "../../../context/SnackbarContext";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import client from "../../../helpers/Api";
import { isCaseAccessPresent } from "../../../helpers/timerBuffer";

function ScheduleEvent({ caseDetails, event, onSubmitClose }) {
  const [type, setType] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const showSnackbar = useSnackbar();
  const getTitle = () => {
    switch (type) {
      case "reschedule":
        return "Reschedule Request";
      case "switch":
        return `Switch Meeting Mode to ${
          event?.appointmentType === "I" ? "Virtual" : "In Person"
        }`;
      case "returnToWork":
        return "Details of return to work";
      case "appointmentDetails":
        return "Appointment Details";
      case "noShow":
        return "No Show";

      default:
        return "";
    }
  };

  const handleReOpenRequest = async () => {
    try {
      await client.post(`${reOpenURL}${event.id}`, {});
      showSnackbar("Your request has been recorded successfully.", 5000);
      onSubmitClose();
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_REOPEN_URL}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  return (
    <>
      <DialogContent dividers sx={{ paddingBottom: 1 }}>
        <Stack>
          <CaseHeader caseDetails={caseDetails} event={event} />
          {type && (
            <>
              <Stack mt={2}>
                <Typography fontWeight={600} fontSize={"1rem"} color="primary">
                  {getTitle()}
                </Typography>
              </Stack>
              {type === "reschedule" && (
                <Stack>
                  <RescheduleRequest
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}
              {type === "switch" && (
                <Stack>
                  <Switch
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}
              {type === "returnToWork" && (
                <Stack>
                  <ReturnedToWork
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}
              {type === "appointmentDetails" && (
                <Stack>
                  <AppointmentDetails
                    onSubmitClose={onSubmitClose}
                    event={event}
                    onCancel={() => setType("")}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}

              {type === "noShow" && (
                <Stack>
                  <NoShowup
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                    noShowAccess={caseDetails?.noShowAccess}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: 1 }}>
        {!type && (
          <div>
            <div style={{ display: "flex", columnGap: "1rem" }}>
              {caseDetails?.reopenAccess === "Y" && (
                <Button
                  variant="contained"
                  onClick={() => handleReOpenRequest()}
                  size="small"
                  disabled={caseDetails?.reopenAccess === "N"}
                >
                  Edit Appointment
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => setType("reschedule")}
                size="small"
                disabled={
                  !isCaseAccessPresent("rescheduleAccess", event, caseDetails)
                }
              >
                Reschedule
              </Button>
              <Button
                variant="contained"
                onClick={() => setType("switch")}
                size="small"
                disabled={
                  !isCaseAccessPresent("switchModeAccess", event, caseDetails)
                }
              >
                Switch Mode
              </Button>
              <Button
                variant="contained"
                onClick={() => setType("returnToWork")}
                size="small"
                disabled={
                  !isCaseAccessPresent("returnToWorkAccess", event, caseDetails)
                }
              >
                Returned to Work
              </Button>

              <Button
                variant="contained"
                sx={{ height: "fit-content" }}
                onClick={() => setType("appointmentDetails")}
                size="small"
                disabled={
                  !isCaseAccessPresent("appointmentAccess", event, caseDetails)
                }
              >
                Appointment Details
              </Button>
              <Button
                variant="contained"
                sx={{ height: "fit-content" }}
                onClick={() => setType("noShow")}
                size="small"
                disabled={
                  !isCaseAccessPresent("noShowAccess", event, caseDetails)
                }
              >
                No Show
              </Button>
            </div>
            <div>
              {!!errorMessages?.length &&
                errorMessages?.map((x) => (
                  <div key={x}>
                    <span className="errorMsg">*{x}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </DialogActions>
    </>
  );
}

export default ScheduleEvent;
