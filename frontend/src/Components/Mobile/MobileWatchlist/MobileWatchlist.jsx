import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyWatchlist from '../../Common/EmptyWatchlist';

const MobileWatchlist = ({ stocks = [], isConnected = false, error = null, onAddClick, watchlistName = '' }) => {
    const navigate = useNavigate();
    const longPressTimer = useRef(null);
    const isLongPress = useRef(false);

    console.log('MobileWatchlist render:', { stocks, isConnected, error });

    const handleTouchStart = useCallback(() => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            navigate('/trade/manage-stocks', { state: { stocks, watchlistName } });
        }, 500);
    }, [stocks, watchlistName, navigate]);

    const handleTouchEnd = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, []);

    const handleClick = useCallback((stock) => {
        if (!isLongPress.current) {
            navigate('/trade/stock-details', { state: { stock } });
        }
    }, [navigate]);

    return (
        <div className="md:hidden bg-[var(--bg-main)] pb-20 font-sans">
            {/* Connection Status */}
            {isConnected && !error && (
                <div className="px-4 py-2 bg-[#089981]/10 border-b border-[#089981]/20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#089981] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#089981]">LIVE - Market data streaming</span>
                </div>
            )}
            {error && (
                <div className="px-4 py-2 bg-[#f23645]/10 border-b border-[#f23645]/20">
                    <span className="text-xs text-[#f23645]">⚠️ {error}</span>
                </div>
            )}
            {!isConnected && !error && (
                <div className="px-4 py-2 bg-[var(--text-muted)]/10 border-b border-[var(--text-muted)]/20">
                    <span className="text-xs text-[var(--text-muted)]">🔄 Connecting to market data...</span>
                </div>
            )}

            {Array.isArray(stocks) && stocks.length > 0 ? (
                stocks.map((stock, index) => {
                    if (!stock || typeof stock !== 'object') return null;

                    const hasLiveData = stock.lastUpdated || (stock.price && stock.price !== 0 && stock.price !== "0");
                    const isUp = (stock.changePercent || 0) >= 0;

                    // Safe Parse Helpers
                    const safeFloat = (val) => {
                        const num = parseFloat(val);
                        return isNaN(num) ? 0 : num;
                    };

                    const price = safeFloat(stock.price || stock.ltp || 0);
                    const change = safeFloat(stock.change || 0);
                    const changePercent = safeFloat(stock.changePercent || 0);
                    const exchangeType = stock.exch_seg || 'NSE';

                    return (
                        <div
                            key={stock.token || stock.symbol || index}
                            onClick={() => handleClick(stock)}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchMove={handleTouchEnd}
                            className={`flex justify-between items-center px-4 py-3 border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer select-none ${!hasLiveData ? 'opacity-50' : ''}`}
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-[var(--text-secondary)] text-sm flex items-center gap-2">
                                    {stock.name || 'Unknown'}
                                    {stock.instrumenttype === 'FUTSTK' && (
                                        <span className="text-[8px] px-1.5 py-0.5 bg-[#f7931a]/20 text-[#f7931a] rounded">FUT</span>
                                    )}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                    {stock.symbol || stock.name} • {exchangeType}
                                </span>
                            </div>
                            <div className="text-right">
                                {hasLiveData ? (
                                    <>
                                        <div className={`font-semibold text-sm ${isUp ? 'text-[#089981]' : 'text-[#f23645]'} flex items-center gap-1 justify-end`}>
                                            <span>{price.toFixed(2)} {isUp ? "▲" : "▼"}</span>
                                        </div>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                            {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="font-semibold text-sm text-[var(--text-muted)]">
                                            --
                                        </div>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                            No data
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <EmptyWatchlist onAddClick={onAddClick} />
            )}
        </div>
    );
};

export default MobileWatchlist;
