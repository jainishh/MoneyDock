import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddFundsModal = ({ isOpen, onClose, onAdd }) => {
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setAmount('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (numAmount > 0) {
            onAdd(numAmount);
            setAmount('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[var(--border-primary)]">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-[var(--text-primary)]">
                            Add Funds
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                                Enter Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    placeholder="0"
                                    className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded px-3 py-2.5 pl-8 focus:outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-muted)]"
                                    autoFocus
                                    min="1"
                                    step="1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-transparent border border-[var(--border-primary)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium py-3 rounded transition-colors"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 bg-[#2962ff] hover:bg-[#1e54eb] disabled:bg-[#2962ff]/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors"
                            >
                                ADD FUNDS
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFundsModal;
