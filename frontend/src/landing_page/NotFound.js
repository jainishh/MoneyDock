import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container">
      <div className="row p-5">
        <div className="col-12 mt-4">
          <h4>404</h4>
          <h1 className="mt-3">
            We couldn’t find
            <br></br>that page
          </h1>
          <h5 className="text-muted">
            We couldn’t find the page you were looking <br></br>for. Visit{" "}
            <Link style={{ textDecoration: "none", color: "#387ed1" }} to="/">
              MoneyDock’s home page
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
