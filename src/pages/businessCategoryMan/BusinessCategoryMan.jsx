import React, { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import businessCategories from "../../data/businessCategories.json";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import LayoutSupport from "../../components/layout/layoutSupport/LayoutSupport";

function BusinessCategoryMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(businessCategories);

  const handleDeleteItem = useCallback(
    (id) => {
      const newData = data.filter((item) => item.id !== id);
      toastMessage("success", "Item deleted successfully!");
      setData(newData);
    },
    [data]
  );

  return (
    <>
      {!dataCookie ? (
        <Error401 />
      ) : dataCookie.role !== "admin" ? (
        <Error403 />
      ) : (
        <LayoutDashboard>
          <div className="business-category-man">
            <LayoutSupport
              type="businessCategories"
              title="Business Category"
              titleSpan="Management"
              data={data}
              handleDeleteItem={handleDeleteItem}
            />
          </div>
        </LayoutDashboard>
      )}
      <ToastContainer />
    </>
  );
}

export default BusinessCategoryMan;
