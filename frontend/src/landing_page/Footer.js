import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="container mt-5 border-top">
        <div className="row p-4">
          <div className="col-12 col-md-3 py-5 text-muted">
            <img
              src="media/images/logoone.png"
              alt="Logo"
              style={{ width: "50%" }}
            />
            <br />
            <br />
            &copy; 2010 - 2025, MoneyDock Broking Ltd <br />
            All rights reserved.
            <br />
            <span className="footer-link">
              <i className="fa-brands fa-x-twitter"></i> &nbsp; &nbsp;&nbsp;
              <i className="fa-brands fa-square-facebook"></i> &nbsp;
              &nbsp;&nbsp;
              <i className="fa-brands fa-instagram"></i> &nbsp; &nbsp;&nbsp;
              <i className="fa-brands fa-linkedin"></i> &nbsp; &nbsp;&nbsp;
              <br />
              <i className="fa-brands fa-youtube"></i>&nbsp; &nbsp;&nbsp;
              <i className="fa-brands fa-whatsapp"></i>&nbsp; &nbsp;&nbsp;
              <i className="fa-brands fa-telegram"></i>&nbsp; &nbsp;&nbsp;
            </span>
          </div>
          <div className="link col-12 col-md-2 py-5">
            <h5 style={{ color: "#424242" }}>Account</h5>
            <a href="#">Referral program</a>
            <br></br>
            <a href="#">Minor demat account</a>
            <br></br>
            <a href="#">NRI demat account</a>
            <br></br>
            <a href="#">Commodity</a>
            <br></br>
            <a href="#">Dematerialisation</a>
            <br></br>
            <a href="#">Fund transfer</a>
            <br></br>
            <a href="#">MTF</a>
            <br></br>
            <a href="#">Referral program</a>
            <br></br>
          </div>
          <div className="link col-12 col-md-2 py-5">
            <h5 style={{ color: "#424242" }}>Support</h5>
            <a href="#">Contact us</a>
            <br></br>
            <a href="#">How to file a complaint?</a>
            <br></br>
            <a href="#">Support portal</a>
            <br></br>
            <a href="#">Status of your complaints</a>
            <br></br>
            <a href="#">Bulletin</a>
            <br></br>
            <a href="#">Circular</a>
            <br></br>
            <a href="#">Z-Connect blog</a>
            <br></br>
            <a href="#">Downloads</a>
            <br></br>
          </div>
          <div className="link col-12 col-md-2 py-5">
            <h5 style={{ color: "#424242" }}>Company</h5>
            <a href="#">About</a>
            <br></br>
            <a href="#">Philosophy</a>
            <br></br>
            <a href="#">Press & media</a>
            <br></br>
            <a href="#">Careers</a>
            <br></br>
            <a href="#">MoneyDock Cares (CSR)</a>
            <br></br>
            <a href="#">MoneyDock.tech</a>
            <br></br>
            <a href="#">Open source</a>
            <br></br>
          </div>
          <div className="link col-12 col-md-2 py-5">
            <h5 style={{ color: "#424242" }}>Quick links</h5>
            <a href="#">Upcoming IPOs</a>
            <br></br>
            <a href="#">Brokerage charges</a>
            <br></br>
            <a href="#">Market holidays</a>
            <br></br>
            <a href="#">Economic calendar</a>
            <br></br>
            <a href="#">Calculators</a>
            <br></br>
            <a href="#">Markets</a>
            <br></br>
            <a href="#">Sectors</a>
            <br></br>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <p className="footer-para">
              MoneyDock Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI
              Registration no.: INZ000031633 CDSL/NSDL: Depository services
              through MoneyDock Broking Ltd. – SEBI Registration no.:
              IN-DP-431-2019 Commodity Trading through MoneyDock Commodities
              Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.:
              INZ000038238 Registered Address: MoneyDock Broking Ltd., #153/154,
              4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar
              4th Phase, Bengaluru - 560078, Karnataka, India. For any
              complaints pertaining to securities broking please write to{" "}
              <Link
                to={"#"}
                style={{ textDecoration: "none", color: "#387ED1" }}
              >
                complaints@MoneyDock.com
              </Link>
              , for DP related to{" "}
              <Link
                to={"#"}
                style={{ textDecoration: "none", color: "#387ED1" }}
              >
                dp@MoneyDock.com
              </Link>
              . Please ensure you carefully read the Risk Disclosure Document as
              prescribed by SEBI | ICF
            </p>
            <p className="footer-para">
              Procedure to file a complaint on{" "}
              <Link
                to={"#"}
                style={{ textDecoration: "none", color: "#387ED1" }}
              >
                SEBI SCORES
              </Link>
              : Register on SCORES portal. Mandatory details for filing
              complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail
              ID. Benefits: Effective Communication, Speedy redressal of the
              grievances
            </p>
            <p className="footer-para">
              Investments in securities market are subject to market risks; read
              all the related documents carefully before investing.
            </p>
            <p className="footer-para">
              Attention investors: 1) Stock brokers can accept securities as
              margins from clients only by way of pledge in the depository
              system w.e.f September 01, 2020. 2) Update your e-mail and phone
              number with your stock broker / depository participant and receive
              OTP directly from depository on your e-mail and/or mobile number
              to create pledge. 3) Check your securities / MF / bonds in the
              consolidated account statement issued by NSDL/CDSL every month.
            </p>
            <p className="footer-para">
              "Prevent unauthorised transactions in your account. Update your
              mobile numbers/email IDs with your stock brokers. Receive
              information of your transactions directly from Exchange on your
              mobile/email at the end of the day. Issued in the interest of
              investors. KYC is one time exercise while dealing in securities
              markets - once KYC is done through a SEBI registered intermediary
              (broker, DP, Mutual Fund etc.), you need not undergo the same
              process again when you approach another intermediary." Dear
              Investor, if you are subscribing to an IPO, there is no need to
              issue a cheque. Please write the Bank account number and sign the
              IPO application form to authorize your bank to make payment in
              case of allotment. In case of non allotment the funds will remain
              in your bank account. As a business we don't give stock tips, and
              have not authorized anyone to trade on behalf of others. If you
              find anyone claiming to be part of MoneyDock and offering such
              services, please{" "}
              <Link
                to={"#"}
                style={{ textDecoration: "none", color: "#387ED1" }}
              >
                create a ticket here.
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center footer-bottum-link mb-2">
        <a href="">NSE</a>
        <a href="">BSE</a>
        <a href="">Terms & Conditions</a>
        <a href="">Policies & procedures </a>
        <a href="">Privacy policy </a>
        <a href="">Disclosure </a>
        <a href="">For investor's attention </a>
        <a href="">Investor charter</a>
      </div>
    </footer>
  );
}

export default Footer;
