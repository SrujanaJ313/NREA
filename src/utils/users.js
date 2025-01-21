import { decodeJwt } from "./cookies";

const CASE_MANEGER_ROLE = 94;
const LOCAL_OFFICE_MANAGER_ROLE = 54;
const PROGRAM_STAFF_MANAGER_ROLE = 95;
let roleId = "";

const loadRoleId = () => {
  const decodedJwt = decodeJwt();
  roleId = decodedJwt?.roleId;
};

export const isCaseManager = () => {
  if (!roleId) loadRoleId();
  return roleId == CASE_MANEGER_ROLE;
};

export const isLocalOfficeManager = () => {
  if (!roleId) loadRoleId();
  return roleId == LOCAL_OFFICE_MANAGER_ROLE;
};

export const isProgramStaffManager = () => {
  if (!roleId) loadRoleId();
  return roleId == PROGRAM_STAFF_MANAGER_ROLE;
};

export const isCaseOrLocalOrProgramStaffManager = () => {
  return isCaseManager() || isLocalOfficeManager() || isProgramStaffManager();
};

export const isLocalOrProgramStaffManager = () => {
  return isLocalOfficeManager() || isProgramStaffManager();
};
