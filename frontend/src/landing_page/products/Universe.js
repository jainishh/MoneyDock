import React from "react";
import { Link } from "react-router-dom";
import "./Universe.css";
import { useNavigate } from "react-router-dom";

function Universe() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row p-4 text-center align-items-center">
        <div
          className="text-center"
          style={{ marginTop: "30px", marginBottom: "80px" }}
        >
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "#424242",
            }}
          >
            Want to know more about our technology stack? Check out the{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              MoneyDock.tech
            </Link>{" "}
            blog.
          </p>
        </div>
        <div className="text-center">
          <h2
            style={{ fontSize: "1.75rem", lineHeight: 2.5, color: "#424242" }}
          >
            The MoneyDock Universe
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#424242" }}>
            Extend your trading and investment experience even further with our
            partner platforms
          </p>
        </div>

        <div className="col-12 col-md-4 py-5">
          <div>
            <img
              src="media/images/zerodhaFundhouse.png"
              className="img-fluid uni-img"
            ></img>
            <div className="mt-3" style={{ lineHeight: "18px" }}>
              <span
                className=""
                style={{
                  fontSize: "0.75rem",
                  color: "#9B9B9B",
                }}
              >
                Our asset management venture
                <br></br>
                that is creating simple and transparent index
                <br></br>
                funds to help you save for your goals.
              </span>
            </div>
            <div className="mt-5">
              <img
                src="media/images/streakLogo.png"
                className="img-fluid uni-img"
              ></img>
              <div className="mt-3" style={{ lineHeight: "18px" }}>
                <span
                  className=""
                  style={{
                    fontSize: "0.75rem",
                    color: "#9B9B9B",
                  }}
                >
                  Systematic trading platform
                  <br></br>
                  that allows you to create and backtest
                  <br></br>
                  strategies without coding.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 ">
          <div>
            <img
              src="media/images/sensibullLogo.svg"
              className="img-fluid uni-img"
            ></img>
            <div className="mt-3" style={{ lineHeight: "18px" }}>
              <span
                className=""
                style={{
                  fontSize: "0.75rem",
                  color: "#9B9B9B",
                }}
              >
                Options trading platform that lets you
                <br></br>
                create strategies, analyze positions, and examine
                <br></br>
                data points like open interest, FII/DII, and more.
              </span>
            </div>
          </div>
          <div className="mt-5">
            <img
              src="media/images/smallcaseLogo.png"
              className="img-fluid uni-img"
            ></img>
            <div className="mt-3" style={{ lineHeight: "18px" }}>
              <span
                className=""
                style={{
                  fontSize: "0.75rem",
                  color: "#9B9B9B",
                }}
              >
                Thematic investing platform
                <br></br>
                that helps you invest in diversified
                <br></br>
                baskets of stocks on ETFs.
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 py-5 ">
          <div>
            <img
              src="media/images/tijori.svg"
              className="img-fluid uni-img"
            ></img>
            <div className="mt-3" style={{ lineHeight: "18px" }}>
              <span
                className=""
                style={{
                  fontSize: "0.75rem",
                  color: "#9B9B9B",
                }}
              >
                Investment research platform
                <br></br>
                that offers detailed insights on stocks,
                <br></br>
                sectors, supply chains, and more.
              </span>
            </div>
          </div>
          <div className="mt-5">
            <img
              src="media/images/dittoLogo.png"
              className="img-fluid uni-img"
            ></img>
            <div className="mt-3" style={{ lineHeight: "18px" }}>
              <span
                className=""
                style={{
                  fontSize: "0.75rem",
                  color: "#9B9B9B",
                }}
              >
                Personalized advice on life
                <br></br>
                and health insurance. No spam
                <br></br>
                and no mis-selling. Sign up for free
              </span>
            </div>
          </div>
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

export default Universe;
