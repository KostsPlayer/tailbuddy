import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/logo-fix.png";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="TailBuddy's Logo" />
          <div className="title">
            tail<span>buddy</span>
          </div>
        </div>

        <div className="navbar-elements">
          <div className="links">
            <Link className="links-to" to="/home">
              Home
            </Link>
            <Link className="links-to" to="/marketplace">
              Market Place
            </Link>
            <Link className="links-to" to="/contact">
              Contact
            </Link>
            <Link className="links-to" to="/about">
              About
            </Link>
          </div>
          <div className="auth">
            <Link className="auth-to" to="/login">
              Login
            </Link>
            <Link className="auth-to" to="/signup">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
