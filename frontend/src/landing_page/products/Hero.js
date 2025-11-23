import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container">
      <div className="row p-4">
        <div className="col-12 justify-content-center text-center py-2 lh-sm py-md-5">
          <h1
            className="mb-3"
            style={{ fontSize: "1.75rem", color: "#424242", fontWeight: 500 }}
          >
            MoneyDock Products
          </h1>
          <p
            className="mb-4"
            style={{
              fontSize: "1.25rem",
              color: "#424242",
              fontWeight: 400,
            }}
          >
            Sleek, modern, and intuitive trading platforms
          </p>
          <p style={{ fontSize: "1rem", color: "#424242" }}>
            Check out our{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              investment offerings →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
