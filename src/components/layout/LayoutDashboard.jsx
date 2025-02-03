import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import SmoothScroll from "../../helpers/SmoothScroll";

function LayoutDashboard({ children }) {
  return (
    <div className="layout-dashboard">
      {/* <SmoothScroll /> */}
      <Sidebar />
      <Topbar />
      <div className="layout-dashboard-content">{children}</div>
    </div>
  );
}

export default LayoutDashboard;
