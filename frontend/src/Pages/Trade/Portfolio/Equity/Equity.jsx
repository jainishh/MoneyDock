
import React from 'react';
import PortfolioStats from '../Overview/components/PortfolioStats';
import HoldingsTable from './components/HoldingsTable';

const Equity = ({ holdings, summary, loading, error }) => {
    return (
        <div className="bg-[var(--bg-main)] min-h-full text-[var(--text-secondary)] font-sans p-4">
            {error && (
                <div className="mb-4 bg-[#1c1018] border border-[#f23645]/40 rounded p-3 text-[11px] text-[#f23645]">
                    {error}
                </div>
            )}
            {/* Stats Section (Reused) */}
            <PortfolioStats summary={summary} loading={loading} />
            {/* Holdings Table */}
            <HoldingsTable holdings={holdings} loading={loading} />
        </div>
    );
};

export default Equity;

