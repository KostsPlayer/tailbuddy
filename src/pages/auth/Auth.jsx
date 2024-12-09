import React, { useState, useCallback, useEffect } from "react";
import SmoothScroll from "../../helpers/SmoothScroll";
import facebook from "../../assets/images/login/facebook.png";
import google from "../../assets/images/login/google.png";
import whatsapp from "../../assets/images/login/whatsapp.png";
import { Link } from "react-router-dom";
import Logo from "../../helpers/Logo";
import usersData from "../../data/users.json";
import { toastDevelop, toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { setEncryptedCookie, getDecryptedCookie } from "../../helpers/Crypto";

function Auth({ type = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [hidePassword, setHidePassword] = useState(true);
  const [activeRemember, setActiveRemember] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState(usersData);
  const [newUser, setNewUser] = useState(() =>
    location.state?.newUser ? [location.state.newUser] : []
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (type === "signup") {
        const isEmailExists = users.some((user) => user.email === values.email);

        if (isEmailExists) {
          toastMessage("error", "Email already exists!", {
            position: "top-center",
          });
          return;
        }

        const newUser = {
          id: users.length + 1,
          username: values.username,
          email: values.email,
          password: values.password,
          role: "user",
          image: "pexels-olly-712513.jpg",
        };

        setUsers((prevUsers) => [...prevUsers, newUser]);
        navigate("/login", {
          state: { newUser, messageSignup: "Signup successful!" },
        });
        setValues({ username: "", email: "", password: "" });
      } else {
        const getUser =
          users.find(
            (user) =>
              (user.email === values.email ||
                user.username === values.username) &&
              user.password === values.password
          ) || newUser[0];

        if (getUser) {
          setEncryptedCookie("tailbuddy", getUser, 18);
          navigate("/dashboard", {
            state: {
              messageLogin: `Login successful! Welcome, ${getUser.username}`,
            },
          });
        } else {
          toastMessage("error", "Invalid email or password!", {
            position: "top-center",
          });
        }
      }
    },
    [values, users, navigate, toastMessage]
  );

  useEffect(() => {
    if (location.state?.messageSignup) {
      toastMessage("success", location.state.messageSignup);
      navigate(location.pathname, {
        state: { ...location.state, messageSignup: undefined },
        replace: true,
      });
    }

    if (location.state?.messageLogout) {
      toastMessage("success", location.state.messageLogout);
      navigate(location.pathname, {
        state: { ...location.state, messageLogout: undefined },
        replace: true,
      });
    }
  }, [location.state, navigate, toastMessage, location.pathname]);

  return (
    <>
      <SmoothScroll />
      <div className="auth">
        <div className="auth-image"></div>
        <div className="auth-content">
          <Logo />
          <div className="title">
            {type === "signup" ? "Signup" : "Login"} to get started
          </div>
          <div className="preface">
            Welcome {type === "signup" ? "" : "back"}! Let's Groove
          </div>
          <div className="integration">
            <img
              className="integration-item"
              src={facebook}
              alt="Facebook Logo"
              onClick={() => toastDevelop("facebook")}
            />
            <img
              className="integration-item"
              src={google}
              alt="Google Logo"
              onClick={() => toastDevelop("google")}
            />
            <img
              className="integration-item"
              src={whatsapp}
              alt="Whatsapp Logo"
              onClick={() => toastDevelop("whatsapp")}
            />
          </div>
          <div className="divider"></div>
          <form className="form" onSubmit={handleSubmit}>
            {type === "signup" && (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Username"
                  onChange={handleChange}
                  value={values.username}
                />
              </div>
            )}
            <div className="form-group">
              <input
                type="text"
                name="email"
                autoComplete="email"
                placeholder={
                  type === "signup"
                    ? "Email address"
                    : "Email address or username"
                }
                onChange={handleChange}
                value={values.email}
              />
            </div>
            <div className="form-group">
              <input
                type={`${hidePassword ? "password" : "text"}`}
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                onChange={handleChange}
                value={values.password}
              />
              <span
                className="material-symbols-rounded"
                onClick={() => setHidePassword(!hidePassword)}
              >
                {hidePassword ? "visibility_off" : "visibility"}
              </span>
            </div>
            <div className="form-option">
              <div
                className="remember-me"
                onClick={() => {
                  setActiveRemember(!activeRemember);
                  toastDevelop("remember me");
                }}
              >
                <span
                  className={`material-symbols-rounded ${
                    activeRemember ? "checked" : ""
                  }`}
                >
                  priority
                </span>
                <div className="text">Remember me for 30 days</div>
              </div>
              <div
                className="forgot-password"
                onClick={() => toastDevelop("forgot password")}
              >
                Forgot Password
              </div>
            </div>
            <button className="form-button" type="submit">
              {type === "signup" ? "Submit" : "Login"}
            </button>
            <div className="to-other">
              Don't have an account?{" "}
              <Link
                className="to-other-item"
                to={type === "signup" ? "/login" : "/signup"}
              >
                {type === "signup" ? "Login" : "Signup"}
              </Link>
            </div>
          </form>
          <div className="note">
            By signing {type === "signup" ? "up" : "in"} , you agree to our{" "}
            <span onClick={() => toastDevelop("terms of service")}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span onClick={() => toastDevelop("privacy policy")}>
              Privacy Policy
            </span>
            .
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export function Login() {
  return <Auth />;
}

export function Signup() {
  return <Auth type="signup" />;
}
