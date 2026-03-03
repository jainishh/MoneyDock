import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const getAuthConfig = () => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo?.token) return null;
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    } catch { return null; }
};

const MarketDepthBottomSheet = ({ isOpen, onClose, stock }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [depthData, setDepthData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Reset expansion state when opened/closed
    useEffect(() => {
        if (!isOpen) setIsExpanded(false);
    }, [isOpen]);

    useEffect(() => {
        let isMounted = true;
        let intervalId;

        const fetchData = async () => {
            if (!isOpen || !stock?.token) return;
            try {
                const config = getAuthConfig();
                if (!config) return;

                const response = await axios.post(`${API_BASE_URL}/api/angel/market-depth`, {
                    token: stock.token,
                    exch_seg: stock.exch_seg || "NSE"
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

        if (isOpen) {
            setIsLoading(true);
            fetchData();
            intervalId = setInterval(fetchData, 3000); // Poll every 3 seconds
        }

        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen, stock?.token]);

    if (!isOpen) return null;

    // Use live depth data or fallback to defaults
    const depthList = depthData?.depth || { buy: [], sell: [] };

    // Ensure 5 rows
    const bids = Array.from({ length: 5 }, (_, i) => {
        const b = depthList.buy[i];
        return b ? { qty: b.quantity, orders: b.orders, price: b.price } : { qty: 0, orders: 0, price: 0 };
    });

    const asks = Array.from({ length: 5 }, (_, i) => {
        const s = depthList.sell[i];
        return s ? { qty: s.quantity, orders: s.orders, price: s.price } : { qty: 0, orders: 0, price: 0 };
    });

    const totalBidQty = depthData?.totBuyQuan ?? 0;
    const totalAskQty = depthData?.totSellQuan ?? 0;

    const stats = {
        open: (depthData?.open ?? 0).toFixed(2),
        high: (depthData?.high ?? 0).toFixed(2),
        low: (depthData?.low ?? 0).toFixed(2),
        close: (depthData?.close ?? 0).toFixed(2),
        avgPrice: (depthData?.avgPrice ?? 0).toFixed(2),
        volume: depthData?.tradeVolume?.toLocaleString('en-IN') ?? "0",
        lcl: (depthData?.lowerCircuit ?? 0).toFixed(2),
        ucl: (depthData?.upperCircuit ?? 0).toFixed(2),
        high52: (depthData?.['52WeekHigh'] ?? 0).toFixed(2),
        low52: (depthData?.['52WeekLow'] ?? 0).toFixed(2),
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`fixed left-0 right-0 bottom-0 bg-[var(--bg-card)] rounded-t-2xl z-[70] transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'h-full rounded-none' : 'h-[50vh] rounded-t-2xl'
                    }`}
            >
                {/* Drag Handle / Header */}
                <div
                    className="flex justify-between items-center p-4 border-b border-[var(--border-primary)] cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex-1 flex justify-center relative">
                        {/* Visual Handle */}
                        <div className="w-12 h-1 bg-[var(--text-muted)] rounded-full absolute -top-2" />
                        <span className="text-[var(--text-muted)] text-xs font-medium">
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-[#2a2e39] bg-[#1c202b]">
                    <div className="flex items-center gap-4 w-full justify-between">
                        <div className="text-center">
                            <div className="text-[11px] font-medium text-[#868993] mb-1">Open</div>
                            <div className="text-[15px] font-bold text-white tracking-wide">{stats.open}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[11px] font-medium text-[#868993] mb-1">High</div>
                            <div className="text-[15px] font-bold text-white tracking-wide">{stats.high}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[11px] font-medium text-[#868993] mb-1">Low</div>
                            <div className="text-[15px] font-bold text-white tracking-wide">{stats.low}</div>
                        </div>
                        <div className="text-center flex items-center justify-between gap-6">
                            <div>
                                <div className="text-[11px] font-medium text-[#868993] mb-1">Close</div>
                                <div className="text-[15px] font-bold text-white tracking-wide">{stats.close}</div>
                            </div>
                            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#2a2e39] -mt-5 -mr-2 text-[#868993] hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto customscrollbar bg-[#1c202b]">
                    {/* Bid/Ask Table */}
                    <div className="bg-[#131722] overflow-hidden text-[#d1d4dc] text-[11px] pb-2">
                        {/* Header */}
                        <div className="flex border-b border-[#2a2e39] font-semibold text-[10px] text-[#868993] bg-[#1c202b] px-4 py-3">
                            <div className="w-[15%] text-left">Qty</div>
                            <div className="w-[15%] text-center">Orders</div>
                            <div className="w-[20%] text-right pr-2">Buy Price</div>
                            <div className="w-[20%] text-left pl-2">Sell Price</div>
                            <div className="w-[15%] text-center">Orders</div>
                            <div className="w-[15%] text-right">Qty</div>
                        </div>

                        {/* Rows */}
                        <div className="px-4 pb-2">
                            {bids.map((bid, i) => (
                                <div key={i} className="flex border-b border-[#2a2e39] last:border-0 hover:bg-[#1e222d] py-3 items-center">
                                    <div className={`w-[15%] text-left font-bold ${bid.qty > 0 ? 'text-[#08a8e8]' : 'text-[#868993]'}`}>{bid.qty > 0 ? bid.qty : "0"}</div>
                                    <div className="w-[15%] text-center text-[#d1d4dc]">{bid.orders > 0 ? bid.orders : "0"}</div>
                                    <div className="w-[20%] text-right pr-2 font-medium text-[#089981]">{bid.price > 0 ? bid.price.toFixed(2) : "0.00"}</div>
                                    <div className="w-[20%] text-left pl-2 font-medium text-[#f23645]">{asks[i]?.price > 0 ? asks[i].price.toFixed(2) : "0.00"}</div>
                                    <div className="w-[15%] text-center text-[#d1d4dc]">{asks[i]?.orders > 0 ? asks[i].orders : "0"}</div>
                                    <div className={`w-[15%] text-right font-bold ${asks[i]?.qty > 0 ? 'text-[#e8b23c]' : 'text-[#868993]'}`}>{asks[i]?.qty > 0 ? asks[i].qty : "0"}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-[#1c202b]">
                        {/* Total Quantity Bar Component */}
                        <div className="mb-6 pt-2">
                            <div className="h-2.5 w-full bg-[#f23645] rounded-full overflow-hidden relative mb-3">
                                <div
                                    className="absolute top-0 left-0 h-full bg-[#089981]"
                                    style={{ width: totalBidQty + totalAskQty === 0 ? '50%' : `${(totalBidQty / (totalBidQty + totalAskQty)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[#089981] font-bold text-[13px]">{totalBidQty.toLocaleString('en-IN')}</span>
                                <span className="text-[#868993] font-semibold text-[12px]">Total Quantity</span>
                                <span className="text-[#f23645] font-bold text-[13px]">{totalAskQty.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Detailed Stats Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {/* Row 1 */}
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">Avg Price</span>
                                <span className="font-bold text-white text-[12px]">{stats.avgPrice}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">Prev Close</span>
                                <span className="font-bold text-white text-[12px]">{stats.prevClose || stats.close}</span>
                            </div>

                            {/* Row 2 */}
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">Volume</span>
                                <span className="font-bold text-white text-[12px]">{stats.volume}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">OI</span>
                                <span className="font-bold text-white text-[12px]">{stats.oi || "-"}</span>
                            </div>

                            {/* Row 3 */}
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">LTQ</span>
                                <span className="font-bold text-white text-[12px]">{stats.ltq || "-"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">LTT</span>
                                <span className="font-bold text-white text-[12px] uppercase">{stats.ltt || "-"}</span>
                            </div>

                            {/* Row 4 */}
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">LCL</span>
                                <span className="font-bold text-white text-[12px]">{stats.lcl}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3">
                                <span className="text-[#868993] text-[12px]">UCL</span>
                                <span className="font-bold text-white text-[12px]">{stats.ucl}</span>
                            </div>

                            {/* Row 5 */}
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-[#868993] text-[12px]">52W High</span>
                                <span className="font-bold text-white text-[12px]">{stats.high52}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-[#868993] text-[12px]">52W Low</span>
                                <span className="font-bold text-white text-[12px]">{stats.low52}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MarketDepthBottomSheet;
