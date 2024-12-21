import React, { useCallback, useEffect, useState, useRef } from "react";
import Logo from "../../components/logo/Logo";
import axios from "axios";
import endpointsServer from "../../helpers/endpointsServer";
import { ToastContainer } from "react-toastify";
import { toastMessage, toastPromise } from "../../helpers/AlertMessage";
import { useLocation } from "react-router-dom";
import { Error404 } from "../Error/Error";

const roles = [
  {
    icon: "manage_accounts",
    role: "seller",
    desc: "Mengelola produk, pesanan, komunikasi dengan pembeli, dan laporan penjualan.",
  },
  {
    icon: "person",
    role: "customer",
    desc: "Menjelajahi, membeli produk, memberikan ulasan, dan mengelola pesanan.",
  },
];

function ChooseRole() {
  axios.defaults.withCredentials = true;

  const [selectedRole, setSelectedRole] = useState("customer");

  const location = useLocation();

  const handleSelectedRole = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  const handleSubmitRole = useCallback(
    (e) => {
      e.preventDefault();

      const rolePromise = axios.put(
        `${endpointsServer.chooseRole}?email=${location.state.email}`,
        {
          role: selectedRole,
        }
      );

      toastPromise(
        rolePromise,
        {
          pending: "Choose role in progress, please wait..",
          success: "Choose role successful! 🎉",
          error: "Failed to choose role, please try again!",
        },
        {
          position: "top-center",
          autoClose: 5000,
        }
      );

      rolePromise
        .then((res) => {})
        .catch((err) => {
          console.error(err);
          toastMessage("error", err);
        });
    },
    [selectedRole]
  );

  if (!location.state) return <Error404 />;

  return (
    <>
      <div className="choose-role">
        <Logo />
        <div className="choose-role-title">Choose your role</div>
        <div className="choose-role-content">
          {roles.map((role, index) => (
            <div
              className={`template ${
                selectedRole === role.role ? "active" : ""
              }`}
              key={index}
              onClick={() => handleSelectedRole(role.role)}
            >
              <span className="material-symbols-rounded">{role.icon}</span>
              <span className="role">{role.role}</span>
              <span className="desc">{role.desc}</span>
            </div>
          ))}
        </div>
        <div className="choose-role-button" onClick={handleSubmitRole}>
          Choose
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ChooseRole;
