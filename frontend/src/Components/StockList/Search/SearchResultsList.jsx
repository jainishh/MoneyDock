import React from "react";
import { Search } from "lucide-react";
import SearchResultItem from "./SearchResultItem";

/**
 * SearchResultsList Component
 * Renders the list of filtered search results or empty/loading states.
 */
const SearchResultsList = ({
    results,
    isLoading,
    query,
    onSelect,
    onAdd,
    onBuy,
    onSell
}) => {

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (results.length === 0 && query.length >= 2) {
        return (
            <div className="p-12 text-center text-[var(--text-muted)] flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center opacity-50">
                    <Search size={24} />
                </div>
                <div>
                    <span className="block text-sm font-medium text-[var(--text-secondary)]">No results found</span>
                    <span className="text-xs opacity-70">We couldn't find any stocks matching "{query}"</span>
                </div>
            </div>
        );
    }

    if (results.length === 0 && query.length < 2) {
        return (
            <div className="px-4 py-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Recent Search</h3>
                    <button className="text-[10px] text-[var(--accent-primary)] hover:underline">Clear</button>
                </div>
                <div className="text-center py-8 text-xs text-[var(--text-muted)] opacity-70">
                    Search for stocks to see them here
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {results.map((result) => (
                <SearchResultItem
                    key={result.token}
                    result={result}
                    onSelect={onSelect}
                    onAdd={onAdd}
                    onBuy={onBuy}
                    onSell={onSell}
                />
            ))}
        </div>
    );
};

export default SearchResultsList;
