import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(-1);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const handleManuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menuContainer">
      <Link to={"/"} onClick={() => handleManuClick(-1)}>
        <img src="media/kite-logo.svg" className="kitelogo"></img>
      </Link>

      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to={"/"}
              onClick={() => handleManuClick(0)}
            >
              <p className={selectedMenu === 0 ? "activeManu" : "links"}>
                Dashboard
              </p>
            </Link>
          </li>
          <li className="hideOnMobile">
            <Link
              style={{ textDecoration: "none" }}
              to={"/orders"}
              onClick={() => handleManuClick(1)}
            >
              <p className={selectedMenu === 1 ? "activeManu" : "links"}>
                Orders
              </p>
            </Link>
          </li>
          <li className="hideOnMobile">
            <Link
              style={{ textDecoration: "none" }}
              to={"/holdings"}
              onClick={() => handleManuClick(2)}
            >
              <p className={selectedMenu === 2 ? "activeManu" : "links"}>
                Holdings
              </p>
            </Link>
          </li>
          <li className="hideOnMobile">
            <Link
              style={{ textDecoration: "none" }}
              to={"/positions"}
              onClick={() => handleManuClick(3)}
            >
              <p className={selectedMenu === 3 ? "activeManu" : "links"}>
                Positions
              </p>
            </Link>
          </li>
        </ul>
      </div>

      <div className="profileWrapper" ref={dropdownRef}>
        <button className="profile" onClick={handleProfileClick}>
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </button>

        {isProfileDropdownOpen && (
          <div className="dropdown">
            {viewportWidth <= 1117 && (
              <Link
                to="/watchlist"
                className="dropdownItem"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                WatchList
              </Link>
            )}

            {viewportWidth <= 562 && (
              <Link
                to="/orders"
                className="dropdownItem"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Orders
              </Link>
            )}

            {viewportWidth <= 562 && (
              <Link
                to="/holdings"
                className="dropdownItem"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Holdings
              </Link>
            )}

            {viewportWidth <= 562 && (
              <Link
                to="/positions"
                className="dropdownItem"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Positions
              </Link>
            )}
            <Link to="/" className="dropdownItem">
              My Profile
            </Link>
            <Link to="/" className="dropdownItem">
              Settings
            </Link>
            <button
              className="dropdownItem"
              onClick={() => {
                localStorage.clear();
                window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
