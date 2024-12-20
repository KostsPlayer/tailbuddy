import React, { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "universal-cookie";
import { getDecryptedCookie } from "../../../helpers/Crypto";
import { useNavigate, NavLink } from "react-router-dom";
import { toastDevelop } from "../../../helpers/AlertMessage";
import Logo from "../../logo/Logo";

function Topbar() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const settingRef = useRef();
  const sidebarRef = useRef();

  const navigate = useNavigate();

  const handleClickOutside = useCallback(
    (e) => {
      if (settingRef.current && !settingRef.current.contains(e.target)) {
        setIsSettingOpen(false);
      } else if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    },
    [settingRef, sidebarRef]
  );

  useEffect(() => {
    if (isSettingOpen || isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingOpen, isSidebarOpen]);

  const handleLogout = useCallback(() => {
    if (dataCookie) {
      const cookies = new Cookies();

      cookies.remove("tailbuddy");
      navigate("/login", { state: { messageLogout: "Logout successfully!" } });
    }
  }, [dataCookie]);

  return (
    <div className="layout-dashboard-topbar">
      <Logo />
      <div className="config">
        <div className="config-setting">
          <div className="text" onClick={() => toastDevelop("help support")}>
            Help Support
          </div>
        </div>
        <div className="config-setting" onClick={() => setIsSettingOpen(true)}>
          <div className="text">Account Setting</div>
          <div className="image">P</div>

          {isSettingOpen && (
            <div className="setting-modal" ref={settingRef}>
              <div className="setting-modal-profile">
                <div className="username">{dataCookie.username}</div>
                <div className="email">{dataCookie.email}</div>
              </div>
              <div
                className="setting-modal-item"
                onClick={() => toastDevelop("notifications")}
              >
                Notifications
              </div>
              <div
                className="setting-modal-item"
                onClick={() => toastDevelop("language")}
              >
                Language
              </div>
              <div className="setting-modal-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      <span
        className="material-symbols-rounded menu"
        onClick={() => setIsSidebarOpen(true)}
      >
        menu
      </span>

      {isSidebarOpen && (
        <>
          <div className="mobile-overlay"></div>
          <div className="mobile-sidebar" ref={sidebarRef}>
            <div className="mobile-sidebar-top">
              <Logo />
              <span
                className="material-symbols-rounded close"
                onClick={() => setIsSidebarOpen(false)}
              >
                close
              </span>
            </div>
            <NavLink to={"/dashboard"} className="item">
              <span className="material-symbols-rounded">dashboard</span>
              <div className="text">Dashboard</div>
            </NavLink>

            {dataCookie && dataCookie.role === "seller" && (
              <NavLink to={"/pets"} className="item">
                <span className="material-symbols-rounded">pets</span>
                <div className="text">Pets</div>
              </NavLink>
            )}

            {dataCookie && dataCookie.role === "admin" && (
              <>
                <NavLink to={"/users-management"} className="item">
                  <span className="material-symbols-rounded">
                    manage_accounts
                  </span>
                  <div className="text">Users Management</div>
                </NavLink>
                <NavLink to={"/pets"} className="item">
                  <span className="material-symbols-rounded">pets</span>
                  <div className="text">Pets</div>
                </NavLink>
                <NavLink to={"/products"} className="item">
                  <span className="material-symbols-rounded">inventory</span>
                  <div className="text">Products</div>
                </NavLink>
                <NavLink to={"/business"} className="item">
                  <span className="material-symbols-rounded">equalizer</span>
                  <div className="text">Business</div>
                </NavLink>
                <NavLink to={"/business-category"} className="item">
                  <span className="material-symbols-rounded">category</span>
                  <div className="text">Business Category</div>
                </NavLink>
              </>
            )}
            <div className="username">{dataCookie.username}</div>
            <div className="email">{dataCookie.email}</div>
            <div className="item" onClick={() => toastDevelop("help support")}>
              Help Support
            </div>
            <div className="item" onClick={() => toastDevelop("notifications")}>
              Notifications
            </div>
            <div className="item" onClick={() => toastDevelop("language")}>
              Language
            </div>
            <div className="item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Topbar;
