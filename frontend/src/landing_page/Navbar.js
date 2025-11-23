import React from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  // Function to close navbar after click
  const closeNavbar = () => {
    const navbar = document.getElementById("navbarSupportedContent");
    if (navbar && navbar.classList.contains("show")) {
      // Bootstrap collapse class
      const collapse = window.bootstrap.Collapse.getInstance(navbar);
      collapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom fixed-top">
      <div className="container p-1">
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/logoone.png"
            alt="logo"
            style={{ width: "120px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav text-center gap-2">
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/signup"
                onClick={closeNavbar}
                style={{ fontWeight: "500", color: "#666666" }}
              >
                Signup
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/about"
                onClick={closeNavbar}
                style={{ fontWeight: "500", color: "#666666" }}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/products"
                onClick={closeNavbar}
                style={{ fontWeight: "500", color: "#666666" }}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/pricing"
                onClick={closeNavbar}
                style={{ fontWeight: "500", color: "#666666" }}
              >
                Pricing
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/support"
                onClick={closeNavbar}
                style={{ fontWeight: "500", color: "#666666" }}
              >
                Support
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
