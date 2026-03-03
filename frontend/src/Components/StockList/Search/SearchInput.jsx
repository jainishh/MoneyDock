import React, { useRef, useEffect } from "react";
import { Search, X, ArrowLeft } from "lucide-react";

/**
 * SearchInput Component
 * Renders the search bar input field with search icon, clear button, and close functionality.
 */
const SearchInput = ({
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
                    size={18}
                    className="text-[var(--text-secondary)] mr-3 cursor-pointer hover:text-[var(--text-primary)]"
                    onClick={onClose}
                />
            ) : (
                <Search size={18} className="text-[var(--text-muted)] mr-3" />
            )}

            <input
                ref={inputRef}
                type="text"
                placeholder="Search e.g. Reliance, TCS"
                className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
            />

            {query ? (
                <button
                    onClick={onClear}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X size={16} />
                </button>
            ) : !isFocused && (
                <span className="text-[var(--text-muted)] text-[10px] px-1.5 py-0.5 border border-[var(--border-primary)] rounded bg-[var(--border-primary)]/20">
                    CTRL+K
                </span>
            )}
        </div>
    );
};

export default SearchInput;
