import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PositionsTable from './components/PositionsTable';
import useAngelOneSocket from '../../../Hooks/useAngelOneSocket';
import BuyWindow from '../../../Components/Buy&SellWindow/BuyWindow/BuyWindow';
import SellWindow from '../../../Components/Buy&SellWindow/SellWindow/SellWindow';

function Positions() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchPositions = useCallback(async () => {
        setLoading(true);
        try {
            const userInfo = localStorage.getItem("userInfo");
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user ? user._id : null;

            if (!userId) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/position/?userId=${userId}`);
            const data = await response.json();

            if (data.success) {
                // Filter to only show F&O positions that are currently OPEN (netQty != 0)
                const fnoPositions = data.data.filter(pos =>
                    (pos.netQty !== 0) && (
                        pos.exchange === 'NFO' ||
                        pos.exchange === 'BFO' ||
                        pos.exchange === 'MCX' ||
                        pos.exchange === 'CDS' ||
                        pos.tradingsymbol?.includes('CE') ||
                        pos.tradingsymbol?.includes('PE')
                    )
                );
                setPositions(fnoPositions);
            } else {
                setError(data.message || "Failed to fetch positions");
            }
        } catch (err) {
            console.error("Positions Fetch Error:", err);
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);

    const [actionState, setActionState] = useState({ type: null, stock: null });

    const handleAction = (type, posRaw) => {
        setActionState({
            type,
            stock: {
                token: posRaw.symboltoken,
                name: posRaw.tradingsymbol,
                symbol: posRaw.tradingsymbol,
                exch_seg: posRaw.exchange || 'NSE',
                price: posRaw.ltp || posRaw.avgPrice || 0,
                change: 0,
                percent: 0,
                isUp: true
            }
        });
    };

    const handleWindowClose = () => {
        setActionState({ type: null, stock: null });
        // Refetch to hide position if it hit 0 qty
        setTimeout(() => fetchPositions(), 1500);
    };

    // Memoize stocks for socket subscription
    const dynamicStocks = useMemo(() => {
        return positions.map(pos => ({
            token: pos.symboltoken,
            tradingsymbol: pos.tradingsymbol,
            exchange: pos.exchange || 'NSE'
        }));
    }, [positions]);

    // Get live prices
    const { stocks: liveStocks } = useAngelOneSocket(dynamicStocks);

    // Calculate live P&L and enrich positions
    const { livePositions, totalPnl, totalInvestment } = useMemo(() => {
        let totalPnlSum = 0;
        let totalInvSum = 0;

        const enriched = positions.map(pos => {
            const live = liveStocks.find(l => (l.token === pos.symboltoken || l.symboltoken === pos.symboltoken));
            const ltp = live?.ltp || pos.avgPrice || 0;

            // Unrealized P&L = (Current Price - Average Price) * Net Quantity
            const unrealizedPnl = (ltp - pos.avgPrice) * pos.netQty;
            const itemRealizedPnl = pos.realizedPnl || 0;
            const itemTotalPnl = itemRealizedPnl + unrealizedPnl;

            totalPnlSum += itemTotalPnl;
            totalInvSum += (pos.buyValue || 0);

            return {
                ...pos,
                ltp,
                unrealizedPnl,
                totalPnl: itemTotalPnl,
                isPnlPositive: itemTotalPnl >= 0
            };
        });

        return {
            livePositions: enriched,
            totalPnl: totalPnlSum,
            totalInvestment: totalInvSum
        };
    }, [positions, liveStocks]);

    const totalPnlPercent = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;
    const isTotalPnlPositive = totalPnl >= 0;

    return (
        <div className="h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans">
            {/* Top Summary Banner */}
            <div className="flex-none p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex justify-between md:block">
                        <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase mb-1">Total P&L</div>
                        <div className={`${isTotalPnlPositive ? 'text-green-500' : 'text-red-500'} text-xl font-bold flex items-center gap-2`}>
                            {isTotalPnlPositive ? '+' : ''}₹{totalPnl.toFixed(2)}
                            <span className={`text-xs font-medium ${isTotalPnlPositive ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} px-1.5 py-0.5 rounded border`}>
                                {isTotalPnlPositive ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:block h-8 w-px bg-[var(--border-primary)]"></div>
                    <div className="flex justify-between md:block pt-3 md:pt-0 border-t border-[var(--border-primary)] md:border-t-0">
                        <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase mb-1">Open Positions</div>
                        <div className="text-[var(--accent-primary)] text-xl font-bold">
                            {positions.filter(p => p.netQty > 0).length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 customscrollbar">
                {loading ? (
                    <div className="text-center text-[var(--text-muted)] py-8">Loading positions...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : (
                    <PositionsTable positions={livePositions} onAction={handleAction} />
                )}
            </div>

            {/* Overlays */}
            {actionState.type === 'buy' && actionState.stock && (
                <BuyWindow
                    uid={actionState.stock.token}
                    stockName={actionState.stock.name}
                    stockSymbol={actionState.stock.symbol}
                    stockPrice={actionState.stock.price}
                    stockChange={actionState.stock.change}
                    stockChangePercent={actionState.stock.percent}
                    onClose={handleWindowClose}
                    onSwitchToSell={() => setActionState({ ...actionState, type: 'sell' })}
                />
            )}
            {actionState.type === 'sell' && actionState.stock && (
                <SellWindow
                    uid={actionState.stock.token}
                    stockName={actionState.stock.name}
                    stockSymbol={actionState.stock.symbol}
                    stockPrice={actionState.stock.price}
                    stockChange={actionState.stock.change}
                    stockChangePercent={actionState.stock.percent}
                    onClose={handleWindowClose}
                    onSwitchToBuy={() => setActionState({ ...actionState, type: 'buy' })}
                />
            )}
        </div>
    )
}

export default Positions;
