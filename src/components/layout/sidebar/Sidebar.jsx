import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { getDecryptedCookie } from "../../../helpers/Crypto";
import DashboardCore from "../../../context/dashboardCore/DashboardCore";

function Sidebar() {
  const { token } = DashboardCore();

  return (
    <div className="layout-dashboard-sidebar">
      <NavLink to={"/dashboard"} className="item">
        <span className="material-symbols-rounded">dashboard</span>
        <div className="text">Dashboard</div>
      </NavLink>
      {/* <NavLink to={"/users-management"} className="item">
        <span className="material-symbols-rounded">manage_accounts</span>
        <div className="text">Users Management</div>
      </NavLink> */}
      <NavLink to={"/pets"} className="item">
        <span className="material-symbols-rounded">pets</span>
        <div className="text">Pets</div>
      </NavLink>
      <NavLink to={"/pet-categories"} className="item">
        <span className="material-symbols-rounded">pet_supplies</span>
        <div className="text">Pet Categories</div>
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
    </div>
  );
}

export default Sidebar;
