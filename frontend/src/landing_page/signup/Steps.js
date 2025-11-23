import React from "react";
import "./Steps.css";

function Steps() {
  const steps = [
    { number: "01", text: "Enter the requested details" },
    { number: "02", text: "Complete e-sign & verification" },
    { number: "03", text: "Start investing!" },
  ];

  return (
    <div className="container py-5 mt-5">
      <h2
        className="text-center mb-5"
        style={{ color: "#424242", fontSize: "1.6rem", fontWeight: "500" }}
      >
        Steps to open a demat account with MoneyDock
      </h2>

      <div className="row align-items-center justify-content-center">
        {/* Left side image */}
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
          <img
            src="media\images\steps.svg"
            alt="Steps Illustration"
            className="img-fluid"
            style={{ Width: "373px", height: "207px" }}
          />
        </div>

        {/* Right side steps */}
        <div className="number col-12 col-md-5">
          {steps.map((step, index) => (
            <div key={index} className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle border border-secondary d-flex justify-content-center align-items-center me-3"
                style={{
                  width: "30px",
                  height: "30px",
                  fontWeight: "600",
                  color: "#666",
                }}
              >
                {step.number}
              </div>
              <div>
                <p
                  className="mb-0"
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#424242",
                  }}
                >
                  {step.text}
                </p>
              </div>
              <hr></hr>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Steps;
