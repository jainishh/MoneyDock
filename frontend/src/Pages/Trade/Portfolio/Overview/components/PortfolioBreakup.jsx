import React from 'react';
import { ChevronRight } from 'lucide-react';

const PortfolioBreakup = ({ holdings, summary, loading }) => {
    const totalInvested = summary?.totalInvested ?? 0;

    if (loading) {
        return (
            <div className="mb-4">
                <h2 className="text-[var(--text-primary)] text-sm font-bold mb-3">Portfolio Breakup</h2>
                <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4 space-y-3">
                    <div className="h-6 bg-[var(--bg-secondary)] rounded animate-pulse" />
                    {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-[var(--bg-secondary)] rounded animate-pulse" />)}
                </div>
            </div>
        );
    }

    if (!holdings || holdings.length === 0) {
        return (
            <div className="mb-4">
                <h2 className="text-[var(--text-primary)] text-sm font-bold mb-3">Portfolio Breakup</h2>
                <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-6 text-center text-[var(--text-muted)] text-sm">
                    No holdings found.
                </div>
            </div>
        );
    }

    // Build per-holding data with investment %
    const rows = holdings.map((h, idx) => {
        const pct = totalInvested > 0 ? ((h.investedValue / totalInvested) * 100) : 0;
        const COLORS = ['#5c6bc0', '#26a69a', '#ef5350', '#ffa726', '#ec407a', '#42a5f5', '#ab47bc', '#66bb6a'];
        return {
            symbol: h.tradingsymbol,
            exchange: h.exchange,
            qty: h.netQty,
            avgPrice: h.avgBuyPrice,
            investedValue: h.investedValue,
            realizedPnl: h.realizedPnl,
            pct: pct.toFixed(1),
            color: COLORS[idx % COLORS.length],
        };
    });

    const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const totalPnl = holdings.reduce((s, h) => s + (h.realizedPnl ?? 0), 0);

    return (
        <div className="mb-4">
            <h2 className="text-[var(--text-primary)] text-sm font-bold mb-3">Portfolio Breakup</h2>

            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4 text-sm overflow-x-auto">
                {/* Allocation Bar */}
                <div className="w-full bg-[var(--border-primary)] rounded h-5 mb-4 overflow-hidden flex">
                    {rows.map((r, i) => (
                        <div
                            key={i}
                            style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                            className="h-full transition-all"
                            title={`${r.symbol}: ${r.pct}%`}
                        />
                    ))}
                </div>

                {/* Table */}
                <div className="max-h-72 overflow-y-auto customscrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[var(--bg-card)] z-20">
                            <tr className="text-[var(--text-muted)] text-[10px] uppercase border-b border-[var(--border-primary)]">
                                <th className="pb-2 pl-2 font-bold w-1/4">Symbol</th>
                                <th className="pb-2 text-right font-bold">Qty</th>
                                <th className="pb-2 text-right font-bold">Avg Price</th>
                                <th className="pb-2 text-right font-bold">LTP</th>
                                <th className="pb-2 text-right font-bold pr-2">Total P&amp;L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h, i) => {
                                const totalPnl = h.totalPnl ?? h.realizedPnl ?? 0;
                                const pnlPositive = totalPnl >= 0;
                                const pct = totalInvested > 0 ? ((h.investedValue / totalInvested) * 100) : 0;
                                const COLORS = ['#5c6bc0', '#26a69a', '#ef5350', '#ffa726', '#ec407a', '#42a5f5', '#ab47bc', '#66bb6a'];
                                const color = COLORS[i % COLORS.length];

                                return (
                                    <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group border-b border-transparent hover:border-[var(--border-primary)]">
                                        <td className="py-3 pl-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                                <div>
                                                    <span className="text-[var(--text-secondary)] font-bold text-xs">{h.tradingsymbol}</span>
                                                    <span className="text-[var(--text-muted)] text-[10px] ml-1">({pct.toFixed(1)}%)</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] font-bold text-xs">{h.netQty}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] font-bold text-xs">₹{fmt(h.avgBuyPrice)}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] font-bold text-xs">₹{fmt(h.ltp || h.avgBuyPrice)}</td>
                                        <td className="py-3 text-right pr-2">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className={`font-bold text-xs ${pnlPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                    {pnlPositive ? '+' : ''}₹{fmt(totalPnl)}
                                                </span>
                                                <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {/* Footer row */}
                        <tfoot>
                            <tr className="border-t border-[var(--border-primary)] bg-[var(--bg-card)]">
                                <td colSpan={3} className="py-2 pl-2 text-[var(--text-muted)] text-[10px] font-bold uppercase">Total</td>
                                <td className="py-2 text-right text-[var(--text-primary)] font-bold text-xs">₹{fmt(summary?.currentValue ?? totalInvested)}</td>
                                <td className={`py-2 text-right pr-2 font-bold text-xs ${(summary?.totalPnl ?? totalPnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {(summary?.totalPnl ?? totalPnl) >= 0 ? '+' : ''}₹{fmt(summary?.totalPnl ?? totalPnl)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioBreakup;
