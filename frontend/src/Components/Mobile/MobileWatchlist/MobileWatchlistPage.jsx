import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileWatchlist from './MobileWatchlist';
import useAngelOneSocket from '../../../Hooks/useAngelOneSocket';
import CreateWatchlistModal from '../../Common/CreateWatchlistModal';
import WatchlistContextMenu from '../../Common/WatchlistContextMenu';
import RenameWatchlistModal from '../../Common/RenameWatchlistModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MobileWatchlistPage = () => {
    const navigate = useNavigate();
    const { stocks, isConnected, error, addStock: socketAddStock } = useAngelOneSocket() || {}; // Use hook for socket/connection status

    const [watchlists, setWatchlists] = useState([]);
    const [activeWatchlist, setActiveWatchlistState] = useState(null);
    const [activeStocks, setActiveStocks] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Wrap setActiveWatchlist to also persist in localStorage
    const setActiveWatchlist = (wl) => {
        setActiveWatchlistState(wl);
        if (wl?._id) {
            localStorage.setItem('activeWatchlistId', wl._id);
        }
    };

    // Helper: get auth config from stored userInfo
    const getAuthConfig = () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo?.token) return null;
            return { headers: { Authorization: `Bearer ${userInfo.token}` } };
        } catch { return null; }
    };

    // Fetch watchlists
    useEffect(() => {
        fetchWatchlists();
    }, []);

    const fetchWatchlists = async () => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const res = await axios.get(`${API_BASE_URL}/api/watchlist/getAllWatchlists`, config);
            setWatchlists(res.data);
            if (res.data.length > 0 && !activeWatchlist) {
                // Restore previously active watchlist from localStorage
                const savedId = localStorage.getItem('activeWatchlistId');
                const saved = savedId && res.data.find(w => w._id === savedId);
                setActiveWatchlist(saved || res.data[0]);
            }
        } catch (error) {
            console.error("Error fetching watchlists", error);
        }
    };

    // Fetch stocks for active watchlist
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

            // Fetch live quotes for these instruments
            try {
                const { fetchStockQuotes } = await import('../../../services/angelOneService');
                const liveData = await fetchStockQuotes(instruments);

                // Merge live data into instruments
                const merged = instruments.map(inst => {
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
                setActiveStocks(merged);

                // Register these stocks with the socket hook
                if (socketAddStock) {
                    merged.forEach(inst => {
                        socketAddStock(inst);
                    });
                }
            } catch (quoteErr) {
                console.error("Error fetching live quotes, showing static data", quoteErr);
                setActiveStocks(instruments);
            }
        } catch (error) {
            console.error("Error fetching stocks", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sync activeStocks with real-time 'stocks' from hook
    useEffect(() => {
        if (!activeStocks || activeStocks.length === 0 || !stocks) return;

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

    const handleCreateWatchlist = async (name) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            const res = await axios.post(`${API_BASE_URL}/api/watchlist/createWatchlist`, { name }, config);
            await fetchWatchlists();
            // Set the newly created watchlist as active
            setActiveWatchlist(res.data);
        } catch (error) {
            console.error("Error creating watchlist", error);
        }
    };

    // Add stock to active watchlist via backend API
    const handleAddStock = async (stock) => {
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

    const handleBuy = (stock) => {
        navigate('/trade/buy-order', { state: { stock } });
    };

    const handleSell = (stock) => {
        navigate('/trade/sell-order', { state: { stock } });
    };

    const handleSelect = (stock) => {
        navigate('/trade/stock-details', { state: { stock } });
    };

    const handleWatchlistChange = (list) => {
        setActiveWatchlist(list);
    }

    const [forceSearchOpen, setForceSearchOpen] = useState(false);

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null);

    const handleTabContextMenu = (e, list) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX || e.touches?.[0]?.clientX || 100, y: e.clientY || e.touches?.[0]?.clientY || 100, watchlist: list });
    };

    const handleDeleteWatchlist = async (watchlist) => {
        try {
            const config = getAuthConfig();
            if (!config) return;
            await axios.delete(`${API_BASE_URL}/api/watchlist/deleteWatchlist/${watchlist._id}`, config);
            await fetchWatchlists();
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
            if (activeWatchlist?._id === renameTarget._id) {
                setActiveWatchlist(res.data);
            }
        } catch (error) {
            console.error("Error renaming watchlist", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-main)]">
            <CreateWatchlistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateWatchlist}
            />
            {/* Header - Fixed/Non-scrolling */}
            <div className="flex-none z-10">
                <MobileHeader
                    onAddStock={handleAddStock}
                    onBuy={handleBuy}
                    onSell={handleSell}
                    onSelectStock={handleSelect}
                    watchlists={watchlists}
                    activeWatchlist={activeWatchlist}
                    onWatchlistChange={handleWatchlistChange}
                    onAddWatchlist={() => setIsCreateModalOpen(true)}
                    forceSearchOpen={forceSearchOpen}
                    onForceSearchOpenHandled={() => setForceSearchOpen(false)}
                    onTabContextMenu={handleTabContextMenu}
                />
            </div>

            {/* List - Scrollable */}
            <div className="flex-1 overflow-y-auto customscrollbar pb-20">
                {isLoading ? (
                    <div className="px-0">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-primary)]">
                                <div className="flex flex-col gap-2">
                                    <div className="h-3.5 w-28 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                    <div className="h-2.5 w-20 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="h-3.5 w-16 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                    <div className="h-2.5 w-20 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <MobileWatchlist
                        stocks={activeStocks}
                        isConnected={isConnected}
                        error={error}
                        onAddClick={() => setForceSearchOpen(true)}
                        watchlistName={activeWatchlist?.name || ''}
                    />
                )}
            </div>

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
};

export default MobileWatchlistPage;
