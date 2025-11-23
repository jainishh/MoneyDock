import React, { useState, useRef, useEffect } from "react";
import "./MainContent.css";

// Accordion Item Component with animation
function AccordionItem({ icon, title, children, expanded, onClick }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded, children]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e3e6e8",
        borderRadius: "6px",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 24px",
          cursor: "pointer",
          transition: "background 0.2s, font-size 0.2s, padding 0.2s",
          background: expanded ? "#f8f8f8" : "#fff",
          fontSize: "1.2rem",
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8f8f8";
          e.currentTarget.style.fontSize = "1.35rem";
          e.currentTarget.style.padding = "22px 28px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = expanded ? "#f8f8f8" : "#fff";
          e.currentTarget.style.fontSize = "1.2rem";
          e.currentTarget.style.padding = "18px 24px";
        }}
      >
        <span
          style={{ color: "#387ed1", fontSize: "1.5rem", marginRight: "16px" }}
        >
          <i className={`fa ${icon}`}></i>
        </span>
        <span style={{ fontWeight: 500, color: "#424242" }}>{title}</span>
        <span style={{ marginLeft: "auto", color: "#387ed1" }}>
          <i className={`fa fa-chevron-${expanded ? "up" : "down"}`}></i>
        </span>
      </div>
      <div
        ref={contentRef}
        style={{
          height: expanded ? `${height}px` : "0px",
          opacity: expanded ? 1 : 0,
          transition: "height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s",
          overflow: "hidden",
          borderTop: expanded ? "1px solid #e3e6e8" : "none",
          padding: expanded ? "18px 32px" : "0 32px",
          background: "#fff",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Main Content Component
function MainContent() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="support-main">
      <div
        className="container"
        style={{ marginTop: "32px", display: "flex", gap: "32px" }}
      >
        {/* Left: Accordion */}
        <div style={{ flex: 2 }}>
          <AccordionItem
            icon="fa-plus-circle"
            title="Account Opening"
            expanded={openIndex === 0}
            onClick={() => setOpenIndex(openIndex === 0 ? -1 : 0)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Resident individual
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Minor
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Non Resident Indian (NRI)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Company, Partnership, HUF and LLP
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Glossary
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            icon="fa-user-circle"
            title="Your MoneyDock Account"
            expanded={openIndex === 1}
            onClick={() => setOpenIndex(openIndex === 1 ? -1 : 1)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Your Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Account modification
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Client Master Report (CMR) and Depository Participant (DP)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Nomination
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Transfer and conversion of securities
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            icon="fa-globe"
            title="Kite"
            expanded={openIndex === 2}
            onClick={() => setOpenIndex(openIndex === 2 ? -1 : 2)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  IPO
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Trading FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Margin Trading Facility (MTF) and Margins
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Charts and orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Alerts and Nudges
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  General
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            icon="fa-rupee-sign"
            title="Funds"
            expanded={openIndex === 3}
            onClick={() => setOpenIndex(openIndex === 3 ? -1 : 3)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Add money
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Withdraw money
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Add bank accounts
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  eMandates
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            icon="fa-at"
            title="Console"
            expanded={openIndex === 4}
            onClick={() => setOpenIndex(openIndex === 4 ? -1 : 4)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Corporate actions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Funds statement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Segments
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            icon="fa-coins"
            title="Coin"
            expanded={openIndex === 5}
            onClick={() => setOpenIndex(openIndex === 5 ? -1 : 5)}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Mutual funds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  National Pension Scheme (NPS)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Fixed Deposit (FD)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Features on Coin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Payments and Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  General
                </a>
              </li>
            </ul>
          </AccordionItem>
        </div>
        {/* Right: News and Quick Links */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#fff7e6",
              borderRadius: "6px",
              padding: "18px 24px",
              marginBottom: "16px",
              borderLeft: "6px solid #ffa726",
            }}
          >
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#387ed1",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Exclusion of F&O contracts on 8 securities from August 29,
                  2025
                </a>
              </li>
              <li style={{ marginTop: "10px" }}>
                <a
                  href="#"
                  style={{ color: "#387ed1", textDecoration: "none" }}
                >
                  Revision in expiry day of Index and Stock derivatives
                  contracts
                </a>
              </li>
            </ul>
          </div>
          <div
            style={{
              background: "#f8f8f8",
              border: "1px solid #e3e6e8",
              borderRadius: "6px",
              padding: 0,
              overflow: "hidden",
              maxWidth: "470px", // Fix width to match image
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                padding: "10px 20px",
                background: "#f8f8f8",
                borderBottom: "1px solid #e3e6e8",
              }}
            >
              Quick links
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <tbody>
                <tr style={{ borderBottom: "1px solid #e3e6e8" }}>
                  <td style={{ padding: "10px", fontSize: "1rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "#387ed1",
                        textDecoration: "none",
                        fontWeight: 400,
                      }}
                    >
                      1. Track account opening
                    </a>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e3e6e8" }}>
                  <td style={{ padding: "10px", fontSize: "1rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "#387ed1",
                        textDecoration: "none",
                        fontWeight: 400,
                      }}
                    >
                      2. Track segment activation
                    </a>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e3e6e8" }}>
                  <td style={{ padding: "10px", fontSize: "1rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "#387ed1",
                        textDecoration: "none",
                        fontWeight: 400,
                      }}
                    >
                      3. Intraday margins
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontSize: "1rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "#387ed1",
                        textDecoration: "none",
                        fontWeight: 400,
                      }}
                    >
                      4. Kite user manual
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
