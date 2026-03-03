
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const MobilePortfolio = ({ holdings = [], summary, loading, error }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const totalInvested = summary?.totalInvested ?? 0;
    const totalPnl = summary?.totalPnl ?? summary?.totalRealizedPnl ?? 0;
    const isPnlPositive = totalPnl >= 0;
    const pnlPct = totalInvested > 0
        ? ((totalPnl / totalInvested) * 100).toFixed(2)
        : '0.00';

    const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const filtered = (holdings || []).filter(h =>
        h.tradingsymbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans relative">

            {/* 1. Search & Filter */}
            <div className="p-4 flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search holdings…"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-[var(--bg-secondary)] p-2 rounded-full border border-[var(--border-primary)] text-[var(--text-secondary)]">
                    <Filter size={18} />
                </button>
            </div>

            {/* 2. Error Banner */}
            {error && (
                <div className="mx-4 mb-3 flex items-start gap-2 bg-[#1c1018] border border-[#f23645]/40 rounded p-3 text-[11px] text-[#f23645]">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* 3. Portfolio Summary Card */}
            <div className={`mx-4 p-5 rounded-2xl shadow-sm border transition-all duration-300 ${isPnlPositive
                ? 'bg-[#00a278]/10 border-[#00a278]/20'
                : 'bg-[#f23645]/10 border-[#f23645]/20'} `}>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total P&L</span>
                    {loading && <RefreshCw size={14} className="animate-spin text-[var(--text-muted)]" />}
                </div>

                <div className={`text-3xl font-extrabold mb-5 flex items-baseline gap-2 ${isPnlPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {summary ? (
                        <>
                            <span>{isPnlPositive ? '+' : ''}₹{fmt(totalPnl)}</span>
                            <span className="text-sm font-medium opacity-80 decoration-0">({pnlPct}%)</span>
                        </>
                    ) : loading ? (
                        <span className="text-base text-[var(--text-muted)]">Loading…</span>
                    ) : '—'}
                </div>

                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-1">Invested</div>
                        <div className="font-bold text-[var(--text-primary)]">
                            {summary ? `₹${fmt(totalInvested)}` : '—'}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-1">Current Value</div>
                        <div className="font-bold text-[var(--text-primary)]">
                            {summary ? `₹${fmt(summary.currentValue ?? totalInvested)}` : '—'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Holdings List Header */}
            <div className="px-4 py-2 flex justify-between items-center text-[10px] text-[var(--text-muted)] uppercase mt-2 border-b border-[var(--border-primary)]">
                <span>Symbol / Qty / LTP</span>
                <span>Invested / Total P&amp;L</span>
            </div>

            {/* 5. Holdings List */}
            <div className="flex-1 overflow-y-auto pb-20 customscrollbar">
                {loading && holdings.length === 0 ? (
                    <div className="space-y-px">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="px-4 py-3 border-b border-[var(--border-primary)]">
                                <div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse mb-2 w-1/3" />
                                <div className="h-3 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)] gap-2">
                        <AlertCircle size={28} className="opacity-40" />
                        <p className="text-sm">{searchQuery ? 'No results found' : 'No holdings yet'}</p>
                    </div>
                ) : (
                    filtered.map((h, i) => {
                        const rowTotalPnl = h.totalPnl ?? h.realizedPnl ?? 0;
                        const pnlPos = rowTotalPnl >= 0;
                        const rowPnlPct = h.investedValue > 0
                            ? ((rowTotalPnl / h.investedValue) * 100).toFixed(2)
                            : '0.00';
                        return (
                            <div key={i} className="px-4 py-3 border-b border-[var(--border-primary)] flex justify-between items-start">
                                {/* Left */}
                                <div>
                                    <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{h.tradingsymbol}</div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {h.netQty} <span className="mx-0.5">shs</span> <span className="mx-0.5">LTP</span> ₹{fmt(h.ltp || h.avgBuyPrice)}
                                    </div>
                                    <span className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-muted)] px-1 py-0.5 rounded mt-1 inline-block">
                                        Avg ₹{fmt(h.avgBuyPrice)}
                                    </span>
                                </div>
                                {/* Right */}
                                <div className="text-right">
                                    <div className="text-xs text-[var(--text-muted)] mb-0.5">₹{fmt(h.investedValue)}</div>
                                    <div className={`font-semibold text-sm ${pnlPos ? 'text-green-500' : 'text-red-500'}`}>
                                        {pnlPos ? '+' : ''}₹{fmt(rowTotalPnl)}
                                        <span className="text-[10px] ml-1">({rowPnlPct}%)</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MobilePortfolio;
