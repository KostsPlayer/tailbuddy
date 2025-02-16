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
import { jwtDecode } from "jwt-decode";
import endpointsServer from "../../helpers/endpointsServer";
import apiConfig from "../../helpers/apiConfig";

const DashboardCoreProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoadingDashboardCore, setIsLoadingDashboardCore] = useState(false);
  const navigate = useNavigate();
  const [isMe, setIsMe] = useState({});

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

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      setIsLoadingDashboardCore(true);

      apiConfig
        .get(`${endpointsServer.userId}?id=${decodedToken.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // console.log(res.data.data);

          setIsMe(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingDashboardCore(false);
        });
    }
  }, [token, setIsLoadingDashboardCore]);

  const contextValue = useMemo(
    () => ({
      toastMessage,
      toastDevelop,
      toastPromise,
      token,
      isLoadingDashboardCore,
      setDashboardCoreLoader,
      isMe,
    }),
    [token, isLoadingDashboardCore, setDashboardCoreLoader, isMe]
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
