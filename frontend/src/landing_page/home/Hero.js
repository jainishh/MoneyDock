import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row justify-content-center text-center">
        <div className="col-12 col-md-10">
          <img
            src="media/images/homeHero.png"
            alt="Hero Img"
            className="img-fluid"
          />
        </div>
        <div className="col-12 mt-4">
          <h2 style={{ color: "#424242", fontSize: "30px" }}>
            Invest in everything
          </h2>
          <p className="mt-3" style={{ fontSize: "1.1em", color: "#424242" }}>
            Online platform to invest in stocks, derivatives, mutual funds,
            ETFs, bonds, and more.
          </p>
        </div>
        <div className="col-12 mt-3">
          <button
            className="btn btn-primary fs-5 px-4 py-2 "
            style={{ backgroundColor: "#387ed1", fontWeight: "500" }}
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/signup");
            }}
          >
            Sign up for free
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
