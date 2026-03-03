import React from "react";
import { Plus } from "lucide-react";

/**
 * SearchResultItem Component
 * Renders a single row of the search results list.
 */
const SearchResultItem = ({ result, onSelect, onAdd, onBuy, onSell }) => {
    // Determine avatar text based on instrument type
    const avatarText = result.instrumenttype === 'FUTSTK' || result.instrumenttype === 'FUTIDX' ? 'FO' : 'EQ';
    const avatarColor = avatarText === 'FO' ? 'text-[#f7931a] bg-[#f7931a]/10' : 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10';

    return (
        <div
            className="group px-4 py-3 hover:bg-[var(--bg-secondary)] cursor-pointer flex justify-between items-center border-b border-[var(--border-primary)]/30 last:border-none transition-colors"
            onClick={() => onSelect(result)}
        >
            {/* Left: Symbol Info */}
            <div className="flex items-center gap-3">
                {/* Avatar Badge */}
                <div className={`w-8 h-8 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[10px] font-bold ${avatarColor}`}>
                    {avatarText}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                            {result.name}
                        </span>
                        <span className="text-[9px] bg-[var(--bg-secondary)] text-[var(--text-muted)] px-1 py-0.5 rounded leading-none border border-[var(--border-primary)]">
                            {result.exch_seg}
                        </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate max-w-[180px]">
                        {result.symbol}
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="w-7 h-7 flex items-center justify-center bg-[#089981]/10 text-[#089981] hover:bg-[#089981] hover:text-white rounded transition-all font-bold text-xs border border-[#089981]/20"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBuy(result);
                    }}
                    title="Buy"
                >
                    B
                </button>
                <button
                    className="w-7 h-7 flex items-center justify-center bg-[#f23645]/10 text-[#f23645] hover:bg-[#f23645] hover:text-white rounded transition-all font-bold text-xs border border-[#f23645]/20"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSell(result);
                    }}
                    title="Sell"
                >
                    S
                </button>
                <button
                    className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(result);
                    }}
                    title="Add to Watchlist"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default SearchResultItem;
