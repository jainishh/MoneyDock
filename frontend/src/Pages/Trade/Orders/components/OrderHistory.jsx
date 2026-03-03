
import React, { useState, useEffect } from 'react';

const OrderHistory = ({ orders = [] }) => {
    // Format orders for display
    const history = orders.map(order => ({
        time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: order.transactiontype,
        instrument: order.tradingsymbol,
        product: order.producttype === "INTRADAY" ? "Intraday" : "Delivery",
        qty: `${order.filledShares || 0}/${order.quantity}`,
        avgPrice: (order.averagePrice || order.price || 0).toFixed(2),
        status: order.orderstatus,
        statusColor: (order.orderstatus === "complete")
            ? "text-green-500"
            : (order.orderstatus === "rejected" || order.orderstatus === "cancelled")
                ? "text-red-500"
                : "text-yellow-500",
        originalOrder: order
    }));

    return (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[var(--text-muted)] text-[10px] uppercase border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                            <th className="py-3 pl-4 font-bold">Time</th>
                            <th className="py-3 font-bold">Type</th>
                            <th className="py-3 font-bold">Instrument</th>
                            <th className="py-3 font-bold">Product</th>
                            <th className="py-3 text-right font-bold w-24">Qty.</th>
                            <th className="py-3 text-right font-bold">Avg. Price</th>
                            <th className="py-3 text-right font-bold pr-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? (
                            history.map((order, index) => (
                                <tr key={index} className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer border-b border-[var(--border-primary)] last:border-0 text-xs">
                                    <td className="py-3 pl-4 text-[var(--text-secondary)]">{order.time}</td>
                                    <td className="py-3">
                                        <span className={`font-bold ${order.type === 'BUY' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-[4px]`}>
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="py-3 text-[var(--text-secondary)] font-bold">{order.instrument}</td>
                                    <td className="py-3 text-[var(--text-secondary)]">{order.product}</td>
                                    <td className="py-3 text-right text-[var(--text-secondary)]">{order.qty}</td>
                                    <td className="py-3 text-right text-[var(--text-secondary)]">₹{order.avgPrice}</td>
                                    <td className="py-3 text-right pr-4">
                                        <span className={`${order.statusColor} font-bold`}>{order.status}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-[var(--text-muted)] py-8">No order history found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {history.length > 0 ? (
                    history.map((order, index) => (
                        <div key={index} className="p-4 border-b border-[var(--border-primary)] last:border-0 bg-[var(--bg-main)]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2 items-center">
                                    <span className={`text-[10px] font-bold ${order.type === 'BUY' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-0.5 rounded border ${order.type === 'BUY' ? 'border-green-500/20' : 'border-red-500/20'}`}>
                                        {order.type}
                                    </span>
                                    <span className="text-[var(--text-secondary)] font-bold text-sm">{order.instrument}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`${order.statusColor} font-bold text-xs uppercase`}>{order.status}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <div className="text-[var(--text-muted)]">{order.time}</div>
                                <div className="flex gap-4">
                                    <div>
                                        <span className="text-[var(--text-muted)] mr-1">Qty:</span>
                                        <span className="text-[var(--text-secondary)] font-bold">{order.qty}</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-muted)] mr-1">Avg:</span>
                                        <span className="text-[var(--text-secondary)] font-bold">₹{order.avgPrice}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[var(--border-primary)] flex justify-between items-center">
                                <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--border-primary)]">{order.product}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-[var(--text-muted)] py-8">No order history found</div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
