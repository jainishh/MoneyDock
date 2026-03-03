import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateWatchlistModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const maxLength = 15;

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[var(--border-primary)]">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-[var(--text-primary)]">
                            Create Watchlist
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                                Enter Watchlist Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        if (e.target.value.length <= maxLength) {
                                            setName(e.target.value);
                                        }
                                    }}
                                    placeholder="Type a name for your watchlist"
                                    className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded px-3 py-2.5 focus:outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-muted)]"
                                    autoFocus
                                />
                            </div>
                            <div className="mt-1 text-right">
                                <span className="text-xs text-[#868993]">
                                    {name.length}/{maxLength} Characters
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full bg-[#2962ff] hover:bg-[#1e54eb] disabled:bg-[#2962ff]/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors cursor-pointer"
                        >
                            CREATE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWatchlistModal;
