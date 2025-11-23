import React from "react";
import "./Team.css";
import { Link } from "react-router-dom";
import TeamMember from "./TeamMember";

function Team() {
  return (
    <div className="container ">
      <div className="row py-5">
        <h2 className="text-center heading-people">People</h2>
      </div>

      <div className="row align-items-center">
        <div className="col-12 col-md-6 ceo-image-div">
          <img
            src="./media/images/nithin-kamath.jpg"
            className="ceo-image img-fluid"
            alt="CEO"
          />
          <div className="mt-3">
            <h4
              className="mb-3"
              style={{
                fontSize: "1.25rem",
                fontWeight: "400",
                color: "#424242",
              }}
            >
              Nithin Kamath
            </h4>
            <p
              style={{
                color: "#666666",
                fontWeight: "440",
              }}
            >
              Founder, CEO
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6 ceo-pera-div text-center text-md-start">
          <p className="ceo-pera">
            Nithin bootstrapped and founded MoneyDock in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            MoneyDock has changed the landscape of the Indian broking industry.
          </p>
          <p className="ceo-pera">
            He is a member of the SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p className="ceo-pera">Playing basketball is his zen.</p>
          <p className="ceo-pera">
            Connect on{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Homepage
            </Link>{" "}
            /{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              TradingQnA
            </Link>{" "}
            /{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Twitter
            </Link>
          </p>
        </div>
      </div>
      <TeamMember className="teamMembers" />
    </div>
  );
}

export default Team;
