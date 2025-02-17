import { useState, useCallback, useEffect } from "react";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import { filterToday } from "../../helpers/FilterToday";
import { filterThisMonth } from "../../helpers/filterThisMonth";
import useFetchDashboard from "./useFetchDashboard";

function usePriceDashboard() {
  const [groomingPriceToday, setGroomingPriceToday] = useState(0);
  const [groomingPriceThisMonth, setGroomingPriceThisMonth] = useState(0);
  const [photographyPriceToday, setPhotographyPriceToday] = useState(0);
  const [photographyPriceThisMonth, setPhotographyPriceThisMonth] = useState(0);
  const [petPriceToday, setPetPriceToday] = useState(0);
  const [petPriceThisMonth, setPetPriceThisMonth] = useState(0);
  const [productPriceToday, setProductPriceToday] = useState(0);
  const [productPriceThisMonth, setProductPriceThisMonth] = useState(0);

  const { grooming, photography, pet, product } = useFetchDashboard();

  useEffect(() => {
    setGroomingPriceToday(
      filterToday(grooming)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setPhotographyPriceToday(
      filterToday(photography)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setPetPriceToday(
      filterToday(pet)
        .map((item) => item.pets.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setProductPriceToday(
      filterToday(product)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );

    setGroomingPriceThisMonth(
      filterThisMonth(grooming)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setPhotographyPriceThisMonth(
      filterThisMonth(photography)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setPetPriceThisMonth(
      filterThisMonth(pet)
        .map((item) => item.pets.price)
        .reduce((acc, price) => acc + price, 0)
    );
    setProductPriceThisMonth(
      filterThisMonth(product)
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0)
    );
  }, [grooming, photography, pet, product]);

  return {
    groomingPriceToday,
    groomingPriceThisMonth,
    photographyPriceToday,
    photographyPriceThisMonth,
    petPriceToday,
    petPriceThisMonth,
    productPriceToday,
    productPriceThisMonth,
  };
}

export default usePriceDashboard;
