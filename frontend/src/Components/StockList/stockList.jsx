import Tooltips from "./tooltips";
import React, { useState, useRef, useEffect } from "react";
import {
    Settings,
    X,
    Plus,
    Search,
    Filter,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import useAngelOneSocket from "../../Hooks/useAngelOneSocket";
import BuyWindow from "../Buy&SellWindow/BuyWindow/BuyWindow";
import SellWindow from "../Buy&SellWindow/SellWindow/SellWindow";
import MarketDepthWindow from "../Buy&SellWindow/MarketDepthWindow/MarketDepthWindow";
import SearchContainer from "./Search/SearchContainer";
import StockDetailsOverlay from "./StockDetailsOverlay";
import EmptyWatchlist from "../Common/EmptyWatchlist";
import CreateWatchlistModal from "../Common/CreateWatchlistModal";
import WatchlistContextMenu from "../Common/WatchlistContextMenu";
import RenameWatchlistModal from "../Common/RenameWatchlistModal";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function StockList() {
    const navigate = useNavigate();
    const location = useLocation();
    // Use the hook to get real-time stock data
    const { stocks, isConnected, error, addStock } = useAngelOneSocket();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [showBuyWindow, setShowBuyWindow] = useState(false);
    const [showSellWindow, setShowSellWindow] = useState(false);
    const [showMarketDepthWindow, setShowMarketDepthWindow] = useState(false);
    const [pinnedTokens, setPinnedTokens] = useState(new Set());

    // New Detail Window State
    const [showDetailsWindow, setShowDetailsWindow] = useState(false);
    const [selectedDetailStock, setSelectedDetailStock] = useState(null);

    const [watchlists, setWatchlists] = useState([]);
    const [activeStocks, setActiveStocks] = useState([]);
    const searchRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeWatchlist, setActiveWatchlist] = useState(null);

    // Helper: get auth config from stored userInfo
    const getAuthConfig = () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo?.token) return null;
            return { headers: { Authorization: `Bearer ${userInfo.token}` } };
        } catch { return null; }
    };

    const handleBuyClick = (stock) => {
        setSelectedStock(stock);
        setShowBuyWindow(true);
        setShowSellWindow(false);
        setShowMarketDepthWindow(false);
    };

    const handleSellClick = (stock) => {
        setSelectedStock(stock);
        setShowSellWindow(true);
        setShowBuyWindow(false);
        setShowMarketDepthWindow(false);
    };

    const handleMarketDepthClick = (stock) => {
        setSelectedStock(stock);
        setShowMarketDepthWindow(true);
        setShowBuyWindow(false);
        setShowSellWindow(false);
    };

    const handleStockSelect = (stock) => {
        setSelectedDetailStock(stock);
        setShowDetailsWindow(true);
    };

    const handleOptionChainClick = (stock) => {
        // On desktop, option chain is a tab inside TradeOne (at /trade/watchlist)
        // On mobile, it's its own route at /trade/option-chain
        navigate('/trade/watchlist', {
            state: {
                stock,
                initialTab: 'optionchain',
                underlyingName: stock.name || stock.symbol
            }
        });
    };

    const handlePinStock = (stock) => {
        const token = stock.token;
        const isPinned = pinnedTokens.has(token);
        if (isPinned) {
            // Unpin: remove from pinned set, move back to original position
            setPinnedTokens(prev => { const next = new Set(prev); next.delete(token); return next; });
            setActiveStocks(prev => {
                const others = prev.filter(s => s.token !== token);
                return [...others, stock]; // move to end (or keep as is)
            });
        } else {
            // Pin: add to pinned set, move to top
            setPinnedTokens(prev => new Set([...prev, token]));
            setActiveStocks(prev => {
                const filtered = prev.filter(s => s.token !== token);
                return [stock, ...filtered];
            });
        }
    };

    // Fetch all watchlists (names) on mount
    useEffect(() => {
        fetchWatchlists();
    }, []);

    const fetchWatchlists = async () => {
        setIsLoading(true);
        try {
            const config = getAuthConfig();
            if (!config) {
                setIsLoading(false);
                return;
            }
            const res = await axios.get(`${API_BASE_URL}/api/watchlist/getAllWatchlists`, config);
            console.log("Fetched watchlists:", res.data);
            setWatchlists(res.data || []);
            if (res.data && res.data.length > 0) {
                if (!activeWatchlist) {
                    setActiveWatchlist(res.data[0]); // Default to first
                }
            } else {
                setIsLoading(false); // Stop loading if no watchlists exist
            }
            // If activeWatchlist was already set (e.g. from state persistence), ensure it's valid?
        } catch (error) {
            console.error("Error fetching watchlists", error);
            setWatchlists([]);
            setIsLoading(false);
        }
    };

    // Fetch stocks when activeWatchlist changes
    useEffect(() => {
        if (activeWatchlist) {
            const name = activeWatchlist.name || activeWatchlist;
            if (typeof name === 'string') {
                fetchWatchlistStocks(name);
            }
        }
    }, [activeWatchlist]);

    const fetchWatchlistStocks = async (name) => {
        setIsLoading(true);
        try {
            const config = getAuthConfig();
            if (!config) return;
            const res = await axios.get(`${API_BASE_URL}/api/watchlist/${name}`, config);
            const instruments = res.data;

            if (instruments.length === 0) {
                setActiveStocks([]);
                return;
            }

            let mergedStocks = instruments;

            // 1. Fetch live quotes for these instruments (REST API for initial snapshot)
            try {
                const { fetchStockQuotes } = await import('../../services/angelOneService');
                const liveData = await fetchStockQuotes(instruments);

                // Merge live data into instruments
                if (liveData && Array.isArray(liveData)) {
                    mergedStocks = instruments.map(inst => {
                        const live = liveData.find(l => String(l.token) === String(inst.token));
                        if (live) {
                            return {
                                ...inst,
                                price: live.ltp || live.price || 0,
                                ltp: live.ltp || 0,
                                change: live.netChange || live.change || 0,
                                changePercent: live.percentChange || live.changePercent || 0,
                                open: live.open,
                                high: live.high,
                                low: live.low,
                                close: live.close,
                                lastUpdated: new Date().toISOString(),
                            };
                        }
                        return inst;
                    });
                }
            } catch (quoteErr) {
                console.error("Error fetching live quotes, showing static data", quoteErr);
            }

            // 2. Set initial state with (hopefully) populated data
            setActiveStocks(mergedStocks);

            // 3. Register these stocks with the socket hook to ensure subscription & future updates
            mergedStocks.forEach(inst => {
                // Determine if we should pass the merged data or just the instrument
                // addStock typically expects an object with { token, ... }
                // Giving it the merged stock is fine.
                addStock(inst);
            });

        } catch (error) {
            console.error("Error fetching stocks", error);
            // If API fails, we might still have some data in 'stocks' from socket if previously loaded? 
            // specific error handling
        } finally {
            setIsLoading(false);
        }
    };

    // Sync activeStocks with real-time 'stocks' from hook
    useEffect(() => {
        if (!activeStocks || activeStocks.length === 0) return;

        setActiveStocks(prevActiveStocks => {
            let hasUpdates = false;
            const nextStocks = prevActiveStocks.map(ast => {
                const live = stocks.find(s => String(s.token || s.symboltoken) === String(ast.token || ast.symboltoken));
                if (live && (live.ltp !== ast.ltp || live.change !== ast.change || live.lastUpdated !== ast.lastUpdated)) {
                    hasUpdates = true;
                    return { ...ast, ...live };
                }
                return ast;
            });

            return hasUpdates ? nextStocks : prevActiveStocks;
        });
    }, [stocks]);

    // Listen for watchlist-updated event from OptionChain (or anywhere)
    useEffect(() => {
        const handleWatchlistUpdated = async (e) => {
            const updatedWatchlistName = e.detail?.watchlistName;
            const currentName = activeWatchlist?.name || activeWatchlist;
            // Reload if the updated watchlist matches active one
            if (!updatedWatchlistName || updatedWatchlistName === currentName) {
                if (typeof currentName === 'string') {
                    await fetchWatchlistStocks(currentName);
                }
            }
        };
        window.addEventListener('watchlist-updated', handleWatchlistUpdated);
        return () => window.removeEventListener('watchlist-updated', handleWatchlistUpdated);
    }, [activeWatchlist]);



    // Add stock to active watchlist via backend API
    const handleAddStockToWatchlist = async (stock) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const watchlistName = activeWatchlist?.name || activeWatchlist;
            await axios.post(`${API_BASE_URL}/api/watchlist/addToWatchlist`, {
                stockId: stock._id,
                watchlistName: watchlistName,
            }, config);
            // Refresh the stock list after adding
            if (typeof watchlistName === 'string') {
                fetchWatchlistStocks(watchlistName);
            }
        } catch (error) {
            console.error("Error adding stock to watchlist", error);
        }
    };

    // Remove stock from active watchlist via backend API
    const handleRemoveStockFromWatchlist = async (stock) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const watchlistName = activeWatchlist?.name || activeWatchlist;
            await axios.delete(`${API_BASE_URL}/api/watchlist/removeFromWatchlist/${stock._id}?watchlistName=${watchlistName}`, config);
            // Refresh the stock list after removing
            if (typeof watchlistName === 'string') {
                fetchWatchlistStocks(watchlistName);
            }
        } catch (error) {
            console.error("Error removing stock from watchlist", error);
        }
    };

    const handleStockBuyFromDetails = (stock) => {
        setSelectedStock(stock);
        setShowBuyWindow(true);
        setShowSellWindow(false);
        setShowDetailsWindow(false);
    };

    const handleStockSellFromDetails = (stock) => {
        setSelectedStock(stock);
        setShowSellWindow(true);
        setShowBuyWindow(false);
        setShowDetailsWindow(false);
    };

    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(priceStr.toString().replace(/,/g, ''));
    };

    const parsePercent = (percentStr) => {
        if (!percentStr) return 0;
        return parseFloat(percentStr.toString().replace('%', ''));
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateWatchlist = async (name) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const res = await axios.post(`${API_BASE_URL}/api/watchlist/createWatchlist`, { name }, config);
            await fetchWatchlists();
            setActiveWatchlist(res.data);
        } catch (error) {
            console.error("Error creating watchlist", error);
        }
    };

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null); // { x, y, watchlist }
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null);

    const handleTabRightClick = (e, list) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, watchlist: list });
    };

    const handleDeleteWatchlist = async (watchlist) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            await axios.delete(`${API_BASE_URL}/api/watchlist/deleteWatchlist/${watchlist._id}`, config);
            await fetchWatchlists();
            // If deleted the active one, switch to first available
            if (activeWatchlist?._id === watchlist._id) {
                setActiveWatchlist(null);
            }
        } catch (error) {
            console.error("Error deleting watchlist", error);
        }
    };

    const handleRenameWatchlist = async (newName) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const res = await axios.put(`${API_BASE_URL}/api/watchlist/renameWatchlist/${renameTarget._id}`, { name: newName }, config);
            await fetchWatchlists();
            // If renamed the active one, update it
            if (activeWatchlist?._id === renameTarget._id) {
                setActiveWatchlist(res.data);
            }
        } catch (error) {
            console.error("Error renaming watchlist", error);
        }
    };


    return (
        <div className="bg-[var(--bg-main)] w-full h-full flex flex-col text-[var(--text-secondary)] font-sans relative">
            <CreateWatchlistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateWatchlist}
            />
            {/* Windows Layer */}
            {showBuyWindow && selectedStock && (
                <BuyWindow
                    uid={selectedStock.token}
                    stockName={selectedStock.name}
                    stockSymbol={selectedStock.symbol}
                    stockPrice={parsePrice(selectedStock.price)}
                    stockChange={parseFloat(selectedStock.change || 0)}
                    stockChangePercent={parsePercent(selectedStock.changePercent || selectedStock.percent || 0)}
                    onClose={() => setShowBuyWindow(false)}
                    onSwitchToSell={() => handleSellClick(selectedStock)}
                />
            )}
            {showSellWindow && selectedStock && (
                <SellWindow
                    uid={selectedStock.token}
                    stockName={selectedStock.name}
                    stockSymbol={selectedStock.symbol}
                    stockPrice={parsePrice(selectedStock.price)}
                    stockChange={parseFloat(selectedStock.change || 0)}
                    stockChangePercent={parsePercent(selectedStock.changePercent || selectedStock.percent || 0)}
                    onClose={() => setShowSellWindow(false)}
                    onSwitchToBuy={() => handleBuyClick(selectedStock)}
                />
            )}
            {showMarketDepthWindow && selectedStock && (
                <MarketDepthWindow
                    uid={selectedStock.token}
                    stockName={selectedStock.name || selectedStock.symbol}
                    stockSymbol={selectedStock.symbol}
                    stockPrice={parsePrice(selectedStock.price || selectedStock.ltp)}
                    stockChange={parseFloat(selectedStock.change || 0)}
                    stockChangePercent={parsePercent(selectedStock.changePercent || selectedStock.percent || 0)}
                    onClose={() => setShowMarketDepthWindow(false)}
                />
            )}

            {/* Stock Details Overlay */}
            {showDetailsWindow && selectedDetailStock && (
                <StockDetailsOverlay
                    stock={selectedDetailStock}
                    onClose={() => setShowDetailsWindow(false)}
                    onBuy={handleStockBuyFromDetails}
                    onSell={handleStockSellFromDetails}
                />
            )}

            {/* 1. Header (Fixed) */}
            <div className="flex-none">
                <div className="flex items-center justify-between p-3 border-b border-[var(--border-primary)]">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Watchlist</span>
                        {/* Connection Status Indicator */}
                        <span className={`text-[10px] px-2 py-0.5 rounded ${isConnected
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {isConnected ? '● LIVE' : '○ Connecting...'}
                        </span>
                    </div>
                    <div className="flex gap-3 text-[var(--text-muted)]">
                        {error && (
                            <span className="text-[10px] text-red-400">{error}</span>
                        )}
                        <Filter size={18} className="cursor-pointer hover:text-[var(--text-primary)]" />
                        <Settings size={18} className="cursor-pointer hover:text-[var(--text-primary)]" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between px-3 py-2 text-[13px] border-b border-[var(--border-primary)]">
                    <div className="flex overflow-x-auto customscrollbar-thin gap-4 flex-1">
                        {watchlists?.map((list) => (
                            <span
                                key={list?._id || list}
                                onClick={() => setActiveWatchlist(list)}
                                onContextMenu={(e) => handleTabRightClick(e, list)}
                                className={`pb-2 cursor-pointer whitespace-nowrap border-b-2 transition-colors ${(activeWatchlist?._id === list?._id || activeWatchlist === list)
                                    ? "text-[var(--accent-primary)] border-[var(--accent-primary)]"
                                    : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                {list?.name || list}
                            </span>
                        ))}
                    </div>
                    <div className="pl-3 border-l border-[var(--border-primary)] shrink-0">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] p-1 cursor-pointer"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <SearchContainer
                    ref={searchRef}
                    onAddStock={handleAddStockToWatchlist}
                    onSelectStock={handleStockSelect}
                    onBuy={handleBuyClick}
                    onSell={handleSellClick}
                />
            </div>

            {/* 2. Scrollable List Area (Ye portion scroll hoga) */}
            <div className="flex-1 overflow-y-auto customscrollbar">
                {/* Use activeStocks if available (from DB), else fallback to socket stocks if intended. 
                    Actually, if we want to show the WATCHLIST stocks, we must use activeStocks.
                    But activeStocks might lack live data properties if not merged.
                    For now, let's render activeStocks and rely on whatever properties used.
                */}
                {isLoading ? (
                    <div className="px-0">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center px-4 py-2.5 border-b border-[var(--border-primary)]/30">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-24 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                    <div className="h-2.5 w-10 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="h-3 w-16 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                    <div className="h-2.5 w-20 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeStocks && activeStocks.length > 0 ? (
                    activeStocks.map((stock, index) => {
                        if (!stock || typeof stock !== 'object') return null;

                        const hasLiveData = stock.lastUpdated || (stock.price && stock.price !== 0);
                        const isUp = (stock.changePercent || 0) >= 0;
                        const price = stock.price || stock.ltp || 0;
                        const change = stock.change || 0;
                        const changePercent = stock.changePercent || 0;
                        const exchangeType = stock.exch_seg || 'NSE';

                        return (
                            <div
                                key={stock.token || index}
                                className="relative flex justify-between items-center px-4 py-2.5 hover:bg-[var(--bg-secondary)] cursor-pointer border-b border-[var(--border-primary)]/50"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    console.log('Stock clicked:', stock.symbol);
                                    navigate('/trade/watchlist', { state: { stock } });
                                }}
                            >
                                {hoveredIndex === index && (
                                    <div
                                        className={`absolute left-1/2 transform -translate-x-1/2 z-50 ${index === 0 ? "top-8" : "-top-7"
                                            }`}
                                    >
                                        <Tooltips
                                            position={index === 0 ? "bottom" : "top"}
                                            onBuy={() => handleBuyClick(stock)}
                                            onSell={() => handleSellClick(stock)}
                                            onMarketDepth={() => handleMarketDepthClick(stock)}
                                            onDelete={() => handleRemoveStockFromWatchlist(stock)}
                                            onOptionChain={() => handleOptionChainClick(stock)}
                                            onPin={() => handlePinStock(stock)}
                                            isPinned={pinnedTokens.has(stock.token)}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[13px] flex items-center gap-2">
                                            {stock.symbol || stock.name}
                                            {stock.instrumenttype === 'FUTSTK' && (
                                                <span className="text-[8px] px-1.5 py-0.5 bg-[#f7931a]/20 text-[#f7931a] rounded">FUT</span>
                                            )}
                                        </span>
                                        <span className="text-[10px] text-[var(--text-muted)]">{exchangeType}</span>
                                        {stock.lastUpdated && (
                                            <Sparkles size={12} className="text-[#089981] animate-pulse" />
                                        )}
                                    </div>
                                    {stock.name && stock.name !== stock.symbol && (
                                        <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">
                                            {stock.name}
                                        </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    {hasLiveData ? (
                                        <>
                                            <div
                                                className={`text-[13px] font-bold ${isUp ? "text-[#089981]" : "text-[#f23645]"}`}
                                            >
                                                {typeof price === 'number' ? price.toFixed(2) : '0.00'} {isUp ? "▲" : "▼"}
                                            </div>
                                            <div className="text-[11px] text-[var(--text-muted)]">
                                                {typeof change === 'number' ? change.toFixed(2) : '0.00'} ({typeof changePercent === 'number' ? changePercent.toFixed(2) : '0.00'}%)
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[13px] font-bold text-[var(--text-muted)]">
                                                --
                                            </div>
                                            <div className="text-[11px] text-[var(--text-muted)]">
                                                No data
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <EmptyWatchlist
                        hasWatchlists={watchlists && watchlists.length > 0}
                        onCreateClick={() => setIsCreateModalOpen(true)}
                        onAddClick={() => {
                            if (searchRef.current) {
                                searchRef.current.openSearch();
                            }
                        }}
                    />
                )}
            </div>

            {/* 3. Footer (Always Fixed at Bottom) */}
            {/* <div className="flex-none p-3 border-t border-[#2a2e39] bg-[#131722] flex justify-between items-center text-[#2962ff] text-[11px] font-bold hover:bg-[#1e222d] cursor-pointer">
        <span>OPTIONS QUICK LIST</span>
        <ChevronRight size={16} className="bg-[#2a2e39] rounded-full" />
      </div> */}

            {/* Context Menu */}
            {contextMenu && (
                <WatchlistContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onRename={() => {
                        setRenameTarget(contextMenu.watchlist);
                        setIsRenameModalOpen(true);
                    }}
                    onDelete={() => handleDeleteWatchlist(contextMenu.watchlist)}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Rename Modal */}
            <RenameWatchlistModal
                isOpen={isRenameModalOpen}
                onClose={() => { setIsRenameModalOpen(false); setRenameTarget(null); }}
                onRename={handleRenameWatchlist}
                currentName={renameTarget?.name || ''}
            />
        </div>
    );
}

export default StockList;
