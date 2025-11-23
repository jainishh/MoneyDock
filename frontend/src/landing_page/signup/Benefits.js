import React from "react";

function Benefits() {
  return (
    <div className="container mt-5">
      <div className="row p-4 align-item-center justify-content-center">
        <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <img
            src="media\images\benefits.svg"
            className="img-fluid"
            style={{ width: "350px", height: "233.96px" }}
          />
          <div className="text-center">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "500",
                color: "#424242",
              }}
            >
              Benefits of opening a MoneyDock demat account
            </h2>
          </div>
        </div>
        <div className="col-12 col-md-6 py-5" style={{ fontSize: "1.1em" }}>
          <h3 className="fs-5 mb-4" style={{ color: "#424242" }}>
            Unbeatable pricing
          </h3>
          <p style={{ color: "#666666" }}>
            Zero charges for equity & mutual fund investments. Flat ₹20 fees for
            intraday and F&O trades.
          </p>

          <h3 className="fs-5 mt-5 mb-4" style={{ color: "#424242" }}>
            Best investing experience
          </h3>
          <p style={{ color: "#666666" }}>
            Simple and intuitive trading platform with an easy-to-understand
            user interface.
          </p>

          <h3 className="fs-5 mt-5 mb-4" style={{ color: "#424242" }}>
            No spam or gimmicks
          </h3>
          <p style={{ color: "#666666" }}>
            Committed to transparency — no gimmicks, spam, "gamification", or
            intrusive push notifications.
          </p>

          <h3 className="fs-5 mt-5 mb-4" style={{ color: "#424242" }}>
            The MoneyDock universe
          </h3>
          <p style={{ color: "#666666" }}>
            More than just an app — gain free access to the entire ecosystem of
            our partner products.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Benefits;
