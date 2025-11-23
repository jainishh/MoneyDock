import React, { useState, useRef, useEffect } from "react";
import "./FAQs.css";

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

function FAQs() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="support-main mb-5">
      <div
        className="container"
        style={{ marginTop: "32px", display: "flex", gap: "32px" }}
      >
        {/* Left: Accordion */}
        <div style={{ flex: 2 }}>
          <h2
            className="mb-5"
            style={{ color: "#424242", fontSize: "1.6rem", fontWeight: "500" }}
          >
            FAQs
          </h2>
          <AccordionItem
            title="What is a MoneyDock account?"
            expanded={openIndex === 0}
            onClick={() => setOpenIndex(openIndex === 0 ? -1 : 0)}
          >
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              A MoneyDock account is a combined demat and trading account that
              allows investors to buy, sell, and hold securities digitally.
            </p>
          </AccordionItem>
          <AccordionItem
            title="What documents are required to open a demat account?"
            expanded={openIndex === 1}
            onClick={() => setOpenIndex(openIndex === 1 ? -1 : 1)}
          >
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              The following documents are required to open a MoneyDock account
              online:
            </p>
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                color: "#666666",
                listStyleType: "disc",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{
                    color: "#666666",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  PAN number
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "#666666",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Aadhaar Card (Linked with a phone number for OTP verification)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "#666666",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Cancelled cheque or bank account statement (To link your bank
                  account)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "#666666",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Income proof (Required only if you wish to trade in Futures &
                  options)
                </a>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem
            title="Is MoneyDock account opening free?"
            expanded={openIndex === 2}
            onClick={() => setOpenIndex(openIndex === 2 ? -1 : 2)}
          >
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              Yes, It is completely free.
            </p>
          </AccordionItem>
          <AccordionItem
            title="Are there any maintenance charges for a demat account?"
            expanded={openIndex === 3}
            onClick={() => setOpenIndex(openIndex === 3 ? -1 : 3)}
          >
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              The account maintaince charges is appliacable based on the account
              type.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              For Basic Services Demat Account: Zero charges if the holding
              value is less than ₹4,00,000.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              For non-Basic Services Demat Account demat accounts: ₹300 per year
              + GST.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              To learn more about BSDA, Click here.
            </p>
          </AccordionItem>
          <AccordionItem
            title="Can I open a demat account without a bank account?"
            expanded={openIndex === 4}
            onClick={() => setOpenIndex(openIndex === 4 ? -1 : 4)}
          >
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              To open a demat account, you must have a bank account in your
              name.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#666666" }}>
              If UPI verification is completed successfully, no proof of bank is
              needed. However, if bank verification fails, you'll need to
              provide either a cancelled cheque or a bank statement to link your
              bank account to MoneyDock.
            </p>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}

export default FAQs;
