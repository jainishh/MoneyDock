
import React from 'react';
import PortfolioStats from './components/PortfolioStats';
import PortfolioBreakup from './components/PortfolioBreakup';
import MutualFundBanner from './components/MutualFundBanner';
import ActionCards from './components/ActionCards';
import CommunityFooter from './components/CommunityFooter';

const Overview = ({ holdings, summary, loading, error }) => {
    return (
        <div className="bg-[var(--bg-main)] min-h-full text-[var(--text-secondary)] font-sans p-4">

            {error && (
                <div className="mb-4 bg-[#1c1018] border border-[#f23645]/40 rounded p-3 text-[11px] text-[#f23645]">
                    {error}
                </div>
            )}

            {/* Top Stats Section */}
            <PortfolioStats summary={summary} loading={loading} />

            {/* Portfolio Breakup Section */}
            <PortfolioBreakup holdings={holdings} summary={summary} loading={loading} />

            {/* Mutual Fund Info Banner */}
            <MutualFundBanner />

            {/* Action Cards Section */}
            <ActionCards />

            {/* Footer Section */}
            <CommunityFooter />
        </div>
    );
};

export default Overview;

