import { useState, useCallback, useEffect } from "react";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";

function useFetchDashboard() {
  const [grooming, setGrooming] = useState([]);
  const [photography, setPhotography] = useState([]);
  const [pet, setPet] = useState([]);
  const [product, setProduct] = useState([]);

  const { setDashboardCoreLoader, token } = DashboardCore();

  const fetchAllData = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);

      const [groomingPrm, photographyPrm, petPrm, productPrm] =
        await Promise.all([
          apiConfig.get(endpointsServer.groomingReservation, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          apiConfig.get(endpointsServer.photograpy, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          apiConfig.get(endpointsServer.petSales, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          apiConfig.get(endpointsServer.productSales, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      setGrooming(groomingPrm.data.data);
      setPhotography(photographyPrm.data.data);
      setPet(petPrm.data.data);
      setProduct(productPrm.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [setDashboardCoreLoader, token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    grooming,
    photography,
    pet,
    product,
  };
}

export default useFetchDashboard;
