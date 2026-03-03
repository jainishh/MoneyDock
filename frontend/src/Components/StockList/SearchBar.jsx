import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, ArrowLeft } from "lucide-react";
import { searchInstrumentsAPI } from "../../services/angelOneService";

const SearchBar = ({ onAddStock, onSelectStock, onBuy, onSell }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Recent searches could be stored in localStorage
    const [recentSearches, setRecentSearches] = useState([]);

    const searchTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsFocused(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearch = (val) => {
        setQuery(val);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (val.length >= 2) {
            setIsLoading(true);
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const data = await searchInstrumentsAPI(val);
                    setResults(data || []);
                } catch (error) {
                    console.error("Search failed:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        } else {
            setResults([]);
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
    };

    const closeSearch = () => {
        setIsFocused(false);
        setQuery("");
        setResults([]);
    };

    const handleSelect = (stock) => {
        onSelectStock(stock);
        setIsFocused(false);
    };

    return (
        <>
            {/* Search Input Area */}
            <div className="p-3 relative z-[100]" ref={containerRef}>
                <div className={`flex items-center bg-[var(--bg-secondary)] rounded-md px-3 py-2 border transition-colors ${isFocused ? 'border-[var(--accent-primary)]' : 'border-[var(--border-primary)]'}`}>
                    {isFocused ? (
                        <ArrowLeft
                            size={18}
                            className="text-[var(--text-secondary)] mr-3 cursor-pointer hover:text-[var(--text-primary)]"
                            onClick={closeSearch}
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
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                    />

                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                    ) : query ? (
                        <button onClick={clearSearch} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <X size={16} />
                        </button>
                    ) : !isFocused && (
                        <span className="text-[var(--text-muted)] text-[10px] px-1.5 py-0.5 border border-[var(--border-primary)] rounded bg-[var(--border-primary)]/20">
                            CTRL+K
                        </span>
                    )}
                </div>
            </div>

            {/* Full Screen Overlay Results */}
            {isFocused && (
                <div className="absolute top-[60px] left-0 right-0 bottom-0 bg-[var(--bg-main)] z-[90] overflow-y-auto customscrollbar border-t border-[var(--border-primary)]">
                    {/* Navigation Tabs (Indices, Cash, F&O) - Mock visual only */}
                    <div className="sticky top-0 bg-[var(--bg-main)] z-10 px-4 pt-2 border-b border-[var(--border-primary)] flex gap-6 text-sm font-medium text-[var(--text-muted)] mb-2">
                        <span className="text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] pb-2 cursor-pointer">All</span>
                        <span className="pb-2 cursor-pointer hover:text-[var(--text-secondary)]">Indices</span>
                        <span className="pb-2 cursor-pointer hover:text-[var(--text-secondary)]">Cash</span>
                        <span className="pb-2 cursor-pointer hover:text-[var(--text-secondary)]">F&O</span>
                        <span className="pb-2 cursor-pointer hover:text-[var(--text-secondary)]">MF</span>
                    </div>

                    <div className="pb-20">
                        {results.length > 0 ? (
                            results.map((result) => (
                                <div
                                    key={result.token}
                                    className="group px-4 py-3 hover:bg-[var(--bg-secondary)] cursor-pointer flex justify-between items-center border-b border-[var(--border-primary)]/30 last:border-none transition-colors"
                                    onClick={() => handleSelect(result)}
                                >
                                    {/* Left: Symbol Info */}
                                    <div className="flex items-center gap-3">
                                        {/* EQ Badge / Avatar */}
                                        <div className="w-8 h-8 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[10px] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold">
                                            EQ
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                                                    {result.name}
                                                </span>
                                                <span className="text-[9px] bg-[var(--bg-secondary)] text-[var(--text-muted)] px-1 py-0.5 rounded leading-none">
                                                    {result.exch_seg}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate max-w-[180px]">
                                                {result.symbol} {/* Showing symbol as company name description fallback */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-7 h-7 flex items-center justify-center bg-[#089981]/10 text-[#089981] hover:bg-[#089981] hover:text-white rounded transition-all font-bold text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBuy(result);
                                            }}
                                            title="Buy"
                                        >
                                            B
                                        </button>
                                        <button
                                            className="w-7 h-7 flex items-center justify-center bg-[#f23645]/10 text-[#f23645] hover:bg-[#f23645] hover:text-white rounded transition-all font-bold text-xs"
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
                                                onAddStock(result);
                                            }}
                                            title="Add to Watchlist"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : query.length >= 2 && !isLoading ? (
                            <div className="p-12 text-center text-[var(--text-muted)] flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center opacity-50">
                                    <Search size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-[var(--text-primary)]">No results found</span>
                                    <span className="text-xs opacity-70">We couldn't find any stocks matching "{query}"</span>
                                </div>
                            </div>
                        ) : (
                            // Recent History Mock
                            !isLoading && (
                                <div className="px-4 py-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Recent Search</h3>
                                        <button className="text-[10px] text-[var(--accent-primary)] hover:underline">Clear</button>
                                    </div>
                                    <div className="text-center py-8 text-xs text-[var(--text-muted)] opacity-70">
                                        Search for stocks to see them here
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBar;
