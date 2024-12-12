import React, { createContext, useContext, useEffect, useState } from "react";
import { caseSummaryURL } from "../../../helpers/Urls";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import client from "../../../helpers/Api";

const CaseSummaryContext = createContext();

export const useCaseSummary = () => useContext(CaseSummaryContext);

export const CaseSummaryProvider = ({ children, caseId }) => {
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setErrorMessages([]);
      setLoading(true);
      try {
        const url = `${caseSummaryURL}/${caseId}`;
        const response = await client.get(url);
        setCaseSummaryData(response);
        setLoading(false);
      } catch (errorResponse) {
        setLoading(false);
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_LOOKUP_URL}`,
          errorResponse
        );
        setErrorMessages(newErrMsgs);
      } finally {
        setLoading(false);
      }
    };
    if (caseId) fetchSummaryData();
  }, [caseId]);

  return (
    <CaseSummaryContext.Provider
      value={{ caseSummaryData, loading, errorMessages }}
    >
      {children}
    </CaseSummaryContext.Provider>
  );
};
