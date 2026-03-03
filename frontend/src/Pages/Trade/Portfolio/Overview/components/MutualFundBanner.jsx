
import React from 'react';
import { Info } from 'lucide-react';

const MutualFundBanner = () => {
    return (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Info size={18} className="text-[var(--accent-primary)]" strokeWidth={2} />
                <span className="text-[var(--text-secondary)] text-xs font-medium">You have not invested in Mutual Funds with Angel One yet.</span>
            </div>

            <div className="flex items-center gap-4 bg-[var(--bg-main)] px-3 py-1.5 rounded">
                <span className="text-[var(--text-secondary)] text-xs font-bold">Mutual Funds</span>
                <button className="bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--accent-primary)] text-[10px] font-bold py-1.5 px-3 rounded border border-[var(--border-primary)] transition-colors uppercase tracking-wide">
                    Invest Now
                </button>
            </div>
        </div>
    );
};

export default MutualFundBanner;
