import React, { useState, useEffect } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401 } from "../Error/Error";
import { useLocation, useNavigate } from "react-router-dom";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  // const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.messageLogin) {
      toastMessage("success", location.state.messageLogin);
      navigate(location.pathname, {
        state: { ...location.state, messageLogin: undefined },
        replace: true,
      });
    }
  }, [location.state, navigate, toastMessage, location.pathname]);

  return (
    <>
      {/* {!dataCookie ? (
        <Error401 />
      ) : dataCookie.role === "admin" ? (
        <LayoutDashboard>
          <div className="dashboard-admin">
            Dashboard <span> Admin</span>
          </div>
        </LayoutDashboard>
      ) : dataCookie.role === "seller" ? (
        <LayoutDashboard>
          <div className="dashboard-seller">
            Dashboard <span> Seller</span>
          </div>
        </LayoutDashboard>
      ) : (
        <LayoutDashboard>
          <div className="dashboard-user">
            Dashboard <span> User</span>
          </div>
        </LayoutDashboard>
      )} */}
      <LayoutDashboard>Dashboard</LayoutDashboard>
      <ToastContainer />
    </>
  );
}

export default Dashboard;
