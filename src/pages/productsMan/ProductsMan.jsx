import React, { useState, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import products from "../../data/products.json";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import LayoutSupport from "../../components/layout/layoutSupport/LayoutSupport";

function ProductsMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(products);

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
          <div className="products-man">
            <LayoutSupport
              type="products"
              title="Products"
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

export default ProductsMan;
