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
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const LandingCoreProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoadingLandingCore, setIsLoadingLandingCore] = useState(false);
  const [business, setBusiness] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [pets, setPets] = useState([]);
  const [products, setProducts] = useState([]);
  const [groomingServices, setGroomingServices] = useState([]);
  const [photographyServices, setPhotographyServices] = useState([]);
  const [isMe, setIsMe] = useState(null);

  const navigate = useNavigate();

  const setLandingCoreLoader = useCallback((loading) => {
    setIsLoadingLandingCore((prev) => (prev !== loading ? loading : prev));
  }, []);

  useEffect(() => {
    const tokenFromCookies = Cookies.get("tailbuddy");

    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingLandingCore(true);

      const [
        businessPromise,
        businessCategoriesPromise,
        petsPromise,
        productsPromise,
        groomingServicesPromise,
        photographyServicesPromise,
      ] = await Promise.all([
        apiConfig.get(endpointsServer.business),
        apiConfig.get(endpointsServer.businessCategoriesAll),
        axios.get(endpointsServer.pets, {
          withCredentials: true,
        }),
        apiConfig.get(endpointsServer.products),
        apiConfig.get(endpointsServer.groomingServices),
        apiConfig.get(endpointsServer.photographyServices),
      ]);

      setBusiness(businessPromise.data.data);
      setBusinessCategories(businessCategoriesPromise.data.data);
      setPets(petsPromise.data.data);
      setProducts(productsPromise.data.data);
      setGroomingServices(groomingServicesPromise.data.data);
      setPhotographyServices(photographyServicesPromise.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLandingCore(false);
    }
  }, [setIsLoadingLandingCore]);

  useEffect(() => {
    fetchData();

    if (token) {
      const decodedToken = jwtDecode(token);

      setIsLoadingLandingCore(true);

      apiConfig
        .get(`${endpointsServer.userId}?id=${decodedToken.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsMe(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingLandingCore(false);
        });
    }
  }, [fetchData, token, setIsLoadingLandingCore]);

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
      pets,
      products,
      groomingServices,
      photographyServices,
      isMe,
    }),
    [
      token,
      isLoadingLandingCore,
      setLandingCoreLoader,
      business,
      businessCategories,
      pets,
      products,
      groomingServices,
      photographyServices,
      isMe,
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
