import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <div className="container">
      <div className="row py-5">
        <h1
          className=" main-heading text-center mt-5"
          style={{ fontSize: "2em", color: "#424242" }}
        >
          We pioneered the discount broking model in India.
          <br></br>
          Now, we are breaking ground with our technology.
        </h1>
      </div>

      <div
        className="row border-top p-5 mt-5 text-muted d-flex justify-content-around"
        style={{ lineHeight: "1.8", fontSize: "1.1em" }}
      >
        <div className="col-12 col-md-6 hero-para">
          <p>
            We kick-started operations on the 15th of August, 2010 with the goal
            of breaking all barriers that traders and investors face in India in
            terms of cost, support, and technology. We named the company
            MoneyDock, a combination of Money and "Dock", the Sanskrit word for
            barrier.
          </p>
          <p>
            Today, our disruptive pricing models and in-house technology have
            made us the biggest stock broker in India
          </p>
          <p>
            Over 1.6+ crore clients place billions of orders every year through
            our powerful ecosystem of investment platforms, contributing over
            15% of all Indian retail trading volumes
          </p>
        </div>
        <div className="col-12 col-md-6 hero-para">
          <p>
            In addition, we run a number of popular open online educational and
            community initiatives to empower retail traders and investors.
          </p>
          <p>
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Rainmatter
            </Link>
            ,our fintech fund and incubator, has invested in several fintech
            startups with the goal of growing the Indian capital markets.
          </p>
          <p>
            And yet, we are always up to something new every day. Catch up on
            the latest updates on our{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              blog
            </Link>{" "}
            or see what the media is saying about us or learn more about our
            business and product{" "}
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              philoshopies
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
