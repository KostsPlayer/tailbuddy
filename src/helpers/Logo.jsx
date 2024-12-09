import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logos/logo-fix.png";

function Logo() {
  return (
    <Link to={"/"} className="tailbuddy-logo">
      <img src={logo} alt="TailBuddy's Logo" />
      <div className="tailbuddy-logo-title">
        tail<span>buddy</span>
      </div>
    </Link>
  );
}

export default Logo;
