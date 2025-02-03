import React, { useState } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";

function UsersMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));

  return (
    <>
      {/* {!dataCookie ? (
        <Error401 />
      ) : dataCookie.role !== "admin" ? (
        <Error403 />
      ) : (
      )} */}
        <LayoutDashboard>
          <div className="users-man">
            Users <span> Management</span>
          </div>
        </LayoutDashboard>
    </>
  );
}

export default UsersMan;
