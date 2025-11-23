import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TradingAccount.css";

function TradingAccount() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form State (same structure as your other project)
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   Input Handler (same as other project)
  const handleinfo = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //    Main Submit Handler (merged signup + login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = info;

    //  CHANGED — Validation
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (isLogin) {
        //   LOGIN LOGIC (copied from your Login.js)
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          { email, password }
        );

        const { success, message, jwtToken, name } = res.data;

        if (success) {
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("loggedInUser", name);

          //  SAME LOGIC AS OTHER PROJECT
          window.location.href = `${process.env.REACT_APP_DASHBOARD_URL}?token=${jwtToken}&name=${name}`;
        } else {
          alert(message);
        }
      } else {
        //   SIGNUP LOGIC (copied from your Signup.js)
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/signup`,
          { name, email, password }
        );

        if (res.data.success) {
          setIsLogin(true);
        } else {
          alert(res.data.message || "Signup failed. Try again.");
        }
      }
    } catch (err) {
      if (isLogin) {
        alert("Some error occurred during login.");
        console.error(err);
      } else {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("An error occurred. Please try again later.");
        }
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row top align-items-center justify-content-between">
        {/* Left Image Section */}
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
          <img
            src="media/images/tradingaccount.svg"
            alt="Preview"
            className="img-fluid"
            style={{ maxWidth: "550px" }}
          />
        </div>

        {/* Right Form Section */}
        <div className="col-12 col-md-5">
          <h2 className="text-center mb-2" style={{ color: "#424242" }}>
            Open a free demat and trading account online
          </h2>

          <p className="text-center mb-4" style={{ color: "#666" }}>
            Start investing brokerage free and join a community of 1.6+ crore
            users
          </p>

          <h4
            className="fw-semibold mb-3 text-center"
            style={{ color: "#424242" }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </h4>

          {/*  CHANGED — Added onSubmit with AUTH LOGIC */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  name="name"
                  value={info.name}
                  onChange={handleinfo}
                />
              </div>
            )}

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={info.email}
                onChange={handleinfo}
              />
            </div>

            <div className="mb-4">
              <label>Password</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  value={info.password}
                  onChange={handleinfo}
                />

                {/* Show / Hide Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#387ED1",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              className="btn w-100 text-white"
              style={{
                background: "#387ED1",
                padding: "10px",
                borderRadius: "25px",
              }}
              type="submit"
            >
              {isLogin ? "LOGIN" : "SIGN UP"}
            </button>
          </form>

          <p className="text-center mt-3">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span
              style={{ cursor: "pointer", color: "#387ED1", fontWeight: 500 }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {" "}
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// hell

export default TradingAccount;
