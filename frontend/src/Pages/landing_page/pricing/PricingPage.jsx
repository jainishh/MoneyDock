import React from 'react';
import Hero from './Hero';
import Brokerage from './Brokerage';
import AccountOpeningRow from './AccountOpeningRow';
import ChargesExplanatory from './ChargesExplanatory';

const PricingPage = () => {
    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-10 pb-20 font-sans transition-colors duration-300">
            <Hero />

            {/* The multi-segment tabbed table component */}
            <Brokerage />

            <div className="w-full h-[1px] bg-[var(--border-primary)] my-16 max-w-[1000px] mx-auto transition-colors duration-300"></div>

            <AccountOpeningRow />

            <div className="w-full h-[1px] bg-[var(--border-primary)] my-16 max-w-[1000px] mx-auto transition-colors duration-300"></div>

            <ChargesExplanatory />

            {/* Footer linking support section */}
            <div className="container mx-auto px-4 mt-20 text-center text-[var(--text-secondary)] text-[14.5px] transition-colors duration-300 max-w-4xl">
                <p>
                    Disclaimer: For delivery based trades, a minimum of ₹0.01 will be charged per scrip (irrespective of quantity), for the purpose of meeting stamp duty and other statutory charges.
                </p>
                <p className="mt-4">
                    Read the <a href="#" className="text-[color:var(--accent-primary)] hover:underline">list of charges FAQ</a> to know more details.
                </p>
            </div>
        </div>
    );
};

export default PricingPage;
