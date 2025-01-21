export const validationMessages = {
  lookup: {
    mslRequired: "MSL is required",
    employerRequired: "Employer UI Acct # is required",
    claimantRequired: "Claimant SSN is required",
    masslayoffStartDateRequired: "Start Date is required",
    masslayoffEndDateMin: "End date can't be before Start date",
    recallStartDateRequired: "Start Date is required",
    recallEndDateMin: "End date can't be before Start date",
  },
};
export const serverErrorMessages = {
  lookupReqDTO: {
    claimantssn: {
      errorcode1: "claimantssn errorcode1 msg",
      errorcode2: "claimantssn errorcode2 msg",
      errorcode3: "claimantssn errorcode3 msg",
    },
    startDate: {
      errorcode1: "startDate errorcode1 msg",
      errorcode2: "startDate errorcode2 msg",
      errorcode3: "startDate errorcode3 msg",
    },
  },
  errorcode1: "errorcode1 msg",
  errorcode2: "errorcode2 msg",
  errorcode3: "errorcode3 msg",
  defaultErrorMsg: "Internal, please contact administrator",
};

export const SOURCE_CODES = {
  CLONED: "Cloned",
  CLAIMANT_WORK_HISTORY: "Claimant work history",
  STAFF_ENTERED: "Staff entered",
  UPLOADED: "Uploaded",
};

export const STATUS_CODES = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
};

export const ERROR_CODES_MAPPER = {
  reasonCodes: {
    "method.not.supported": "Requested HTTP method is not supported.",
    "not.found": "Requested resource not found.",
    "validation.error": "Invalid data found in the request.",
    "file.processing.failed": "An error occurred during file processing.",
    "internal.error":
      "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
    "parser.error": "An error occurred while parsing the data.",
    "db.resource.not.available":
      "Resource requested is not found in the database.",
  },
  default: {
    400: "An validation error occurred while processing your request. Please try again or contact the administrator for assistance.",
    401: "Authentication Failed.",
    404: "Requested resource not found.",
    405: "Requested HTTP method is not supported.",
    500: "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
    default:
      "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
  },
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CASELOAD_SUMMARY}`] = {
  "userid.mandatory": "User Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_APPOINTMENT_NO_SHOW}`] = {
  "eventId.mandatory": "RSIC Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_NMI_LIST}`] = {
  "page.mandatory": "Page is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CALENDAR_DETAILS}`] = {
  "userId.mandatory": "User Id is mandatory",

  "eventId.mandatory ": "Event Id is mandatory ",
  "eventId.notFound": "Record is not found.",
  "startDt.mandatory": "Start Date is mandatory",
  "endDt.mandatory": "End Date is mandatory",
};

ERROR_CODES_MAPPER[`GET:${process.env.REACT_APP_CASE_HEADER}`] = {
  "eventId.mandatory": "RSIC Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_SWITCH_SAVE}`] = {
  "createIssue.issueEndDt.invalid":
    "End Date for a Create Issue should be after Start Date",
  "switchmeetingmode.reason.mandatory":
    "A reason for switching the meeting mode is mandatory.",
  "createIssue.issueEndDt.priorToBye":
    "End Date for a Create Issue should be prior to Current Benefit Year End Date.",

  "change.reason.text.exceeds_limit":
    "Reason for Switch Meeting Mode exceeds character limit, please limit your input to 1000 characters.",
  "currentmeetingmode.mandatory": "Current Meeting mode is mandatory",
  "meetingModeChgReasonTxt.mandatory":
    "Please enter the description for 'Switching Meeting Mode'",
  "currentMeetingMode.role.invalid":
    "User does not have access to switch Initial Appointment to 'Virtual' mode.",
  "createIssue.invalid": "Please enter all fields for selected Create Issue.",
  "createIssue.issueStartDt.invalid":
    "The Start Date for a 'Create Issue' should be within the Benefit Year End date.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_RETURNED_TO_WORK_SAVE}`] = {
  "workSchedule.invalid": "Work Schedule is invalid.",
  "createActivity.failed":
    "Request Processed. However, case activity could not created.  Please Contact WeCare.",
  "empStartDt.mandatory": "Employment Start Date is mandatory",
  "companyName.mandatory": "Company Name is mandatory",
  "jobTitle.mandatory": "Job Title is mandatory",
  "workSchedule.mandatory": "Work Schedule is mandatory",
  "hourlyPayRate.mandatory": "Hourly Pay Rate is mandatory",
  "state.mandatory": "State is mandatory",
  "city.mandatory": "City is mandatory",
  "workMode.mandatory": "Work Mode is mandatory",
  "staffNotes.exceeds_limit":
    "Staff Notes exceeds character limit, please limit to 4000 characters",
  "jms890IndAndjmsReferralInd.bothEmpty":
    "Please select either 'Non-Direct placement Recorded in JMS' or 'JMS Referral Recorded in JMS'.",
  "jmsCompletedItems.checkedOff":
    "For a future start date, please ensure none of the JMS items are checked.",
  "jmsCompletedItems.checkedNotOff":
    "Please verify the JMS checklist has been completed.",
  "employmentStartDt.afterRtwFutureDays":
    "Employment start date should be on or before 30 days from the current date.",
  "createIssue.invalid": "Please enter all fields for selected Create Issue.",
  "createIssue.issueStartDt.invalid":
    "The Start Date for a 'Create Issue' should be within the Benefit Year End date.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_RESCHEDULE_SAVE}`] = {
  "createIssue.issueEndDt.invalid":
    "End Date for a Create Issue should be after Start Date",
  "createIssue.issueEndDt.priorToBye":
    "End Date for a Create Issue should be prior to Current Benefit Year End Date.",
  "entityTeleNumber.invalid": "employer telephone number invalid",
  "createActivity.failed":
    "Request Processed. However, case activity could not created.  Please Contact WeCare.",
  "oldEventId.mandatory": "Previous event Id is mandatory ",
  "newEventId.mandatory": "New Event Id is Mandatory",
  "nonComplaince.indicator.mandatory": "Non Compliance Indicator is mandatory",
  "reschedule.reason.mandatory": "Reschedule Reason is mandatory",
  "lateSchedulingNotes.exceeds_limit":
    "Please verify the JMS checklist has been completed.",
  "preferredMeetingMode.bothNotChecked":
    "Please select either 'In-Person' or 'Virtual'",
  "appointmentDate.mandatory": "Appointment Date is mandatory",
  "appointmentTime.mandatory": "Appointment Time is mandatory",
  "entityCity.mandatory": "City is mandatory",
  "entityState.mandatory": "State is mandatory",
  "entityName.mandatory": "Employer name is mandatory",
  "entityTeleNumber.mandatory": "Employer telephone number is mandatory",
  "jobTitle.mandatory": "Job title is mandatory",
  "partFullTimeInd.mandatory": "Part time/Full time indicator is mandatory",
  "lateSchedulingReason.empty": "Please enter the reason for late scheduling",
  "createIssue.invalid": "Please enter all fields for selected Create Issue.",
  "createIssue.issueStartDt.invalid":
    "The Start Date for a 'Create Issue' should be within the Benefit Year End date.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_APPOINTMENT_SAVE}`] = {
  "createActivity.failed":
    "Request Processed. However, case activity could not created.  Please Contact WeCare.",
  "eventId.notAvailable": "Appointment Slot is not Available",
  "createIssue.issueEndDt.priorToBye":
    "End Date for a Create Issue should be prior to Current Benefit Year End Date.",

  "for.lof.invalid": "User does not have access to For Local Office option",
  "for.mgr.invalid": "User does not have access to For Case Manager option",
  "claimId.mandatory": "Please select a claimant to schedule the appointment",
  "informedCmtInd.mandatory":
    "Please inform claimant and select Informed Claimant to check the claimant portal",
  "informedConveyedBy.mandatory":
    "Please check the option by which the information was conveyed to the claimant.",
  "status.mandatory": "Status is mandatory",
  "createIssue.issueStartDt.invalid":
    "The Start Date for a 'Create Issue' should be within the Benefit Year End date.",
  "createIssue.invalid": "Please enter all fields for selected Create Issue.",
};

ERROR_CODES_MAPPER[
  `POST:${process.env.REACT_APP_APPOINTMENT_DETAILS_SUBMISSION}`
] = {
  "createIssue.issueEndDt.invalid":
    "End Date for a Create Issue should be after Start Date",
  "appointment.stage.invalid":
    "Cannot edit appointment, the case has moved to the next stage",
  "appointment.status.invalid":
    "Interview Appointment Status is invalid. Cannot submit Interview Details",
  "appointment.case.invalid":
    "Appointment is not associated with RESEA case, cannot submit Interview Details.",
  "appointment.access.invalid":
    "User doesnot have access to submit interview details for another case manager.",
  "InitialAssessment.mandatory": "102: Initial Assessment is mandatory",
  "createIssue.issueEndDt.priorToBye":
    "End Date for a Create Issue should be prior to Current Benefit Year End Date.",
  "createActivity.failed":
    "Request Processed. However, case activity could not created.  Please Contact WeCare.",
  "Eri1On1.mandatory": "106: Eri 1-on-1 is mandatory",
  "ELMIServices.mandatory": "107: ELMI Services is mandatory",
  "JobDevelopment.mandatory": "123: Job Development is mandatory",
  "CaseManagement.mandatory": "153: Case Management is mandatory",
  "AttendedRESEA.mandatory": "160: Attended RESEA is mandatory",
  "OutsideWebReferral.mandatory": "179: Outside Web Referral is mandatory",
  "DevelopIEP.mandatory": "205: Develop IEP is mandatory",
  "ReferWIOATraining.mandatory":
    "209: Refer to WIOA state & local training  is mandatory",
  "ReferToVRorDHHS.mandatory": "Refer to VR or DHHS is mandatory",
  "JMSJobReferral.mandatory": "500+: JMS Job Referral is mandatory",
  "jms890IndAndjmsReferralInd.bothEmpty":
    "Please select either 'Non-Direct placement Recorded in JMS' or 'JMS Referral Recorded in JMS'.",
  "AddSelfCaseManager.mandatory": "Add Self as Case Manager is mandatory",
  "JMSCaseNotes.mandatory": "JMS Case Notes is mandatory",
  "CloseGoals.mandatory": "Close Goals is mandatory",
  "JmsCloseIEP.mandatory":
    "Close IEP if not being case managed by a Partner is mandatory",
  "ActiveResume.mandatory": "Active Resume is mandatory",
  "ActiveVirtualRecuiter.mandatory": "Active Virtual Recruiter is mandatory",
  "WagnerPeyserApplComplete.mandatory":
    "Wagner-Peyser Application Completed with Individual is mandatory",
  "WagnerPeyserApplSignature.mandatory":
    "Wagner-Peyser Application Signature sent is mandatory",
  "IEPSignatureCopy.mandatory":
    "Send IEP for Signature and give copy is mandatory",
  "OutsideWebReferral.jobReferral":
    "179 Outside Web Referral is selected, please enter the related Job Referral details.",
  "OutsideWebReferral.jobReferral.invalid":
    "179 Outside Web Referral Job Referral entries are invalid, the employer name and job title are mandatory",
  "JMSJobReferral.jobReferral":
    "500+: JMS Job Referral is selected, please enter the related Job Referral details.",
  "JMSJobReferral.jobReferral.invalid":
    "500+: JMS Job Referral Job Referral entries are invalid, the employer name and job title are mandatory",
  "JMSRegComplete.exclusive":
    "Please select either checkbox : 'JMS Registration Complete' OR 'JMS Registration Incomplete & Warning Issued', but not both.",
  "rsidSlfSchByDt.mandatory":
    "Self-schedule by date is mandatory when this option is selected. Please enter valid date.",
  "rsidSlfSchByDt.invalid":
    "Self-schedule by date should be future date within 10 days of the appointment. Please enter valid date",
  "ActiveVirtualRecuiter.mandatoryDt":
    "Please select the Active Virtual Recruiter option to enter the Expiration date",
  "virtualRecuiterExpDt.mandatory":
    "Virtual Recruiter Expiration date is mandatory when this option is selected. Please enter valid date.",
  "virtualRecuiterExpDt.invalid":
    "Virtual Recruiter Expiration date should be a valid future date",
  "ActiveResume.mandatoryDt":
    "Active Resume Expiration date is entered, please select Active Resume checkbox",
  "resumeExpDt.mandatory":
    "Active Resume Expiration date is mandatory when this option is selected. Please enter valid date.",
  "resumeExpDt.invalid":
    "Active Resume Expiration date should be a valid future date",
  "otherIssues.invalid":
    "Please enter all fields for the selected 'Create Issue' option",
  "otherIssues.startDt.invalid":
    "Start Date for a 'Create Issue' should be a valid date prior to Claim BYE Date",
  "otherIssues.endDt.invalid":
    "End Date for a 'Create Issue' should be a valid future date and should be after Start Date",
  "workSearchIssues.invalid":
    "Please check-off at least each of the most recent three continued claim weeks as reviewed.",
  "ReviewedReEmpPlan.mandatory":
    "Reviewed Chapters 1-4 of My Reemployment Plan is mandatory.",
  "rsidMrpRvwd.mandatory":
    "Please select chapters for Reviewed My Reemployment Plan",
  "AssignedReEmpPlan.mandatory": "Assigned My Reemployment Plan' is mandatory.",
  "PhysicallyVerifiedID.mandatory":
    "Physically Verified Claimant's ID is mandatory.",
  "RemindedSelfSchedule.mandatory":
    "Reminded Claimant to Self-schedule is mandatory.",
  "rsidMrpAssgnd.mandatory":
    "Please select chapters for 'Assigned My Reemployment Plan'",
  "EsConfirm.mandatory":
    "Please select checkbox to confirm that Employment Services have been provided",
  "CheckedPriorJobReferrals.mandatory":
    "Checked Prior Job Referrals is mandatory",
  "EPandCheckListUpld.mandatory":
    "Copy of EP and Checklist uploaded into JMS is mandatory",
  "workSearchIssues.edit.invalid":
    "Work Search Review cannot be edited for existing entries where issues have been created.",
  "workSearchIssues.duplicate":
    "Work Search issue {0} already exists for week ending {1}. Please remove or change the Issue.",
  "otherIssues.duplicate":
    "Other Issue {0} already exists for Start Date {1} and End Date {2}. Please remove or change the Issue.",
  "jmsResumeExpDt.invalid":
    "Active Resume Expiration date should be a valid future date.",
  "jmsVRExpDt.invalid":
    "Virtual Recruiter Expiration date should be a valid future date.",
  "JMSRegIncomplete.mandatory":
    "JMS Registration Incomplete & Warning Issued is mandatory.",
  "selfSchByDt.mandatory":
    "Self-schedule by date is mandatory when option is selected. Please enter valid date.",
  "selfSchByDt.invalid":
    "Self-schedule by date should be future date with in 10 days of the appointment. Please enter valid date.",
  "jmsVRExpDt.mandatory":
    "Virtual Recruiter Expiration date is mandatory when option is selected. Please enter valid date.",
  "jmsResumeExpDt.mandatory":
    "Active Resume Expiration date is mandatory when option is selected. Please enter valid date.",
  "assignedMrpChap.mandatory":
    "Please select chapters for Assigned My Reemployment Plan.",
  "empServicesConfirmInd.mandatory":
    "Please select checkbox confirming that Employment Services have been provided.",
  "createIssue.invalid": "Please enter all fields for selected Create Issue.",
};
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_REASSIGN_SAVE}`] = {
  "eventld.notAvailable":
    "Appointment is no longer available for scheduling. Please select another appointment",
  "eventld.mismatch":
    "Case Stage and Apponinment Selected do not match. Please select appropriate appointment",
  "caseOffice.mandatory":
    "Please select lookup case manager availability office",
  "caseld.mandatory": "Case ID is mandatory",
  "eventld.mandatory": "Event ID is mandatory",
  "eventId.mismatch":
    "Case Stage and Apponinment Selected do not match. Please select appropriate appointment.",
  "reassign.access.invalid": "User does not have access to Reassign cases.",
  "applyUnavailibility.failed":
    "Request Processed. However, unavailablity could not be applied. Please Contact WeCare.",
};
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_APPOINTMENT_AVAILABLE}`] = {
  "createIssue.issueEndDt.priorToBye":
    "End Date for a Create Issue should be prior to Current Benefit Year End Date.",
  "for.lof.invalid": "User does not have access to For Local Office option",
  "for.mgr.invalid": "User does not have access to For Case Manager option",
  "for.mandatory": "Appointment Slot is not Available.",
  "claimId.mandatory":
    "Please select a claimant for scheduling the appointment.",
  "informedConveyedBy.mandatory":
    "Please check option by which information was convyed to claimant.",
  "lateStaffNote.mandatory":
    "Appointment is scheduled beyond the RESEA Deadline, please submit Late Notes.",
  "informedCmtInd.mandatory":
    "Please inform claimant and select Informed Claimant to check claimant portal.",
};
ERROR_CODES_MAPPER[
  `POST:${process.env.REACT_APP_APPOINTMENTS_LOOK_UP_SUMMARY}`
] = {
  "lookup.limit.exceed":
    "Your search returned a large result set.  Please refine your search criteria.",
};
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CASE_LOOK_UP_SUMMARY}`] = {
  "lookup.limit.exceed":
    "Your search returned a large result set.  Please refine your search criteria.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_REOPEN_URL}`] = {
  "reopen.invalid": "User does not have access to Reopen Calendar Appointment.",
  "reopen.expired":
    "Appointment cannot be reopened. Appointments can be reopened with in 30 days only.",
  "reopen.stage.expired":
    "Appointment cannot be reopened. Case has progressed to next stage.",
};
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CASE_KPI_SUMMARY}`] = {
  "kpi.input.invalid":
    "At least one the following criteria should be selected. Case Mgr/Lof/Agency.",
};
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CASE_SCHEDULE_SAVE}`] = {
  "clmLofInd.input.invalid":
    "Please select the local office option for case manager availability",
};

// staff-unavailability
ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_UNAVAILABILITY}`] = {
  "userId.mandatory": "User ID is mandatory.",
  "startDt.mandatory": "Start Date is mandatory.",
  "endDt.invalid": "Unavailability End Date cannot be prior to Start Date",
};

ERROR_CODES_MAPPER[`GET:${process.env.REACT_APP_UNAVAILABILITY_DETAIL}`] = {
  "unavailabilityId.notFound": "Unavailability Record is not found",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_UNAVAILABILITY_REQUEST}`] = {
  "userId.mandatory": "User ID is mandatory.",
  "unavailabilityId.notFound": "Unavailability Record is not found",
  "startDt.mandatory": "Start Date is mandatory.",
  "endDt.mandatory": "End Date is mandatory.",
  "endDt.invalid": "Unavailability End Date cannot be prior to Start Date",
  "reason.mandatory": "Unavailability Reason is mandatory",
  "startTime.mandatory": "Start Time is mandatory.",
  "endTime.mandatory": "End Time is mandatory.",
  "request.startDt.invalid":
    "Unavailability Start date cannot be a past date. Please modify unavailability request.",
  "request.events.invalid":
    "Scheduled appointments are present during the unavailability period being requested. Please modify unavailability request or reschedule appointments that have previously been scheduled during this unavailability request.",
  "request.access.invalid":
    "User does not have access to request Unavailability for another case manager",
  "notes.mandatory": "Unavailability Notes is mandatory.",
  "request.unavailability.exists":
    "Overlapping Staff Unavailability exists for request period. Please modify unavailability request.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_UNAVAILABILITY_APPROVE}`] = {
  "userId.mandatory": "User ID is mandatory.",
  "startDt.mandatory": "Start Date is mandatory.",
  "endDt.mandatory": "End Date is mandatory.",
  "endDt.invalid": "Unavailability End Date cannot be prior to Start Date",
  "reason.mandatory": "Unavailability Reason is mandatory",
  "startTime.mandatory": "Start Time is mandatory.",
  "endTime.mandatory": "End Time is mandatory.",
  "notes.mandatory": "Unavailability Notes is mandatory.",
  "approve.access.invalid":
    "User does not have access to approve Unavailability request",
  "approve.status.invalid":
    "Cannot Approve Unavailability. Unavailability Record is not in pending status.",
  "request.events.invalid":
    "Scheduled appointments are present during the unavailability period being requested. Please modify unavailability request or reschedule appointments that have previously been scheduled during this unavailability request.",
  "approve.failed":
    "Unavailability could not be approved. Please Contact WeCare.",
  "unavailability.admin":
    "Unable to process Staff Unavailablility. Please conctact admin.",
  "unavailability.schedule.admin":
    "Unable to generate Block Staff Calendar records for the duration of Unavailablility. Please conctact admin.",
  "unavailability.stun.admin":
    "Unable to generate Staff Unavailablility records for the duration of Unavailablility. Please conctact admin.",
  "unavailability.exists.invalid":
    "Staff Unavailability already exists for provided Unavailability ID.",
  "unavailabilityId.invalid": "Unavailability ID is Invalid. No Record exists.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_UNAVAILABILITY_REJECT}`] = {
  "userId.mandatory": "User ID is mandatory.",
  "unavailabilityId.notFound": "Unavailability Record is not found",
  "endDt.invalid": "Unavailability End Date cannot be prior to Start Date",
  "reject.access.invalid":
    "User does not have access to reject Unavailability request",
  "reject.status.invalid":
    "Cannot Reject Unavailability. Unavailability Record is not in pending status.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_UNAVAILABILITY_WITHDRAW}`] = {
  "userId.mandatory": "User ID is mandatory.",
  "unavailabilityId.notFound": "Unavailability Record is not found",
  "withdraw.access.invalid":
    "User does not have access to withdraw this Unavailability request.",
  "withdraw.date.invalid":
    "Withdraw Date cannot be prior to Unavailability start date or after Unavailability end date.",
  "withdraw.note.mandatory": "Withdraw Notes is mandatory.",
  "withdraw.failed":
    "Unavailability could not be removed. Please Contact WeCare.",
  "unavailabilityId.mandatory": "Unavailability ID is mandatory.",
  "notes.mandatory": "Unavailability Notes is mandatory.",
  "withdrawTime.mandatory": "Unavailability Withdraw Time is mandatory.",
  "withdraw.invalid":
    "Unavailability duration has started, please enter valid withdraw date.",
};

ERROR_CODES_MAPPER[`GET:${process.env.REACT_APP_CASE_UNAVAILABILITY_REASON}`] =
  {};
