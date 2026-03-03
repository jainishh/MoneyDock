import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Send } from "lucide-react";
import logo from "../../assets/logo/moneydocklogofinal.png";

const navColumns = [
  {
    heading: "Account",
    links: ["Referral program", "Minor demat account", "NRI demat account", "Commodity", "Dematerialisation", "Fund transfer", "MTF"],
  },
  {
    heading: "Support",
    links: ["Contact us", "How to file a complaint?", "Support portal", "Status of complaints", "Bulletin", "Circular", "Blog", "Downloads"],
  },
  {
    heading: "Company",
    links: ["About", "Philosophy", "Press & media", "Careers", "MoneyDock Cares (CSR)", "MoneyDock.tech", "Open source"],
  },
  {
    heading: "Quick links",
    links: ["Upcoming IPOs", "Brokerage charges", "Market holidays", "Economic calendar", "Calculators", "Markets", "Sectors"],
  },
];

const socials = [
  { Icon: Twitter },
  { Icon: Facebook },
  { Icon: Instagram },
  { Icon: Linkedin },
  { Icon: Youtube },
  { Icon: MessageCircle },
  { Icon: Send },
];

const bottomLinks = ["NSE", "BSE", "Terms & Conditions", "Policies & procedures", "Privacy policy", "Disclosure", "Investor charter"];

function Footer() {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-primary)] mt-10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:max-w-[1200px]">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-12 pb-8">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo / Brand */}
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="MoneyDock" className="h-auto w-48 object-contain" />
            </Link>

            <p className="text-[12.5px] leading-relaxed text-[var(--text-muted)] mb-5">
              © 2010 – 2025, MoneyDock Broking Ltd.<br />All rights reserved.
            </p>

            {/* Socials */}
            <div className="flex flex-wrap gap-3">
              {socials.map(({ Icon }, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[color:var(--accent-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/10 transition-all duration-150"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-0">
              <h5 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">{heading}</h5>
              {links.map(link => (
                <Link
                  key={link}
                  to="#"
                  className="text-[13px] text-[var(--text-muted)] mb-2.5 hover:text-[color:var(--accent-primary)] transition-colors block no-underline"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Legal section ── */}
        <div className="border-t border-[var(--border-primary)] py-8 space-y-3">
          {[
            <>MoneyDock Broking Ltd.: Member of NSE, BSE &amp; MCX – SEBI Registration no.: INZ000031633. CDSL/NSDL Depository services – SEBI Registration no.: IN-DP-431-2019. Commodity trading through MoneyDock Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238. Registered Address: #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru – 560078. For complaints: <Link to="#" className="text-[color:var(--accent-primary)] hover:underline no-underline">complaints@moneydock.com</Link>, for DP: <Link to="#" className="text-[color:var(--accent-primary)] hover:underline no-underline">dp@moneydock.com</Link>. Please read the Risk Disclosure Document as prescribed by SEBI.</>,
            <>To file a complaint on <Link to="#" className="text-[color:var(--accent-primary)] hover:underline no-underline">SEBI SCORES</Link>: Register on SCORES portal. Mandatory details: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective communication, speedy grievance redressal.</>,
            "Investments in securities market are subject to market risks; read all related documents carefully before investing.",
            <>Prevent unauthorised transactions — update your mobile/email with your broker. Receive transaction info from Exchange on your mobile/email at end of day. KYC is a one-time exercise across all SEBI registered intermediaries. As a business, we don't give stock tips and haven't authorised anyone to trade on behalf of others. If you find anyone claiming to be part of MoneyDock offering such services, please <Link to="#" className="text-[color:var(--accent-primary)] hover:underline no-underline">create a ticket here</Link>.</>,
          ].map((text, i) => (
            <p key={i} className="text-[var(--text-muted)] text-[11.5px] leading-relaxed">
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:max-w-[1200px] py-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {bottomLinks.map(link => (
            <Link
              key={link}
              to="#"
              className="text-[var(--text-muted)] text-[12px] font-medium hover:text-[color:var(--accent-primary)] transition-colors no-underline"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;