import React from 'react';
import { X, AlertCircle } from 'lucide-react';

/**
 * ConfirmModal - A reusable confirmation dialog
 * 
 * Props:
 * - isOpen: boolean (control visibility)
 * - onClose: function (callback when cancelled/closed)
 * - onConfirm: function (callback when confirmed)
 * - title: string (modal header)
 * - message: string (modal body text)
 * - confirmText: string (label for the confirm button)
 * - cancelText: string (label for the cancel button)
 * - type: 'danger' | 'primary' (styling for the confirm button)
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger"
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-[var(--bg-card)] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[var(--border-primary)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Message */}
                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] font-bold py-3 rounded-lg transition-colors text-xs uppercase tracking-wider border border-[var(--border-primary)]"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 ${type === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-[#2962ff] hover:bg-[#1e54eb] shadow-[#2962ff]/20'
                                } text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 text-xs uppercase tracking-wider shadow-lg`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
