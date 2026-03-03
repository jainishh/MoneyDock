
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PositionsTable = ({ positions = [], onAction }) => {
    // Format positions for display
    const formattedPositions = positions.map(pos => {
        const pnl = pos.totalPnl || 0;
        const investment = pos.buyValue || 0;
        const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;
        const isProfit = pnl >= 0;

        return {
            instrument: pos.tradingsymbol,
            exchange: pos.exchange || 'NSE',
            type: pos.transactiontype || 'BUY',
            product: pos.producttype === 'INTRADAY' ? 'Intraday' : 'Delivery',
            qty: pos.netQty || 0,
            buyQty: pos.buyQty || 0,
            sellQty: pos.sellQty || 0,
            avgPrice: (pos.avgPrice || 0).toFixed(2),
            ltp: (pos.ltp || pos.avgPrice || 0).toFixed(2),
            pnl: `${isProfit ? '+' : ''}₹${pnl.toFixed(2)}`,
            pnlPercent: `${isProfit ? '+' : ''}${pnlPercent.toFixed(2)}%`,
            isProfit,
            rawPnl: pnl,
            rawPos: pos,
            isFnO: pos.exchange === 'NFO' || pos.exchange === 'BFO' || pos.exchange === 'MCX' || pos.exchange === 'CDS' || pos.tradingsymbol?.includes('CE') || pos.tradingsymbol?.includes('PE')
        };
    });

    return (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-2">
                    <h2 className="text-[var(--text-primary)] text-sm font-bold">Open Positions</h2>
                    <span className="bg-[var(--border-primary)] text-[var(--accent-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded">{formattedPositions.length}</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[var(--text-muted)] text-[10px] uppercase border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                            <th className="py-3 pl-4 font-bold">Instrument</th>
                            <th className="py-3 font-bold">Product</th>
                            <th className="py-3 text-right font-bold w-24">Qty.</th>
                            <th className="py-3 text-right font-bold">Avg. Price</th>
                            <th className="py-3 text-right font-bold">LTP</th>
                            <th className="py-3 text-right font-bold pr-4">P&L</th>
                            <th className="py-3 text-right font-bold pr-4 w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedPositions.length > 0 ? (
                            formattedPositions.map((pos, index) => (
                                <tr key={index} className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer border-b border-[var(--border-primary)] last:border-0 group">
                                    <td className="py-4 pl-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-1 rounded ${pos.type === 'BUY' ? 'text-blue-400 bg-blue-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                    {pos.type}
                                                </span>
                                                <span className="text-[var(--text-secondary)] font-bold text-xs">{pos.instrument}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--text-muted)] font-medium">{pos.exchange}</span>
                                                {pos.buyQty > 0 && pos.sellQty > 0 && (
                                                    <span className="text-[10px] text-[var(--text-muted)]">B:{pos.buyQty} S:{pos.sellQty}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-[var(--text-secondary)] text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border-primary)]">{pos.product}</span>
                                    </td>
                                    <td className="py-4 text-right text-[var(--text-secondary)] text-xs font-bold">{pos.qty}</td>
                                    <td className="py-4 text-right text-[var(--text-secondary)] text-xs font-bold">₹{pos.avgPrice}</td>
                                    <td className="py-4 text-right">
                                        <div className="text-[var(--text-secondary)] font-bold text-xs">₹{pos.ltp}</div>
                                    </td>
                                    <td className="py-4 text-right pr-4">
                                        <div className={`font-bold text-sm ${pos.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                            {pos.pnl}
                                        </div>
                                        <div className="text-[10px] text-[var(--text-muted)] flex justify-end items-center gap-1">
                                            {pos.pnlPercent}
                                            {pos.isProfit ? <ArrowUpRight size={12} className="text-green-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right pr-4 align-middle">
                                        {pos.isFnO && (
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAction && onAction('sell', pos.rawPos); }}
                                                    className="bg-[var(--bg-secondary)] text-red-500 px-3 py-1.5 rounded text-xs font-bold border border-[var(--border-primary)] hover:bg-red-500/10 transition-colors cursor-pointer">
                                                    EXIT
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAction && onAction('buy', pos.rawPos); }}
                                                    className="bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded text-xs font-bold hover:opacity-90 transition-colors cursor-pointer">
                                                    ADD
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-[var(--text-muted)] py-8">No positions found. Place orders to see positions here.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {formattedPositions.length > 0 ? (
                    formattedPositions.map((pos, index) => (
                        <div key={index} className="p-4 border-b border-[var(--border-primary)] last:border-0 bg-[var(--bg-main)]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2 items-center">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pos.type === 'BUY' ? 'text-blue-400 bg-blue-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                        {pos.type}
                                    </span>
                                    <span className="text-[var(--text-secondary)] font-bold text-sm">{pos.instrument}</span>
                                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1 rounded">{pos.exchange}</span>
                                </div>
                                <div className={`font-bold text-sm ${pos.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                    {pos.pnl}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <div className="flex gap-4">
                                    <div>
                                        <div className="text-[10px] text-[var(--text-muted)]">Qty</div>
                                        <div className="text-[var(--text-secondary)] text-xs font-bold">{pos.qty}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[var(--text-muted)]">Avg</div>
                                        <div className="text-[var(--text-secondary)] text-xs font-bold">₹{pos.avgPrice}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[var(--text-muted)]">LTP</div>
                                        <div className="text-[var(--text-secondary)] text-xs font-bold">₹{pos.ltp}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border-primary)]">{pos.product}</span>
                                </div>
                            </div>

                            {/* Action Buttons for Mobile */}
                            {pos.isFnO && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onAction && onAction('sell', pos.rawPos); }}
                                        className="flex-1 bg-[var(--bg-secondary)] text-red-500 py-2 rounded text-xs font-bold border border-[var(--border-primary)] hover:bg-red-500/10 transition-colors">
                                        EXIT
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onAction && onAction('buy', pos.rawPos); }}
                                        className="flex-1 bg-[var(--accent-primary)] text-white py-2 rounded text-xs font-bold hover:opacity-90 transition-colors">
                                        ADD MORE
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-[var(--text-muted)] py-8">No positions found</div>
                )}
            </div>

            {/* Footer Summary */}
            {formattedPositions.length > 0 && (
                <div className="px-4 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-xs font-medium">Total Positions</span>
                    <span className="text-[var(--text-secondary)] text-sm font-bold">{formattedPositions.length}</span>
                </div>
            )}
        </div>
    );
};

export default PositionsTable;
