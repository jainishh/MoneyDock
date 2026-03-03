
import React from 'react';
import { ChevronRight } from 'lucide-react';

const HoldingsTable = ({ holdings = [], loading }) => {
    const fmt = (n) =>
        Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading) {
        return (
            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-[var(--bg-secondary)] rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-2">
                    <h2 className="text-[var(--text-primary)] text-sm font-bold">Holdings</h2>
                    <span className="bg-[var(--bg-secondary)] text-[var(--accent-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {holdings.length}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[var(--text-muted)] text-[10px] uppercase border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                            <th className="py-2 pl-3 font-bold">Symbol</th>
                            <th className="py-2 text-right font-bold">Qty</th>
                            <th className="py-2 text-right font-bold">Avg. Price</th>
                            <th className="py-2 text-right font-bold">LTP</th>
                            <th className="py-2 text-right font-bold">Current Value</th>
                            <th className="py-2 text-right font-bold pr-3">Total P&amp;L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-[var(--text-muted)] text-sm">
                                    No holdings found. Place a buy order to get started.
                                </td>
                            </tr>
                        ) : (
                            holdings.map((h, idx) => {
                                const totalPnl = h.totalPnl ?? h.realizedPnl ?? 0;
                                const pnlPositive = totalPnl >= 0;
                                const pnlPct = h.investedValue > 0
                                    ? ((totalPnl / h.investedValue) * 100).toFixed(2)
                                    : '0.00';

                                return (
                                    <tr
                                        key={idx}
                                        className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer border-b border-[var(--border-primary)] last:border-0 group"
                                    >
                                        <td className="py-3 pl-3">
                                            <div className="text-[var(--text-secondary)] font-bold text-xs">{h.tradingsymbol}</div>
                                            <div className="text-[var(--text-muted)] text-[10px]">{h.producttype}</div>
                                        </td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] text-xs font-bold">{h.netQty}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] text-xs">₹{fmt(h.avgBuyPrice)}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] text-xs font-bold">
                                            ₹{fmt(h.ltp || h.avgBuyPrice)}
                                        </td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] text-xs font-bold">
                                            ₹{fmt(h.currentValue || h.investedValue)}
                                        </td>
                                        <td className="py-3 text-right pr-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <div>
                                                    <div className={`font-bold text-xs ${pnlPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                        {pnlPositive ? '+' : ''}₹{fmt(totalPnl)}
                                                    </div>
                                                    <div className={`text-[10px] ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                        {pnlPositive ? '+' : ''}{pnlPct}%
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HoldingsTable;
