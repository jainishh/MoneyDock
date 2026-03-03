import React, { useState } from 'react';
import { Edit2, XCircle } from 'lucide-react';
import ConfirmModal from '../../../../Components/Common/ConfirmModal';
import ModifyOrderModal from '../../../../Components/Order/ModifyOrderModal';
import { useToast } from '../../../../context/ToastContext';

const OpenOrders = ({ orders = [], onUpdate }) => {
    const { showToast } = useToast();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isModifyOpen, setIsModifyOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-[var(--bg-card)] p-6 rounded-full mb-6">
                    <div className="w-24 h-20 bg-[var(--border-primary)] rounded-lg flex items-center justify-center relative">
                        <div className="w-16 h-12 bg-white rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="absolute -top-2 -right-2 text-blue-500">
                            <span className="text-xl">✈️</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-[var(--text-primary)] text-lg font-bold mb-2">You don't have any open orders</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Check Angel One's Recommendations</p>

                <button className="bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wide transition-colors">
                    View Trading Ideas
                </button>
            </div>
        );
    }


    const handleCancelRequest = (orderId) => {
        setSelectedOrder(orderId);
        setIsConfirmOpen(true);
    };

    const handleModifyRequest = (order) => {
        setSelectedOrder(order);
        setIsModifyOpen(true);
    };

    const executeCancel = async () => {
        const orderId = selectedOrder;
        if (!orderId) return;

        try {
            const userInfo = localStorage.getItem("userInfo");
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user ? user._id : null;

            const response = await fetch(`${API_URL}/api/order/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, userId })
            });
            const data = await response.json();
            if (data.success) {
                if (data.data && data.data.tradingBalance !== undefined) {
                    const currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
                    currentUserInfo.tradingBalance = data.data.tradingBalance;
                    localStorage.setItem("userInfo", JSON.stringify(currentUserInfo));
                    window.dispatchEvent(new Event("userInfoUpdated"));
                }
                showToast("Order Cancelled Successfully", "success");
                if (onUpdate) onUpdate();
            } else {
                showToast(data.message || "Failed to cancel order", "error");
            }
        } catch (error) {
            console.error("Action Error:", error);
            showToast("Network error occurred", "error");
        } finally {
            setSelectedOrder(null);
            setIsConfirmOpen(false);
        }
    };

    const executeModify = async (modifiedData) => {
        try {
            const userInfo = localStorage.getItem("userInfo");
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user ? user._id : null;

            const response = await fetch(`${API_URL}/api/order/modify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...modifiedData,
                    userId
                })
            });
            const data = await response.json();
            if (data.success) {
                showToast("Order Modified Successfully", "success");
                if (onUpdate) onUpdate();
            } else {
                showToast(data.message || "Failed to modify order", "error");
            }
        } catch (error) {
            console.error("Modify Error:", error);
            alert("Network error");
        } finally {
            setSelectedOrder(null);
            setIsModifyOpen(false);
        }
    };

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
                            <th className="py-3 text-right font-bold">LTP</th>
                            <th className="py-3 text-right font-bold">Price</th>
                            <th className="py-3 text-right font-bold">Status</th>
                            <th className="py-3 text-right font-bold pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer border-b border-[var(--border-primary)] last:border-0 group">
                                <td className="py-4 pl-4 text-[var(--text-secondary)] text-xs font-medium">{order.time}</td>
                                <td className="py-4">
                                    <span className={`text-[10px] font-bold ${order.type === 'BUY' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[#ef5350] bg-[#ef5350]/10'} px-2 py-1 rounded-[4px] border ${order.type === 'BUY' ? 'border-[var(--accent-primary)]/20' : 'border-[#ef5350]/20'}`}>
                                        {order.type}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[var(--text-secondary)] font-bold text-xs">{order.instrument}</span>
                                        <span className="text-[10px] text-[var(--text-muted)] font-medium">{order.exchange}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className="text-[var(--text-secondary)] text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border-primary)]">{order.product}</span>
                                </td>
                                <td className="py-4 text-right text-[var(--text-secondary)] text-xs font-bold">{order.qty}</td>
                                <td className="py-4 text-right">
                                    <div className="text-[var(--text-secondary)] font-bold text-xs">₹{order.ltp}</div>
                                </td>
                                <td className="py-4 text-right text-[var(--text-secondary)] text-xs font-bold">₹{order.price}</td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'open' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                                        <span className={`${order.statusColor} font-bold text-[10px] uppercase tracking-wider`}>{order.status}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right pr-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleModifyRequest(order); }}
                                            className="p-1.5 hover:bg-[var(--bg-secondary)] rounded text-blue-400 custom-tooltip"
                                            title="Modify Order"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCancelRequest(order.originalOrder._id); }}
                                            className="p-1.5 hover:bg-[var(--bg-secondary)] rounded text-red-400 custom-tooltip"
                                            title="Cancel Order"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {orders.map((order, index) => (
                    <div key={index} className="p-4 border-b border-[var(--border-primary)] last:border-0 bg-[var(--bg-main)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2 items-center">
                                <span className={`text-[10px] font-bold ${order.type === 'BUY' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[#ef5350] bg-[#ef5350]/10'} px-2 py-0.5 rounded border ${order.type === 'BUY' ? 'border-[var(--accent-primary)]/20' : 'border-[#ef5350]/20'}`}>
                                    {order.type}
                                </span>
                                <span className="text-[var(--text-secondary)] font-bold text-sm">{order.instrument}</span>
                                <span className="text-[10px] text-[var(--text-muted)] bg-[var(--border-primary)] px-1 rounded">{order.exchange}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Open' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                                <span className={`${order.statusColor} font-bold text-xs uppercase`}>{order.status}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <div className="flex gap-4">
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)]">Qty</div>
                                    <div className="text-[var(--text-secondary)] text-xs font-bold">{order.qty}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)]">Price</div>
                                    <div className="text-[var(--text-secondary)] text-xs font-bold">₹{order.price}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)]">LTP</div>
                                    <div className="text-[var(--text-secondary)] text-xs font-bold">₹{order.ltp}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-[var(--text-muted)]">Product</div>
                                <div className="text-[var(--text-secondary)] text-xs font-bold">{order.product}</div>
                            </div>
                        </div>

                        {/* Action Buttons for Mobile */}
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleModifyRequest(order); }}
                                className="flex-1 bg-[var(--bg-secondary)] text-blue-400 py-2 rounded text-xs font-bold border border-[var(--border-primary)] flex items-center justify-center gap-2"
                            >
                                <Edit2 size={12} /> Modify
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleCancelRequest(order.originalOrder._id); }}
                                className="flex-1 bg-[var(--bg-secondary)] text-red-400 py-2 rounded text-xs font-bold border border-[var(--border-primary)] flex items-center justify-center gap-2"
                            >
                                <XCircle size={12} /> Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeCancel}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmText="Cancel Order"
            />

            <ModifyOrderModal
                isOpen={isModifyOpen}
                onClose={() => setIsModifyOpen(false)}
                onModify={executeModify}
                order={selectedOrder}
            />
        </div>
    );
};

export default OpenOrders;
