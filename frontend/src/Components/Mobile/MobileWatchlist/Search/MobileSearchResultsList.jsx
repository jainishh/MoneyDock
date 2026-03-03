import React from "react";
import { Plus, Check, Loader } from "lucide-react";

const MobileSearchResultsList = ({
    results,
    isLoading,
    query,
    activeFilter,
    onAdd,
    onBuy,
    onSell
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                <Loader className="animate-spin mb-2" size={24} />
                <span className="text-sm">Searching...</span>
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)] px-6 text-center">
                <span className="text-sm">Search for stocks to add to your watchlist</span>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                <span className="text-sm">No results found for "{query}"</span>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {results.map((stock, index) => (
                <div
                    key={stock.token || index}
                    className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)] transition-colors"
                >
                    <div className="flex flex-col">
                        <span className="font-semibold text-[var(--text-secondary)] text-sm flex items-center gap-2">
                            {stock.symbol || stock.name}
                            {stock.instrumenttype === 'FUTSTK' && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-[#f7931a]/20 text-[#f7931a] rounded">FUT</span>
                            )}
                            {stock.exch_seg === 'NSE' && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded">NSE</span>
                            )}
                            {stock.exch_seg === 'BSE' && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-[#f23645]/20 text-[#f23645] rounded">BSE</span>
                            )}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
                            {stock.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onBuy(stock)}
                            className="bg-[#089981] text-white text-[10px] font-bold px-3 py-1.5 rounded"
                        >
                            B
                        </button>
                        <button
                            onClick={() => onSell(stock)}
                            className="bg-[#f23645] text-white text-[10px] font-bold px-3 py-1.5 rounded"

                        >
                            S
                        </button>
                        <button
                            onClick={() => onAdd(stock)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--accent-primary)]"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MobileSearchResultsList;
