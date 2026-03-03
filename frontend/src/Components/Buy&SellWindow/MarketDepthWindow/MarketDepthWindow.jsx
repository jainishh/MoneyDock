import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { X, Search, Star, BarChart2, Maximize2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const getAuthConfig = () => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo?.token) return null;
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    } catch { return null; }
};

const MarketDepthWindow = ({
    uid,
    stockName = "NTPC",
    stockSymbol,
    stockPrice = 0,
    stockChange = 0,
    stockChangePercent = 0,
    onClose
}) => {
    const nodeRef = React.useRef(null);
    const [depthData, setDepthData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isUp = stockChange >= 0;

    useEffect(() => {
        let isMounted = true;
        let intervalId;

        const fetchData = async () => {
            if (!uid) return;
            try {
                const config = getAuthConfig();
                if (!config) return;

                const response = await axios.post(`${API_BASE_URL}/api/angel/market-depth`, {
                    token: uid,
                    exch_seg: "NSE" // Defaulting to NSE for now, can be passed as prop if available
                }, config);

                if (isMounted && response.data.success && response.data.data) {
                    setDepthData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch market depth:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        intervalId = setInterval(fetchData, 3000); // Poll every 3 seconds

        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [uid]);

    // Use live depth data or fallback to defaults
    const depthList = depthData?.depth || { buy: [], sell: [] };

    // Ensure we always have 5 rows for the UI (fill with empty if less)
    const buyDepth = Array.from({ length: 5 }, (_, i) => {
        const b = depthList.buy[i];
        return b ? { qty: b.quantity, orders: b.orders, price: b.price } : { qty: 0, orders: 0, price: 0 };
    });

    const sellDepth = Array.from({ length: 5 }, (_, i) => {
        const s = depthList.sell[i];
        return s ? { qty: s.quantity, orders: s.orders, price: s.price } : { qty: 0, orders: 0, price: 0 };
    });

    const totalBuyQty = depthData?.totBuyQuan ?? 0;
    const totalSellQty = depthData?.totSellQuan ?? 0;

    const stats = {
        open: (depthData?.open ?? 0).toFixed(2),
        high: (depthData?.high ?? 0).toFixed(2),
        low: (depthData?.low ?? 0).toFixed(2),
        close: (depthData?.close ?? 0).toFixed(2),
        avgPrice: (depthData?.avgPrice ?? 0).toFixed(2),
        prevClose: (depthData?.close ?? 0).toFixed(2), // usually close represents prev close in live quotes
        volume: depthData?.tradeVolume?.toLocaleString('en-IN') ?? "0",
        oi: depthData?.opnInterest?.toLocaleString('en-IN') ?? "-",
        ltq: depthData?.lastTradeQty ?? "-",
        ltt: depthData?.exchTradeTime ? new Date(depthData.exchTradeTime).toLocaleTimeString() : "-",
        lcl: (depthData?.lowerCircuit ?? 0).toFixed(2),
        ucl: (depthData?.upperCircuit ?? 0).toFixed(2),
        high52: (depthData?.['52WeekHigh'] ?? 0).toFixed(2),
        low52: (depthData?.['52WeekLow'] ?? 0).toFixed(2),
    };

    // Determine dynamic values (prioritize live data over props if available)
    const currentPrice = depthData?.ltp ?? stockPrice;
    const currentChange = depthData?.netChange ?? stockChange;
    const currentPercent = depthData?.percentChange ?? stockChangePercent;
    const currentIsUp = currentChange >= 0;

    return (
        <Draggable nodeRef={nodeRef} handle=".draggable-header">
            <div
                ref={nodeRef}
                className="fixed z-[100] w-[400px] bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-lg shadow-2xl border border-[var(--border-primary)] font-sans flex flex-col"
                style={{ top: "15%", left: "40%" }}
            >
                {/* Header Section */}
                <div className="draggable-header cursor-move bg-[var(--bg-main)] p-2 border-b border-[var(--border-primary)] flex justify-between items-center rounded-t-lg">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Market Depth & Quote</span>
                    <div className="flex items-center gap-2">

                        <button onClick={onClose} className="p-1 hover:bg-[var(--bg-secondary)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-[var(--bg-card)] customscrollbar pb-4">
                    {/* Stock Overview */}
                    <div className="p-4 border-b border-[var(--border-primary)] flex justify-between items-start">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">{stockName || stockSymbol}</h2>
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <span className={`font-semibold ${currentIsUp ? "text-[#089981]" : "text-[#f23645]"}`}>
                                    {currentPrice.toFixed(2)}
                                </span>
                                <span className={`flex items-center text-xs ${currentIsUp ? "text-[#089981]" : "text-[#f23645]"}`}>
                                    {currentIsUp ? "▲" : "▼"} {Math.abs(currentChange).toFixed(2)} ({Math.abs(currentPercent).toFixed(2)}%)
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Depth Table */}
                    <div className="flex w-full text-[11px]">
                        {/* Buy Side */}
                        <div className="flex-1">
                            <div className="flex justify-between p-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                                <span className="w-1/3 text-left">Qty.</span>
                                <span className="w-1/3 text-center">Orders</span>
                                <span className="w-1/3 text-right">Buy Price</span>
                            </div>
                            {buyDepth.map((row, i) => (
                                <div key={i} className="flex justify-between p-2 border-b border-[var(--border-primary)] hover:bg-[var(--bg-main)]">
                                    <span className={`w-1/3 text-left ${row.qty > 0 ? "text-[#08a8e8]" : "text-[var(--text-muted)]"}`}>{row.qty}</span>
                                    <span className="w-1/3 text-center text-[var(--text-primary)]">{row.orders}</span>
                                    <span className="w-1/3 text-right text-[#089981]">{row.price > 0 ? row.price.toFixed(2) : "0.00"}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sell Side */}
                        <div className="flex-1 border-l border-[var(--border-primary)]">
                            <div className="flex justify-between p-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                                <span className="w-1/3 text-left">Sell Price</span>
                                <span className="w-1/3 text-center">Orders</span>
                                <span className="w-1/3 text-right">Qty.</span>
                            </div>
                            {sellDepth.map((row, i) => (
                                <div key={i} className="flex justify-between p-2 border-b border-[var(--border-primary)] hover:bg-[var(--bg-main)]">
                                    <span className="w-1/3 text-left text-[#f23645]">{row.price > 0 ? row.price.toFixed(2) : "0.00"}</span>
                                    <span className="w-1/3 text-center text-[var(--text-primary)]">{row.orders}</span>
                                    <span className={`w-1/3 text-right ${row.qty > 0 ? "text-[#e8b23c]" : "text-[var(--text-muted)]"}`}>{row.qty}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Quantity Bar */}
                    <div className="p-4 border-b border-[var(--border-primary)]">
                        <div className="h-1.5 w-full bg-[#f23645] rounded-full overflow-hidden relative mb-2">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#089981]"
                                style={{ width: totalBuyQty + totalSellQty === 0 ? '50%' : `${(totalBuyQty / (totalBuyQty + totalSellQty)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-[#089981]">{totalBuyQty.toLocaleString('en-IN')}</span>
                            <span className="text-[#8b98a5]">Total Quantity</span>
                            <span className="text-[#f23645]">{totalSellQty.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 text-xs">
                        <div className="p-3 border-r border-[var(--border-primary)] flex flex-col gap-1">
                            <span className="text-[var(--text-muted)]">Open</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.open}</span>
                        </div>
                        <div className="p-3 border-r border-[var(--border-primary)] flex flex-col gap-1">
                            <span className="text-[var(--text-muted)]">High</span>
                            <span className="font-bold text-[#089981]">{stats.high}</span>
                        </div>
                        <div className="p-3 border-r border-[var(--border-primary)] flex flex-col gap-1">
                            <span className="text-[var(--text-muted)]">Low</span>
                            <span className="font-bold text-[#f23645]">{stats.low}</span>
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                            <span className="text-[var(--text-muted)]">Close</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.close}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs border-t border-[var(--border-primary)]">
                        <div className="p-3 flex justify-between border-r border-[var(--border-primary)]">
                            <span className="text-[var(--text-muted)]">Avg Price</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.avgPrice}</span>
                        </div>
                        <div className="p-3 flex justify-between">
                            <span className="text-[var(--text-muted)]">Prev Close</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.prevClose}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs border-t border-[var(--border-primary)]">
                        <div className="p-3 flex justify-between border-r border-[var(--border-primary)]">
                            <span className="text-[var(--text-muted)]">Volume</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.volume}</span>
                        </div>
                        <div className="p-3 flex justify-between">
                            <span className="text-[var(--text-muted)]">OI</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.oi}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs border-t border-[var(--border-primary)]">
                        <div className="p-3 flex justify-between border-r border-[var(--border-primary)]">
                            <span className="text-[var(--text-muted)]">LTQ</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.ltq}</span>
                        </div>
                        <div className="p-3 flex justify-between">
                            <span className="text-[var(--text-muted)]">LTT</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.ltt}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs border-t border-[var(--border-primary)]">
                        <div className="p-3 flex justify-between border-r border-[var(--border-primary)]">
                            <span className="text-[var(--text-muted)]">LCL</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.lcl}</span>
                        </div>
                        <div className="p-3 flex justify-between">
                            <span className="text-[var(--text-muted)]">UCL</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.ucl}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs border-t border-[var(--border-primary)]">
                        <div className="p-3 flex justify-between border-r border-[var(--border-primary)]">
                            <span className="text-[var(--text-muted)]">52W High</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.high52}</span>
                        </div>
                        <div className="p-3 flex justify-between">
                            <span className="text-[var(--text-muted)]">52W Low</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.low52}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default MarketDepthWindow;
