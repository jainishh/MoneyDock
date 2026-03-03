import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModifyOrderModal = ({ isOpen, onClose, onModify, order }) => {
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (isOpen && order) {
            setPrice(order.price || '');
            // For quantity, we extract the total part from "filled/total"
            const totalQty = order.qty ? order.qty.split('/')[1] : '';
            setQuantity(totalQty || '');
        }
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (price && quantity) {
            onModify({
                orderId: order.originalOrder._id,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-[var(--bg-card)] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[var(--border-primary)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                            Modify Order
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 hover:bg-[var(--bg-secondary)] rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.05"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-bold"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#868993] uppercase mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-bold"
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] font-bold py-3 rounded-lg transition-colors text-xs uppercase tracking-wider border border-[var(--border-primary)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!price || !quantity}
                                className="flex-1 bg-[#2962ff] hover:bg-[#1e54eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-[#2962ff]/20"
                            >
                                UPDATE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModifyOrderModal;
