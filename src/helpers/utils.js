import { ERROR_CODES_MAPPER } from "./ErrorConstants";
import moment from "moment";
import { ROLE_IDS } from "./Constants";

export const getMsgsFromErrorCode = (apiPath, errorResponse) => {
  let messageCodes = [],
    messages = [];
  if (errorResponse?.errorDetails?.length > 0) {
    errorResponse.errorDetails.forEach((ed) => {
      if (ed.errorCode) {
        ed.errorCode.forEach((ec) => {
          messageCodes.push({ errCode: ec });
        });
      } else if (ed.error) {
        ed.error.forEach((ec) => {
          messageCodes.push({
            errCode: ec.errorCode,
            errParms: ec.errorParams,
          });
        });
      }
    });
  } else if (errorResponse.reason) {
    messageCodes.push({ errCode: errorResponse.reason });
  } else {
    messageCodes.push({ errCode: errorResponse.status });
  }

  messageCodes.forEach((code) => {
    if (
      ERROR_CODES_MAPPER[apiPath] &&
      ERROR_CODES_MAPPER[apiPath][code.errCode]
    ) {
      messages.push(
        replacePlaceholders(
          ERROR_CODES_MAPPER[apiPath][code.errCode],
          code.errParms
        )
      );
    } else if (ERROR_CODES_MAPPER.reasonCodes[code.errCode]) {
      messages.push(ERROR_CODES_MAPPER.reasonCodes[code.errCode]);
    } else if (ERROR_CODES_MAPPER.default[code.errCode]) {
      messages.push(ERROR_CODES_MAPPER.default[code.errCode]);
    } else {
      messages.push(ERROR_CODES_MAPPER.default.default);
    }
  });
  if (messages.length === 0) {
    messages.push(ERROR_CODES_MAPPER.default.default);
  }
  return messages;
};

const replacePlaceholders = (str, values = []) => {
  return str.replace(/{(\d+)}/g, (match, index) => {
    return typeof values[index] !== "undefined" ? values[index] : match;
  });
};
export const convertISOToMMDDYYYY = (isoString) => {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
  // return moment(isoString).format("MM/DD/YYYY");
};

export const convertTimeToHoursMinutes = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const sortAlphabetically = (data) => {
  return data.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

export function getGreeting(userName) {
  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return `${greeting}, ${userName}!`;
}

function isValidDateString(dateString) {
  const timestamp = Date.parse(dateString);
  return (
    typeof dateString === "string" &&
    dateString.split("/").length === 3 &&
    !isNaN(timestamp)
  );
}

export function convertDatesToMoment(obj) {
  // Check if the input is an object or array
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToMoment);
  } else if (obj !== null && typeof obj === "object") {
    // Iterate over each key in the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === "workSearchIssues") continue;
        else if (isValidDateString(obj[key])) {
          // Convert Date to Moment.js date
          obj[key] = moment(obj[key]);
        } else if (typeof obj[key] === "object") {
          // Recursively call for nested objects
          convertDatesToMoment(obj[key]);
        }
      }
    }
  }
  return obj;
}
export const checkStaffRoleExists = (roleId) => {
  return ROLE_IDS.includes(roleId);
};
export const mapToGenericKeys = (array) => {
  return array.map((obj) => {
    const keys = Object.keys(obj);
    return {
      id: obj[keys[0]],
      value: obj[keys[1]],
    };
  });
};
export const genericSortOptionsAlphabetically = (data, property) => {
  return data.sort((a, b) => {
    const valueA = a[property]?.toString().toLowerCase() || "";
    const valueB = b[property]?.toString().toLowerCase() || "";
    return valueA.localeCompare(valueB);
  });
};
export const normalizeDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date;
};
