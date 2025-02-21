import { useState, useCallback, useEffect } from "react";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import { filterToday } from "../../helpers/FilterToday";
import { filterThisMonth } from "../../helpers/FilterThisMonth";
import useFetchDashboard from "./useFetchDashboard";
import { filterThisWeek } from "../../helpers/FilterThisWeek";

function usePriceDashboard() {
  const [groomingPriceToday, setGroomingPriceToday] = useState(0);
  const [groomingPriceThisWeek, setGroomingPriceThisWeek] = useState(0);
  const [groomingPriceThisMonth, setGroomingPriceThisMonth] = useState(0);
  const [photographyPriceToday, setPhotographyPriceToday] = useState(0);
  const [photographyPriceThisWeek, setPhotographyPriceThisWeek] = useState(0);
  const [photographyPriceThisMonth, setPhotographyPriceThisMonth] = useState(0);
  const [petPriceToday, setPetPriceToday] = useState(0);
  const [petPriceThisWeek, setPetPriceThisWeek] = useState(0);
  const [petPriceThisMonth, setPetPriceThisMonth] = useState(0);
  const [productPriceToday, setProductPriceToday] = useState(0);
  const [productPriceThisWeek, setProductPriceThisWeek] = useState(0);
  const [productPriceThisMonth, setProductPriceThisMonth] = useState(0);

  const { grooming, photography, pet, product } = useFetchDashboard();
  const { setDashboardCoreLoader, token } = DashboardCore();

  useEffect(() => {
    try {
      setDashboardCoreLoader(true);

      apiConfig
        .get(endpointsServer.transactions, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // console.log(res.data.data);

          const combinedArray = [
            ...grooming,
            ...pet,
            ...product,
            ...photography,
          ];

          const getData = res.data.data.map((item) => {
            const data = combinedArray.find(
              (data) => data.transaction_id === item.transactions_id
            );

            return {
              type: item.type,
              status: item.status,
              ...data,
            };
          });

          setGroomingPriceToday(
            filterToday(getData)
              .filter(
                (item) => item.type === "grooming" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPhotographyPriceToday(
            filterToday(getData)
              .filter(
                (item) => item.type === "photography" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPetPriceToday(
            filterToday(getData)
              .filter((item) => item.type === "pet" && item.status === "done")
              .map((item) => item.pets.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setProductPriceToday(
            filterToday(getData)
              .filter(
                (item) => item.type === "product" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );



          setGroomingPriceThisWeek(
            filterThisWeek(getData)
              .filter(
                (item) => item.type === "grooming" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPhotographyPriceThisWeek(
            filterThisWeek(getData)
              .filter(
                (item) => item.type === "photography" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPetPriceThisWeek(
            filterThisWeek(getData)
              .filter((item) => item.type === "pet" && item.status === "done")
              .map((item) => item.pets.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setProductPriceThisWeek(
            filterThisWeek(getData)
              .filter(
                (item) => item.type === "product" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          
          setGroomingPriceThisMonth(
            filterThisMonth(getData)
              .filter(
                (item) => item.type === "grooming" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPhotographyPriceThisMonth(
            filterThisMonth(getData)
              .filter(
                (item) => item.type === "photography" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setPetPriceThisMonth(
            filterThisMonth(getData)
              .filter((item) => item.type === "pet" && item.status === "done")
              .map((item) => item.pets.price)
              .reduce((acc, price) => acc + price, 0)
          );
          setProductPriceThisMonth(
            filterThisMonth(getData)
              .filter(
                (item) => item.type === "product" && item.status === "done"
              )
              .map((item) => item.price)
              .reduce((acc, price) => acc + price, 0)
          );
        });
    } catch (error) {
      console.log(error);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [grooming, photography, pet, product, token, setDashboardCoreLoader]);

  return {
    groomingPriceToday,
    groomingPriceThisWeek,
    groomingPriceThisMonth,
    photographyPriceToday,
    photographyPriceThisWeek,
    photographyPriceThisMonth,
    petPriceToday,
    petPriceThisWeek,
    petPriceThisMonth,
    productPriceToday,
    productPriceThisWeek,
    productPriceThisMonth,
  };
}

export default usePriceDashboard;
