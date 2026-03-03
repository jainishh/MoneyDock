import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Diamond } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Top 3 indices shown in navbar strip
const STRIP_TOKENS = [
    { token: '99926000', symbol: 'NIFTY', name: 'NIFTY 50', exch_seg: 'NSE' },
    { token: '99926009', symbol: 'BANKNIFTY', name: 'BANK NIFTY', exch_seg: 'NSE' },
    { token: '99919000', symbol: 'SENSEX', name: 'SENSEX', exch_seg: 'BSE' },
];

// Extended indices for dropdown
const ALL_INDEX_TOKENS = [
    ...STRIP_TOKENS,
    { token: '99926013', symbol: 'NIFTYNXT50', name: 'NIFTY NEXT 50', exch_seg: 'NSE' },
    { token: '99926037', symbol: 'INDIA VIX', name: 'INDIA VIX', exch_seg: 'NSE' },
    { token: '99926032', symbol: 'FINNIFTY', name: 'FIN NIFTY', exch_seg: 'NSE' },
    { token: '99926074', symbol: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', exch_seg: 'NSE' },
    { token: '99919006', symbol: 'BANKEX', name: 'BANKEX', exch_seg: 'BSE' },
];

const formatPrice = (val) => {
    if (!val) return '--';
    return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const MarketIndicesStrip = ({ variant = 'desktop' }) => {
    const [indices, setIndices] = useState([]);
    const [allIndices, setAllIndices] = useState(ALL_INDEX_TOKENS.map(idx => ({ ...idx, ltp: 0, change: 0, changePercent: 0 })));
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const intervalRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleIndexClick = (idx) => {
        setIsDropdownOpen(false);
        if (variant === 'mobile') {
            navigate('/trade/stock-details', { state: { stock: idx } });
        } else {
            navigate('/trade/watchlist', { state: { stock: idx } });
        }
    };

    const fetchIndicesData = async () => {
        try {
            const tokensToFetch = ALL_INDEX_TOKENS;
            const response = await fetch(`${API_BASE_URL}/api/angel/quotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokens: tokensToFetch })
            });
            const data = await response.json();

            if (data.success && data.data) {
                const merged = tokensToFetch.map(idx => {
                    const live = data.data.find(d => d.token === idx.token);
                    return {
                        ...idx,
                        ltp: live?.ltp || 0,
                        change: live?.netChange || live?.change || 0,
                        changePercent: live?.percentChange || live?.changePercent || 0,
                    };
                });
                // First 3 for strip
                setIndices(merged.slice(0, 3));
                // All for dropdown
                setAllIndices(merged);
            }
        } catch (err) {
            console.error('Failed to fetch indices:', err);
            const fallback = ALL_INDEX_TOKENS.map(idx => ({
                ...idx, ltp: 0, change: 0, changePercent: 0,
            }));
            setIndices(fallback.slice(0, 3));
            setAllIndices(fallback);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIndicesData();
        intervalRef.current = setInterval(fetchIndicesData, 30000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className={`flex items-center gap-6 ${variant === 'mobile' ? 'px-4 py-2 overflow-x-auto no-scrollbar' : ''}`}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={`flex items-center gap-3 ${variant === 'mobile' ? 'min-w-[140px]' : ''}`}>
                        <div className="h-3 w-14 bg-[var(--bg-card)] rounded animate-pulse" />
                        <div className="h-3 w-20 bg-[var(--bg-card)] rounded animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    // ─── MOBILE VARIANT (Card Style) ───
    if (variant === 'mobile') {
        return (
            <div className="p-4 pb-2">
                <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {allIndices.map(idx => {
                        const isUp = idx.change >= 0;
                        const exchange = idx.exch_seg === 'BSE' ? 'BSE' : 'NSE';
                        return (
                            <div
                                key={idx.token}
                                onClick={() => handleIndexClick(idx)}
                                className="min-w-[200px] p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] flex flex-col justify-between shadow-sm cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-[var(--text-secondary)] text-sm">{idx.symbol}</span>
                                    <span className="font-bold text-[var(--text-secondary)] text-sm">{formatPrice(idx.ltp)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-[#868993] font-medium">{exchange}</span>
                                    <span className={`text-[10px] font-medium ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                        {isUp ? '+' : ''}{idx.change.toFixed(2)} ({isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ─── DESKTOP VARIANT ───
    return (
        <div className="flex items-center text-sm relative" ref={dropdownRef}>
            {/* Indices Strip with Dividers */}
            {indices.map((idx, i) => {
                const isUp = idx.change >= 0;
                return (
                    <React.Fragment key={idx.token}>
                        <div
                            className="flex flex-col leading-tight px-4 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleIndexClick(idx)}
                        >
                            <span className="font-semibold text-[var(--text-secondary)] text-[13px]">{idx.symbol}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`font-bold text-[13px] ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {formatPrice(idx.ltp)}
                                </span>
                                <span className={`text-[11px] ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {isUp ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} ({Math.abs(idx.changePercent).toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                        {/* Divider line between indices */}
                        {i < indices.length - 1 && (
                            <div className="h-8 w-px bg-[var(--border-primary)]" />
                        )}
                    </React.Fragment>
                );
            })}

            {/* Dropdown Toggle Button */}
            <div className="ml-3">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${isDropdownOpen
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                        : 'border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'
                        } cursor-pointer`}
                >
                    <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Dropdown Panel */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-[420px] bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-[200] overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--border-primary)]">
                        <span className="text-sm font-bold text-[var(--text-secondary)]">Indices List</span>
                    </div>

                    {/* Indices List */}
                    <div className="max-h-[400px] overflow-y-auto customscrollbar">
                        {allIndices.map(idx => {
                            const isUp = idx.change >= 0;
                            return (
                                <div
                                    key={idx.token}
                                    onClick={() => handleIndexClick(idx)}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-primary)]/30 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Diamond size={10} className="text-[var(--accent-primary)] fill-[var(--accent-primary)]" />
                                        <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{idx.symbol}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[13px] font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                            {formatPrice(idx.ltp)}
                                        </span>
                                        <span className={`text-[11px] ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                            {isUp ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} ({Math.abs(idx.changePercent).toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketIndicesStrip;
