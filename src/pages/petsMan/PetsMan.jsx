import React, { useState, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import pets from "../../data/pets.json";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import LayoutSupport from "../../components/layout/layoutSupport/LayoutSupport";

function PetsMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(pets);

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
          <div className="pets-man">
            <LayoutSupport
              type="pets"
              title="Pets"
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

export default PetsMan;
