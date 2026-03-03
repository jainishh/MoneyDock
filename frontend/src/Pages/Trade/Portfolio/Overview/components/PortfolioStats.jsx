import React from 'react';
import { Wallet, Briefcase, TrendingDown, TrendingUp } from 'lucide-react';

const PortfolioStats = ({ summary, loading }) => {
    const invested = summary?.totalInvested ?? 0;
    const totalPnl = summary?.totalPnl ?? summary?.totalRealizedPnl ?? 0;
    const currentValue = summary?.currentValue ?? invested;

    const isProfit = totalPnl >= 0;
    const pnlPct = invested > 0 ? ((totalPnl / invested) * 100).toFixed(2) : '0.00';

    const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading) {
        return (
            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] mb-4 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] mb-4 p-4 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-primary)]">

            {/* Invested Amount */}
            <div className="flex items-center gap-3 px-4 py-2 first:pl-0">
                <div className="text-gray-500">
                    <Wallet size={20} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[var(--text-muted)] text-[11px] font-bold">Invested Amount</div>
                    <div className="text-base font-bold text-[var(--text-primary)]">
                        {summary ? `₹ ${fmt(invested)}` : '—'}
                    </div>
                </div>
            </div>

            {/* Current Value */}
            <div className="flex items-center gap-3 px-4 py-2">
                <div className="text-gray-500">
                    <Briefcase size={20} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[var(--text-muted)] text-[11px] font-bold">Current Value</div>
                    <div className="text-base font-bold text-[var(--text-primary)]">
                        {summary ? `₹ ${fmt(currentValue)}` : '—'}
                    </div>
                </div>
            </div>

            {/* Total P&L */}
            <div className="flex items-center gap-3 px-4 py-2">
                <div className={isProfit ? 'text-green-500' : 'text-red-500'}>
                    {isProfit ? <TrendingUp size={20} strokeWidth={1.5} /> : <TrendingDown size={20} strokeWidth={1.5} />}
                </div>
                <div>
                    <div className="text-[var(--text-muted)] text-[11px] font-bold">Total P&amp;L</div>
                    {summary ? (
                        <div className={`flex items-center gap-2 font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                            <span className="text-base">{isProfit ? '+' : ''}₹ {fmt(totalPnl)}</span>
                            <span className="text-[11px]">{isProfit ? '+' : ''}{pnlPct}%</span>
                        </div>
                    ) : <span className="text-base font-bold text-[var(--text-primary)]">—</span>}
                </div>
            </div>

            {/* Unique Symbols */}
            <div className="flex items-center gap-3 px-4 py-2">
                <div className="text-gray-500">
                    <Briefcase size={20} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[var(--text-muted)] text-[11px] font-bold">Unique Symbols</div>
                    <div className="text-base font-bold text-[var(--text-primary)]">
                        {summary ? summary.uniqueSymbols ?? summary.holdingsCount : '—'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioStats;
