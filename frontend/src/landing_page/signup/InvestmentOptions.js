import React from "react";
import "./InvestmentOptions.css";
import { useNavigate } from "react-router-dom";

function InvestmentOptions() {
  const navigate = useNavigate();
  const options = [
    {
      title: "Stocks",
      desc: "Invest in all exchange-listed securities",
      img: "media/images/investoptions1.svg",
    },
    {
      title: "Mutual funds",
      desc: "Invest in commission-free direct mutual funds",
      img: "media/images/investoptions2.svg",
    },
    {
      title: "IPO",
      desc: "Apply to the latest IPOs instantly via UPI",
      img: "media/images/investoptions3.svg",
    },
    {
      title: "Futures & options",
      desc: "Hedge and mitigate market risk through simplified F&O trading",
      img: "media/images/investoptions4.svg",
    },
  ];
  return (
    <div className="container text-center py-5 ">
      {/* Section Heading */}
      <h2
        className="mb-5"
        style={{ color: "#424242", fontSize: "1.6rem", fontWeight: "500" }}
      >
        Investment options with MoneyDock demat account
      </h2>

      {/* Two-column layout */}
      <div className="row justify-content-center text-start">
        {options.map((opt, index) => (
          <div
            key={index}
            className="col-12 col-md-5 d-flex align-items-start mb-4"
            style={{ minHeight: "100px" }}
          >
            <img
              src={opt.img}
              alt={opt.title}
              className="me-3"
              style={{ width: "112px", height: "94.6px", objectFit: "contain" }}
            />
            <div>
              <h3
                className="fw-semibold mb-1"
                style={{ color: "#424242", fontSize: "1.25rem" }}
              >
                {opt.title}
              </h3>
              <p
                className="mb-0"
                style={{ color: "#666666", fontSize: "1rem" }}
              >
                {opt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          className="btn btn-primary fs-5 px-4 py-2 "
          style={{ backgroundColor: "#387ed1", fontWeight: "500" }}
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/signup");
          }}
        >
          Explore Investments
        </button>
      </div>
    </div>
  );
}

export default InvestmentOptions;
