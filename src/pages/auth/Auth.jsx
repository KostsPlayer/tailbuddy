import React, { useState, useCallback, useEffect, useRef } from "react";
import SmoothScroll from "../../helpers/SmoothScroll";
import facebook from "../../assets/images/login/facebook.png";
import google from "../../assets/images/login/google.png";
import whatsapp from "../../assets/images/login/whatsapp.png";
import { Link } from "react-router-dom";
import Logo from "../../components/logo/Logo";
import {
  toastDevelop,
  toastMessage,
  toastPromise,
} from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import { signupSchema } from "../../helpers/ValidationSchema";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import endpointsServer from "../../helpers/endpointsServer";
import axios from "axios";
import Cookies from "js-cookie";

function Auth({ signup }) {
  axios.defaults.withCredentials = true;

  const [hidePassword, setHidePassword] = useState(true);
  const [activeRemember, setActiveRemember] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const loginStatus = useRef(null);
  const regisStatus = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const verifyEmail = searchParams.get("message");

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

      if (signup) {
        signupSchema
          .validate(
            {
              email: values.email,
              username: values.username,
              password: values.password,
            },
            { abortEarly: false }
          )
          .then(() => {
            const signupPromise = axios.post(endpointsServer.registration, {
              username: values.username,
              email: values.email,
              password: values.password,
            });

            toastPromise(
              signupPromise,
              {
                pending: "Signup in progress, please wait..",
                success: "Signup successful! 🎉",
                error: "Failed to signup, please try again!",
              },
              {
                position: "top-center",
                autoClose: 3000,
              },
              () => {
                if (regisStatus.current === 200) {
                  navigate("/choose-role", {
                    state: {
                      email: values.email,
                    },
                  });
                }
              }
            );

            signupPromise
              .then((res) => {
                regisStatus.current = res.status;

                setValues("");
              })
              .catch((err) => {
                toastMessage("error", err, {
                  position: "top-center",
                });
              });
          })
          .catch((errors) => {
            errors.inner.forEach((error) => {
              toastMessage("error", error.message, {
                position: "top-center",
                autoClose: 3500,
              });
            });
          });
      } else {
        const loginPromise = axios.post(endpointsServer.login, {
          email: values.email,
          password: values.password,
        });

        toastPromise(
          loginPromise,
          {
            pending: "Login in progress, please wait.",
            success: "Login successful! 🎉",
            error: "Failed to login, please try again!",
          },
          {
            position: "top-center",
            autoClose: 3000,
          },
          () => {
            if (loginStatus.current === 200) {
              navigate("/dashboard");
            } else {
              return;
            }
          }
        );

        loginPromise
          .then((res) => {
            loginStatus.current = res.status;

            if (loginStatus.current === 200) {
              const token = res.data.token;

              Cookies.set("tailbuddy", token);
            } else {
              return;
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    [values, signup]
  );

  useEffect(() => {
    if (verifyEmail) {
      toastMessage("success", verifyEmail, {
        position: "top-center",
      });

      const params = new URLSearchParams(window.location.search);
      params.delete("message");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, document.title, newUrl);
    }
  }, [verifyEmail]);

  useEffect(() => {
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
      {/* <SmoothScroll /> */}
      <div className="auth">
        <div className="auth-image"></div>
        <div className="auth-content">
          <Logo />
          <div className="title">
            {signup ? "Signup" : "Login"} to get started
          </div>
          <div className="preface">
            Welcome {signup ? "" : "back"}! Let's Groove
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
            {signup && (
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
                  signup ? "Email address" : "Email address or username"
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
              {signup ? "Submit" : "Login"}
            </button>
            <div className="to-other">
              Don't have an account?{" "}
              <Link
                className="to-other-item"
                to={signup ? "/login" : "/signup"}
              >
                {signup ? "Login" : "Signup"}
              </Link>
            </div>
          </form>
          <div className="note">
            By signing {signup ? "up" : "in"} , you agree to our{" "}
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

export default Auth;
