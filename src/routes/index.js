import {
  Navigate,
  Route,
  Routes,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CookieNames,
  getCookieItem,
  setSession,
  setAccessTokenInSession,
} from "../utils/cookies";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import UnAuthorised from "../pages/UnAuthorisedPage";
import Header from "../components/Header";
import client from "../helpers/Api";
import useAuthRouteCheck from "../hooks/useAuthRouteCheck";
import {
  validateJWTURL,
  refreshTokenURL,
  parametersURL,
} from "../helpers/Urls";

import Footer from "../components/Footer";
import Dashboard from "../pages/dashboard/Dashboard";
import Reminders from "../pages/reminders/Reminders";
import WorkSchedule from "../pages/workschedule/WorkSchedule";
import Preferences from "../pages/preferences/Preferences";
import { setBufferParameters, setTokenExpiryTime } from "../utils/session";
import { ACCESS_TOKEN_EXPIRY, BUFFER_PARAMETERS } from "../helpers/Constants";
import CaseLookUpPage from "../pages/dashboard/cases/CaseLookUpPage";
import AppointmentLookUpPage from "../pages/dashboard/appointments/AppointmentLookUpPage";
import moment from "moment";
import CaseSummaryPageWithProvider from "../pages/dashboard/caseSummary/CaseSummaryPage";
import PendingScheduleResult from "../pages/dashboard/pendingSchedule/PendingScheduleResult";
import StaffUnavailability from "../pages/unavailability";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // let tokenParam = searchParams.get("tokenParam");
  let tokenParam = window.tokenParam;

  const getUserDetails = async (token) => {
    setLoading(true);
    try {
      token = atob(token);
      setAccessTokenInSession(token);
      // const headers = { 'Authorization': `Bearer ${token}` };
      let userData =
        process.env.REACT_APP_ENV === "mockserver"
          ? await client.get(`${validateJWTURL}`)
          : await client.get(validateJWTURL);
      if (process.env.REACT_APP_ENV !== "mockserver") {
        let refrestTokenRes = await client.get(refreshTokenURL);
        const sessionData = {
          accessToken: refrestTokenRes.accessToken,
          refreshToken: refrestTokenRes.refreshToken,
          userData: {
            userName: `${userData.firstName} ${userData.lastName}`,
            accessLevel: `${userData.srlAccessCdValue}`,
            userId: userData.userId,
          },
        };
        setTokenExpiryTime(
          moment().add(ACCESS_TOKEN_EXPIRY, "minutes").format()
        );
        setSession(sessionData); // change this method based on the details returning from API
      }
      setHasAccess(true);
      setLoading(false);
    } catch (errorResponse) {
      setHasAccess(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenParam) {
      getUserDetails(tokenParam);
    } else {
      let storedToken = getCookieItem(CookieNames.ACCESS_TOKEN);
      if (storedToken) {
        getUserDetails(storedToken);
      } else {
        setHasAccess(false);
      }
    }
  }, []);

  const storeParametersData = async () => {
    try {
      let paramsRes = await client.get(parametersURL);
      setBufferParameters(paramsRes);
    } catch (e) {
      setBufferParameters(BUFFER_PARAMETERS);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      storeParametersData();
    }
  }, [hasAccess]);

  return loading ? (
    <>
      <Grid container spacing={8}>
        <Grid item xs>
          <LinearProgress />
        </Grid>
      </Grid>
    </>
  ) : hasAccess === true ? (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ) : hasAccess === false ? (
    <Navigate replace to="/unAuthorised" />
  ) : (
    <></>
  );
};

function AppRoutes() {
  // const isAuthRoute = useAuthRouteCheck();
  // const showHeader = !isAuthRoute;

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          {/* <Route element={<Configurations />} path="/config" /> */}
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Reminders />} path="/reminders" />
          <Route element={<WorkSchedule />} path="/workSchedule" />
          <Route element={<Preferences />} path="/preferences" />
          <Route
            element={<AppointmentLookUpPage />}
            path="/appointment-lookup"
          />
          <Route element={<CaseLookUpPage />} path="/case-lookup" />
          <Route element={<PendingScheduleResult />} path="/pending-schedule" />
          <Route
            element={<CaseSummaryPageWithProvider />}
            path="/case-summary/:caseId"
          />
          <Route
            element={<StaffUnavailability />}
            path="/staff-unavailability"
          />
        </Route>
        <Route element={<UnAuthorised />} path="/unAuthorised" />
        <Route element={<Navigate replace to="/dashboard" />} path="/" />
      </Routes>
    </>
  );
}

export default AppRoutes;
