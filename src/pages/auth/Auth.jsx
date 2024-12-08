import React from "react";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="auth">
      <div className="auth-image"></div>
      <div className="auth-content">
        <div className="logo">
          <img src="" alt="" />
          <span>tailbuddy</span>
        </div>
        <div className="title"></div>
        <div className="preface"></div>
        <div className="integration">
          <div className="integration-item"></div>
          <div className="integration-item"></div>
          <div className="integration-item"></div>
        </div>
        <div className="divider"></div>
        <form className="form">
          <div className="form-input">
            <input
              type="text"
              name="email"
              autoComplete="email"
              placeholder="Email address or username"
            />
          </div>
          <div className="form-input">
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
            />
            <span class="material-symbols-rounded">visibility_off</span>
          </div>
          <div className="form-option">
            <div className="remember-me">
              <span class="material-symbols-rounded">select_check_box</span>
              <div className="text">Remember me for 30 days</div>
            </div>
            <div className="forgot-password">Forgot Password</div>
          </div>
          <div className="form-button">Login</div>
          <div className="to-signup">
            Don't have an account? <Link>Signup</Link>
          </div>
        </form>
        <div className="note">
          By signing up, you agree to our <span>Terms of Service</span> and{" "}
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
