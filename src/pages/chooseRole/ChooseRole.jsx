import React, { useCallback, useEffect, useState, useRef } from "react";
import Logo from "../../components/logo/Logo";
import axios from "axios";
import endpointsServer from "../../helpers/endpointsServer";
import { ToastContainer } from "react-toastify";
import { toastMessage, toastPromise } from "../../helpers/AlertMessage";
import { useLocation, useNavigate } from "react-router-dom";
import { Error404 } from "../Error/Error";

function ChooseRole() {
  axios.defaults.withCredentials = true;

  const [selectedRole, setSelectedRole] = useState(
    "91a8a216-31ed-4945-8b82-cbc87b044739"
  );
  const [roles, setRoles] = useState([]);

  const statusRole = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchRoles = useCallback(async () => {
    try {
      const rolesPromise = await axios.get(endpointsServer.roles);

      setRoles(rolesPromise.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSelectedRole = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  const handleSubmitRole = useCallback(
    (e) => {
      e.preventDefault();

      console.log(selectedRole);

      const rolePromise = axios.put(
        `${endpointsServer.chooseRole}?email=${location.state.email}`,
        {
          role_id: selectedRole,
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
        },
        () => {
          if (statusRole.current === true) {
            navigate("/login");
          }
        }
      );

      rolePromise
        .then((res) => {
          statusRole.current = res.data.success;
        })
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
          {roles
            .filter(
              (role) =>
                role.roles_id === "91a8a216-31ed-4945-8b82-cbc87b044739" ||
                role.roles_id === "0ed16806-0500-448d-b245-524f2c5ee8bc"
            )
            .map((role) => (
              <div
                className={`template ${
                  selectedRole === role.roles_id ? "active" : ""
                }`}
                key={role.roles_id}
                onClick={() => handleSelectedRole(role.roles_id)}
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
