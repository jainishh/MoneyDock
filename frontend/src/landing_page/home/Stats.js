import React from "react";
import { Link } from "react-router-dom";

function Stats() {
  return (
    <div className="container">
      <div className="row p-4 align-item-center justify-content-center">
        <div className="col-12 col-md-6 py-5" style={{ fontSize: "1.1em" }}>
          <h2 className="mb-5" style={{ color: "#424242" }}>
            Trust with confidence
          </h2>

          <h3 className="fs-5" style={{ color: "#424242" }}>
            Customer-first always
          </h3>
          <p style={{ color: "#666666" }}>
            That's why 1.6+ crore customers trust MoneyDock with ~ ₹6 lakh
            crores of equity investments and contribute to 15% of daily retail
            exchange volumes in India.
          </p>

          <h3 className="fs-5 mt-5" style={{ color: "#424242" }}>
            No spam or gimmicks
          </h3>
          <p style={{ color: "#666666" }}>
            No gimmicks, spam, "gamification", or annoying push notifications.
            High quality apps that you use at your pace, the way you like.{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Our philosophies.
            </Link>
          </p>

          <h3 className="fs-5 mt-5" style={{ color: "#424242" }}>
            The MoneyDock universe
          </h3>
          <p style={{ color: "#666666" }}>
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>

          <h3 className="fs-5 mt-5" style={{ color: "#424242" }}>
            Do better with money
          </h3>
          <p style={{ color: "#666666" }}>
            With initiatives like{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Nudge
            </Link>{" "}
            and{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Kill Switch
            </Link>
            , we don't just facilitate transactions, but actively help you do
            better with your money.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <img
            src="media\images\ecosystem.png"
            className="img-fluid"
            style={{ width: "100%" }}
          />
          <div className="text-center">
            <a
              href="#"
              className="mx-3"
              style={{
                textDecoration: "none",
                color: "#387ed1",
                fontSize: "1.1em",
                fontWeight: "500",
              }}
            >
              Explore our products&nbsp;
              <i
                class="fa-solid fa-arrow-right-long"
                style={{ color: "#387ed1" }}
              ></i>
            </a>
            <a
              href="#"
              style={{
                textDecoration: "none",
                color: "#387ed1",
                fontSize: "1.1em",
                fontWeight: "500",
              }}
            >
              Try Kite demo&nbsp;
              <i
                class="fa-solid fa-arrow-right-long"
                style={{ color: "#387ed1" }}
              ></i>
            </a>
          </div>
        </div>
        <div className="text-center mt-4 mb-5">
          <img
            src="media/images/pressLogos.png"
            className="img-fluid"
            style={{ width: "60%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;
