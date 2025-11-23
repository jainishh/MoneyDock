import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Brokerage.css";

function Brokerage() {
  const ChargesTables = () => {
    const accountOpening = [
      { type: "Online account", charges: "FREE" },
      { type: "Offline account", charges: "FREE" },
      { type: "NRI account (offline only)", charges: "₹ 500" },
      {
        type: "Partnership, LLP, HUF, or Corporate accounts (offline only)",
        charges: "₹ 500",
      },
    ];

    const dematAMC = [
      { value: "Up to ₹4 lakh", charges: "FREE" },
      {
        value: "₹4 lakh - ₹10 lakh",
        charges: "₹ 100 per year, charged quarterly*",
      },
      { value: "Above ₹10 lakh", charges: "₹ 300 per year, charged quarterly" },
    ];

    const optionalServices = [
      {
        service: "Tickertape",
        frequency: "Monthly / Annual",
        charges: "Free: 0 | Pro: 249/2399",
      },
      {
        service: "Smallcase",
        frequency: "Per transaction",
        charges: "Buy & Invest More: 100 | SIP: 10",
      },
      {
        service: "Kite Connect",
        frequency: "Monthly",
        charges: "Connect: 500 | Historical: 500",
      },
    ];

    const badgeStyle = {
      backgroundColor: "#28a745",
      color: "white",
      padding: "3px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: "0.85rem",
    };

    return (
      <div className="containerm p-4">
        {/* Table 1 */}
        <h4 className="mb-3 tablename">Charges for account opening</h4>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Type of account</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            {accountOpening.map((row, idx) => (
              <tr key={idx}>
                <td>{row.type}</td>
                <td>
                  {row.charges === "FREE" ? (
                    <span style={badgeStyle}>{row.charges}</span>
                  ) : (
                    row.charges
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table 2 */}
        <h4 className="mt-5 mb-3 tablename">
          Demat AMC (Annual Maintenance Charge)
        </h4>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Value of holdings</th>
              <th>AMC</th>
            </tr>
          </thead>
          <tbody>
            {dematAMC.map((row, idx) => (
              <tr key={idx}>
                <td>{row.value}</td>
                <td>
                  {row.charges === "FREE" ? (
                    <span style={badgeStyle}>{row.charges}</span>
                  ) : (
                    row.charges
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          * Lower AMC is applicable only if the account qualifies as a Basic
          Services Demat Account (BSDA). BSDA account holders cannot hold more
          than one demat account. To learn more about BSDA,{" "}
          <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
            click here
          </Link>
          .
        </p>

        {/* Table 3 */}
        <h4 className="mt-5 mb-3 tablename">
          Charges for optional value added services
        </h4>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Service</th>
              <th>Billing Frequency</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            {optionalServices.map((row, idx) => (
              <tr key={idx}>
                <td>{row.service}</td>
                <td>{row.frequency}</td>
                <td>{row.charges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row p-4">
        <div className="text-center" style={{ marginBottom: "50px" }}>
          <p style={{ fontSize: "1.35rem", color: "#424242", fontWeight: 400 }}>
            <Link to={"#"} style={{ textDecoration: "none", color: "#387ED1" }}>
              Calculate your costs upfront
            </Link>{" "}
            using our brokerage calculator
          </p>
        </div>
      </div>

      {/* Call the ChargesTables component here */}
      <ChargesTables />

      <div className="row p-4">
        <h2 style={{ color: "#424242", fontSize: "1.5rem" }}>
          Charges explained
        </h2>
        <div className="col-12 col-md-6 mt-4">
          <p className="heading ">Securities/Commodities transaction tax</p>
          <p className="pera">
            Tax by the government when transacting on the exchanges. Charged as
            above on both buy and sell sides when trading equity delivery.
            Charged only on selling side when trading intraday or on F&O.
            <br></br>
            <br></br>
            When trading at MoneyDock, STT/CTT can be a lot more than the
            brokerage we charge. Important to keep a tab.
          </p>

          <p className="heading">Transaction/Turnover Charges</p>
          <p className="pera">
            Charged by exchanges (NSE, BSE, MCX) on the value of your
            transactions.
            <br></br>
            <br></br>
            BSE has revised transaction charges in XC, XD, XT, Z and ZP groups
            to ₹10,000 per crore w.e.f 01.01.2016. (XC and XD groups have been
            merged into a new group X w.e.f 01.12.2017)
            <br></br>
            <br></br>
            BSE has revised transaction charges in SS and ST groups to ₹1,00,000
            per crore of gross turnover.
            <br></br>
            <br></br>
            BSE has revised transaction charges for group A, B and other non
            exclusive scrips (non-exclusive scrips from group E, F, FC, G, GC,
            W, T) at ₹375 per crore of turnover on flat rate basis w.e.f.
            December 1, 2022.
            <br></br>
            <br></br>
            BSE has revised transaction charges in M, MT, TS and MS groups to
            ₹275 per crore of gross turnover.
          </p>

          <p className="heading">Call & trade</p>
          <p className="pera">
            Additional charges of ₹50 per order for orders placed through a
            dealer at MoneyDock including auto square off orders.
          </p>

          <p className="heading">Stamp charges</p>
          <p className="pera">
            Stamp charges by the Government of India as per the Indian Stamp Act
            of 1899 for transacting in instruments on the stock exchanges and
            depositories.
          </p>

          <p className="heading">NRI brokerage charges</p>
          <ul className="pera">
            <li className="pera">₹100 per order for futures and options.</li>
            <li className="pera">
              For a non-PIS account, 0.5% or ₹100 per executed order for equity
              (whichever is lower).
            </li>
            <li className="pera">
              For a PIS account, 0.5% or ₹200 per executed order for equity
              (whichever is lower).
            </li>
            <li className="pera">
              ₹500 + GST as yearly account maintenance charges (AMC) charges.
            </li>
          </ul>

          <p className="heading">Account with debit balance</p>
          <p className="pera">
            If the account is in debit balance, any order placed will be charged
            ₹40 per executed order instead of ₹20 per executed order.
          </p>

          <p className="heading">
            Charges for Investor's Protection Fund Trust (IPFT) by NSE
          </p>
          <ul className="pera">
            <li className="pera">
              Equity and Futures - ₹10 per crore + GST of the traded value.
            </li>
            <li className="pera">
              Options - ₹50 per crore + GST traded value (premium value).
            </li>
            <li className="pera">
              Currency - ₹0.05 per lakh + GST of turnover for Futures and ₹2 per
              lakh + GST of premium for Options.
            </li>
          </ul>

          <p className="heading">Margin Trading Facility (MTF)</p>
          <ul>
            <li className="pera">
              MTF Interest: 0.04% per day (₹40 per lakh) on the funded amount.
              The interest is applied from T+1 day until the day MTF stocks are
              sold.
            </li>
            <li className="pera">
              MTF Brokerage: 0.3% or Rs. 20/executed order, whichever is lower.
            </li>
            <li className="pera">
              MTF pledge charge: ₹15 + GST per pledge and unpledge request per
              ISIN.
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-6 text-muted mt-4">
          <p className="heading ">Securities/Commodities transaction tax</p>
          <p className="pera">
            Tax by the government when transacting on the exchanges. Charged as
            above on both buy and sell sides when trading equity delivery.
            Charged only on selling side when trading intraday or on F&O.
            <br></br>
            <br></br>
            When trading at MoneyDock, STT/CTT can be a lot more than the
            brokerage we charge. Important to keep a tab.
          </p>

          <p className="heading">Transaction/Turnover Charges</p>
          <p className="pera">
            Charged by exchanges (NSE, BSE, MCX) on the value of your
            transactions.
            <br></br>
            <br></br>
            BSE has revised transaction charges in XC, XD, XT, Z and ZP groups
            to ₹10,000 per crore w.e.f 01.01.2016. (XC and XD groups have been
            merged into a new group X w.e.f 01.12.2017)
            <br></br>
            <br></br>
            BSE has revised transaction charges in SS and ST groups to ₹1,00,000
            per crore of gross turnover.
            <br></br>
            <br></br>
            BSE has revised transaction charges for group A, B and other non
            exclusive scrips (non-exclusive scrips from group E, F, FC, G, GC,
            W, T) at ₹375 per crore of turnover on flat rate basis w.e.f.
            December 1, 2022.
            <br></br>
            <br></br>
            BSE has revised transaction charges in M, MT, TS and MS groups to
            ₹275 per crore of gross turnover.
          </p>

          <p className="heading">Call & trade</p>
          <p className="pera">
            Additional charges of ₹50 per order for orders placed through a
            dealer at MoneyDock including auto square off orders.
          </p>

          <p className="heading">Stamp charges</p>
          <p className="pera">
            Stamp charges by the Government of India as per the Indian Stamp Act
            of 1899 for transacting in instruments on the stock exchanges and
            depositories.
          </p>

          <p className="heading">NRI brokerage charges</p>
          <ul className="pera">
            <li className="pera">₹100 per order for futures and options.</li>
            <li className="pera">
              For a non-PIS account, 0.5% or ₹100 per executed order for equity
              (whichever is lower).
            </li>
            <li className="pera">
              For a PIS account, 0.5% or ₹200 per executed order for equity
              (whichever is lower).
            </li>
            <li className="pera">
              ₹500 + GST as yearly account maintenance charges (AMC) charges.
            </li>
          </ul>

          <p className="heading">Account with debit balance</p>
          <p className="pera">
            If the account is in debit balance, any order placed will be charged
            ₹40 per executed order instead of ₹20 per executed order.
          </p>

          <p className="heading">
            Charges for Investor's Protection Fund Trust (IPFT) by NSE
          </p>
          <ul className="pera">
            <li className="pera">
              Equity and Futures - ₹10 per crore + GST of the traded value.
            </li>
            <li className="pera">
              Options - ₹50 per crore + GST traded value (premium value).
            </li>
            <li className="pera">
              Currency - ₹0.05 per lakh + GST of turnover for Futures and ₹2 per
              lakh + GST of premium for Options.
            </li>
          </ul>

          <p className="heading">Margin Trading Facility (MTF)</p>
          <ul>
            <li className="pera">
              MTF Interest: 0.04% per day (₹40 per lakh) on the funded amount.
              The interest is applied from T+1 day until the day MTF stocks are
              sold.
            </li>
            <li className="pera">
              MTF Brokerage: 0.3% or Rs. 20/executed order, whichever is lower.
            </li>
            <li className="pera">
              MTF pledge charge: ₹15 + GST per pledge and unpledge request per
              ISIN.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Brokerage;
