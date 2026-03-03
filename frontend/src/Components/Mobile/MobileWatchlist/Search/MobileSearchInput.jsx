import React, { useRef, useEffect } from "react";
import { Search, X, ArrowLeft } from "lucide-react";

const MobileSearchInput = ({
    query,
    onChange,
    onClose,
    onClear,
    isFocused,
    onFocus
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <div className={`flex items-center bg-[var(--bg-secondary)] rounded-md px-3 py-2 border transition-colors ${isFocused ? 'border-[var(--accent-primary)]' : 'border-[var(--border-primary)]'}`}>
            {isFocused ? (
                <ArrowLeft
                    size={20}
                    className="text-[var(--text-secondary)] mr-3 cursor-pointer"
                    onClick={onClose}
                />
            ) : (
                <Search size={18} className="text-[var(--text-muted)] mr-3" />
            )}

            <input
                ref={inputRef}
                type="text"
                placeholder="Search & add"
                className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 font-medium"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
            />

            {query && (
                <button
                    onClick={onClear}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default MobileSearchInput;
