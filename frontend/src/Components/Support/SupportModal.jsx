import React from 'react';
import { X } from 'lucide-react';

const SupportModal = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop with standard blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-[var(--bg-card)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--border-primary)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--bg-main)] text-[var(--accent-primary)] border border-[var(--border-primary)] shadow-sm">
                            {icon}
                        </div>
                        <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 max-h-[70vh] overflow-y-auto customscrollbar bg-[var(--bg-card)]">
                    {children}
                </div>

                {/* Footer (Optional) */}
                <div className="p-4 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-primary)] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
