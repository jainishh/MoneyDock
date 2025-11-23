import React from "react";

function Awards() {
  return (
    <div className="container py-5 mt-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-6 mb-4 mb-md-0 text-center">
          <img
            src="media/images/largestBroker.svg"
            className="img-fluid"
            alt="Largest Broker in India"
          />
        </div>

        <div className="col-12 col-md-6 text-center text-md-start py-5">
          <h2 className="mb-4" style={{ color: "#424242" }}>
            Largest stock broker in India
          </h2>
          <p className="mb-4" style={{ fontSize: "1.1em", color: "#424242" }}>
            2+ million MoneyDock clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>
          <div
            className="row mb-5"
            style={{ fontSize: "1.1em", color: "#424242" }}
          >
            <div className="col-6">
              <ul>
                <li>
                  <p>Future of Options</p>
                </li>
                <li>
                  <p>Commodity derivatives</p>
                </li>
                <li>
                  <p>Currency derivatives</p>
                </li>
              </ul>
            </div>
            <div className="col-6">
              <ul>
                <li>
                  <p>Stocks & IPOs</p>
                </li>
                <li>
                  <p>Direct mutual funds</p>
                </li>
                <li>
                  <p>Bonds and Govt. Securities</p>
                </li>
              </ul>
            </div>
          </div>
          <img
            src="media/images/pressLogos.png"
            style={{ width: "91%" }}
            className="img-fluid"
            alt="Press Coverage"
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;
