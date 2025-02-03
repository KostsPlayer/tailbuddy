import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import LoaderPages from "../../components/loader/LoaderPages";
import {
  toastMessage,
  toastDevelop,
  toastPromise,
} from "../../helpers/AlertMessage";
import DashboardCoreContext from "./DashboardCoreContext";

const DashboardCoreProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoadingDashboardCore, setIsLoadingDashboardCore] = useState(false);
  const navigate = useNavigate();

  const setDashboardCoreLoader = useCallback((loading) => {
    setIsLoadingDashboardCore((prev) => (prev !== loading ? loading : prev));
  }, []);

  useEffect(() => {
    const tokenFromCookies = Cookies.get("tailbuddy");

    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      toastMessage,
      toastDevelop,
      toastPromise,
      token,
      isLoadingDashboardCore,
      setDashboardCoreLoader,
    }),
    [token, isLoadingDashboardCore, setDashboardCoreLoader]
  );

  return (
    <DashboardCoreContext.Provider value={contextValue}>
      {isLoadingDashboardCore && <LoaderPages />}
      {children}
      <ToastContainer />
    </DashboardCoreContext.Provider>
  );
};

DashboardCoreProvider.propTypes = {
  children: PropTypes.node,
};

export default DashboardCoreProvider;
