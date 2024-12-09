import React, { useState, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import LayoutSupport from "../../components/layout/layoutSupport/LayoutSupport";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import business from "../../data/business.json";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";

function BusinessMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(business);

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
          <div className="business-man">
            <LayoutSupport
              type="business"
              title="Business"
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

export default BusinessMan;
