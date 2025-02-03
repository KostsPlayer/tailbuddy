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
import LandingCoreContext from "./LandingCoreContext";
import endpointsServer from "../../helpers/endpointsServer";
import apiConfig from "../../helpers/apiConfig";

const LandingCoreProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoadingLandingCore, setIsLoadingLandingCore] = useState(false);
  const [business, setBusiness] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);

  const navigate = useNavigate();

  const setLandingCoreLoader = useCallback((loading) => {
    setIsLoadingLandingCore((prev) => (prev !== loading ? loading : prev));
  }, []);

  useEffect(() => {
    const tokenFromCookies = Cookies.get("tailbuddy");

    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingLandingCore(true);

      const [businessPromise, businessCategoriesPromise] = await Promise.all([
        apiConfig.get(endpointsServer.business, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiConfig.get(endpointsServer.businessCategoriesAll, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBusiness(businessPromise.data.data);
      setBusinessCategories(businessCategoriesPromise.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLandingCore(false);
    }
  }, [token, setIsLoadingLandingCore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contextValue = useMemo(
    () => ({
      toastMessage,
      toastDevelop,
      toastPromise,
      token,
      isLoadingLandingCore,
      setLandingCoreLoader,
      business,
      businessCategories,
    }),
    [
      token,
      isLoadingLandingCore,
      setLandingCoreLoader,
      business,
      businessCategories,
    ]
  );

  return (
    <LandingCoreContext.Provider value={contextValue}>
      {isLoadingLandingCore && <LoaderPages />}
      {children}
      <ToastContainer />
    </LandingCoreContext.Provider>
  );
};

LandingCoreProvider.propTypes = {
  children: PropTypes.node,
};

export default LandingCoreProvider;
