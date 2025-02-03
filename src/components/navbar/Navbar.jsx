import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Logo from "../logo/Logo";
import Cookies from "js-cookie";

function Navbar() {
  const [openNavbar, setOpenNavbar] = useState(false);
  const navbarMediaRef = useRef();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("tailbuddy");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        navbarMediaRef.current &&
        !navbarMediaRef.current.contains(e.target)
      ) {
        setOpenNavbar(false);
      }
    },
    [navbarMediaRef]
  );

  useEffect(() => {
    if (openNavbar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNavbar]);

  return (
    <>
      <div className="navbar">
        <Logo />
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
          <div className="navbar-elements-auth">
            {isAuthenticated ? (
              <Link className="auth-to" to="/dashboard">
                Go To Dashboard
              </Link>
            ) : (
              <>
                <Link className="auth-to" to="/login">
                  Login
                </Link>
                <Link className="auth-to" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
        <span
          className="material-symbols-rounded"
          onClick={() => setOpenNavbar(true)}
        >
          menu
        </span>

        {openNavbar && (
          <>
            <div className="mobile-overlay"></div>
            <div className="mobile-navbar" ref={navbarMediaRef}>
              <Logo />
              <div className="mobile-navbar-elements">
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
                <div className="elements-auth">
                  {isAuthenticated ? (
                    <Link className="auth-to" to="/dashboard">
                      Go To Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link className="auth-to" to="/login">
                        Login
                      </Link>
                      <Link className="auth-to" to="/signup">
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
