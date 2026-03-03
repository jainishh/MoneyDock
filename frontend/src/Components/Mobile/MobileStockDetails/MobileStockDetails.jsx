import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, BarChart2, Info, ArrowUpRight, ArrowDownRight, Link, CandlestickChart, AlignLeft, Maximize2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MarketDepthBottomSheet from './MarketDepthBottomSheet/MarketDepthBottomSheet';
import MarketIndicesStrip from '../../Common/MarketIndicesStrip';
import TradingViewChart from '../../Chart/TradingViewChart';

const MobileStockDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stock = location.state?.stock || {
        name: "COALINDIA",
        exchange: "NSE",
        fullName: "COAL INDIA LTD",
        price: "408.95",
        change: "10.20",
        percent: "2.43",
        isUp: false // Based on screenshot red color
    };

    const fromOptionChain = location.state?.fromOptionChain || false;

    const [timeRange, setTimeRange] = useState('1m');
    const [activeRatioPage, setActiveRatioPage] = useState(0);
    const [isMarketDepthOpen, setIsMarketDepthOpen] = useState(false);

    const { showToast } = useToast();
    const [allWatchlists, setAllWatchlists] = useState([]);
    const [showWatchlistPicker, setShowWatchlistPicker] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo?.token) return;
        fetch('/api/watchlist/getAllWatchlists', { headers: { Authorization: `Bearer ${userInfo.token}` } })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAllWatchlists(data); })
            .catch(() => { });
    }, []);

    // Check if current stock exists in any watchlist
    const isStarred = allWatchlists.some(wl =>
        wl.stocks?.some(s => s.token === stock.token)
    );

    const handleToggleWatchlist = (watchlistName, inList = false) => {
        setShowWatchlistPicker(false);
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const authToken = userInfo?.token;
        if (!authToken) { showToast('Please login first', false); return; }

        const endpoint = inList ? '/api/watchlist/removeByToken' : '/api/watchlist/addByToken';

        // If removing from all (star click when already starred)
        const body = { token: stock.token };
        if (watchlistName !== 'ALL') body.watchlistName = watchlistName;

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ token: stock.token, watchlistName: watchlistName === 'ALL' ? undefined : watchlistName })
        }).then(r => r.json()).then(res => {
            if (res.success) {
                if (inList) {
                    showToast(`✓ Removed from ${watchlistName === 'ALL' ? 'Watchlists' : watchlistName}`);
                    setAllWatchlists(prev => prev.map(wl =>
                        (watchlistName === 'ALL' || wl.name === watchlistName)
                            ? { ...wl, stocks: (wl.stocks || []).filter(s => s.token !== stock.token) }
                            : wl
                    ));
                } else {
                    showToast(`✓ Added to "${watchlistName}"`);
                    setAllWatchlists(prev => prev.map(wl =>
                        wl.name === watchlistName ? { ...wl, stocks: [{ token: stock.token }, ...(wl.stocks || [])] } : wl
                    ));
                }
                window.dispatchEvent(new CustomEvent('watchlist-updated', { detail: { watchlistName } }));
            } else {
                showToast(res.message || 'Action failed', false);
            }
        }).catch(e => { console.error(e); showToast('Request failed', false); });
    };

    const marketStats = [
        { label: "Market Cap", value: "Rs 2,56,123 Cr" },
        { label: "1 year Return", value: "+ 47.3 (13.08%)", isGreen: true },
        { label: "Sector Return", value: "+ 12.74 (18.78%)", isGreen: true },
        { label: "Market Return", value: "+ 2439.70 (10.59%)", isGreen: true },
    ];

    const fundamentalRatiosPage1 = [
        { label: "PE Ratio", value: "8.44" },
        { label: "Price to Book Value", value: "2.39" },
        { label: "EV to EBIT", value: "7.55" },
        { label: "EV to EBITDA", value: "5.68" },
        { label: "EV to Capital Employed", value: "2.77" },
    ];

    const fundamentalRatiosPage2 = [
        { label: "EV to Sales", value: "1.65" },
        { label: "PEG Ratio", value: "0" },
        { label: "Dividend Yield", value: "5.12%" },
        { label: "ROCE (Latest)", value: "40.03%" },
        { label: "ROE (Latest)", value: "29.62%" },
    ];

    const currentRatios = activeRatioPage === 0 ? fundamentalRatiosPage1 : fundamentalRatiosPage2;

    const intervalMappings = {
        '1m': 'ONE_MINUTE',
        '5m': 'FIVE_MINUTE',
        '15m': 'FIFTEEN_MINUTE',
        '30m': 'THIRTY_MINUTE',
        '1h': 'ONE_HOUR',
        '1d': 'ONE_DAY',
    };


    return (
        <div className="h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-[var(--text-primary)] text-lg font-bold">{stock.name}</h1>
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase">{stock.exchange}</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (isStarred) {
                            handleToggleWatchlist('ALL', true);
                        } else {
                            setShowWatchlistPicker(true);
                        }
                    }}
                    className="transition-colors"
                >
                    <Star size={20} className={isStarred ? "text-[#f0b90b] fill-[#f0b90b]" : "text-[var(--text-muted)]"} />
                </button>
            </div>

            {/* Live Market Indices */}
            <MarketIndicesStrip variant="mobile" />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto customscrollbar pb-24">
                {/* Price Section */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">₹{stock.price}</div>
                            <div className={`text-xs font-bold flex items-center gap-1 ${stock.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                {stock.change} ({stock.percent}%)
                                {stock.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span className="text-[var(--text-muted)] ml-1 font-medium">Today</span>
                            </div>
                        </div>
                        {!fromOptionChain && (
                            <button
                                onClick={() => navigate('/trade/option-chain', { state: { stock } })}
                                className="flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded text-xs font-bold text-[var(--accent-primary)]"
                            >
                                <Link size={12} /> Option Chain
                            </button>
                        )}
                    </div>

                    {/* Real-time Chart Section */}
                    <div className="h-64 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] mb-4 relative overflow-hidden shadow-inner group/chart">
                        <TradingViewChart
                            stock={stock}
                            interval={intervalMappings[timeRange] || 'FIVE_MINUTE'}
                        />

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => navigate('/trade/chart', { state: { stock } })}
                            className="absolute bottom-3 right-3 p-2 bg-[var(--bg-card)]/90 backdrop-blur-md rounded-lg border border-[var(--border-primary)] text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
                            title="Fullscreen Chart"
                        >
                            <Maximize2 size={16} />
                        </button>
                    </div>

                    {/* Time Range Tabs & Chart Controls */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex-1 flex justify-between bg-[var(--bg-card)] p-1 rounded-lg">
                            {['1m', '5m', '15m', '30m', '1h', '1d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`text-[10px] font-bold py-1.5 px-2 rounded whitespace-nowrap ${timeRange === range
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Buttons */}
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => navigate('/trade/chart', { state: { stock } })}
                                className="bg-[var(--bg-secondary)] p-1.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                            >
                                <CandlestickChart size={18} />
                            </button>
                            <button
                                onClick={() => setIsMarketDepthOpen(true)}
                                className="bg-[var(--bg-secondary)] p-1.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                            >
                                <AlignLeft size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Market Stats */}
                    <div className="mb-6">
                        <h3 className="text-[var(--text-primary)] text-sm font-bold mb-3">Market Stats</h3>
                        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
                            {marketStats.map((stat, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border-b border-[var(--border-primary)] last:border-0">
                                    <span className="text-xs font-medium text-[var(--text-secondary)]">{stat.label}</span>
                                    <span className={`text-xs font-bold ${stat.isGreen ? 'text-[#089981]' : 'text-[var(--text-primary)]'}`}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fundamental Ratios */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[var(--text-primary)] text-sm font-bold">Fundamental Ratios</h3>
                            <Info size={14} className="text-[var(--accent-primary)]" />
                        </div>
                        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] overflow-hidden min-h-[220px] flex flex-col justify-between">
                            <div>
                                {currentRatios.map((ratio, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b border-[var(--border-primary)] last:border-0 border-opacity-50">
                                        <span className="text-xs font-medium text-[var(--text-secondary)]">{ratio.label}</span>
                                        <span className="text-xs font-bold text-[var(--text-primary)]">{ratio.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Dots */}
                            <div className="flex justify-center items-center gap-2 p-3">
                                <button
                                    onClick={() => setActiveRatioPage(0)}
                                    className={`w-2 h-2 rounded-full transition-colors ${activeRatioPage === 0 ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-primary)]'}`}
                                />
                                <button
                                    onClick={() => setActiveRatioPage(1)}
                                    className={`w-2 h-2 rounded-full transition-colors ${activeRatioPage === 1 ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-primary)]'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex gap-4 z-50">
                <button
                    onClick={() => navigate('/trade/buy-order', { state: { stock } })}
                    className="flex-1 bg-[#089981] hover:bg-[#067a67] text-white py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors"
                >
                    BUY
                </button>
                <button
                    onClick={() => navigate('/trade/sell-order', { state: { stock } })}
                    className="flex-1 bg-[#f23645] hover:bg-[#c92a37] text-white py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors"
                >
                    SELL
                </button>
            </div>

            <MarketDepthBottomSheet
                isOpen={isMarketDepthOpen}
                onClose={() => setIsMarketDepthOpen(false)}
                stock={stock}
            />

            {/* ── Watchlist Picker Bottom Sheet ── */}
            {showWatchlistPicker && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWatchlistPicker(false)}></div>
                    <div className="relative bg-[var(--bg-secondary)] w-full rounded-t-2xl p-5 border-t border-[var(--border-primary)] shadow-2xl animate-slide-up pb-8">
                        <div className="w-12 h-1.5 bg-[var(--border-primary)] rounded-full mx-auto mb-4"></div>
                        <h3 className="text-[var(--text-primary)] font-bold text-lg mb-4 text-center">Add to Watchlist</h3>

                        {allWatchlists.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] py-6 text-sm">No watchlists found. Please create one first on the Watchlist tab.</div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto customscrollbar mb-2 px-1">
                                {allWatchlists.map(wl => {
                                    const inList = wl.stocks?.some(s => s.token === stock.token);
                                    return (
                                        <button
                                            key={wl._id}
                                            onClick={() => handleToggleWatchlist(wl.name, inList)}
                                            className={`flex items-center justify-between text-left text-sm px-4 py-3.5 rounded-xl border ${inList ? 'border-[var(--border-primary)] bg-[var(--bg-main)] hover:border-[#f23645] hover:text-[#f23645]' : 'border-transparent bg-[var(--bg-card)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)]'} transition-all`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">📋</span>
                                                <span className="font-semibold">{wl.name}</span>
                                            </div>
                                            {inList && <span className="text-[10px] text-[#f23645] font-bold px-2 py-0.5 border border-[#f23645] rounded-full">REMOVE</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileStockDetails;
