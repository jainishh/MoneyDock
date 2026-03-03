import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { X, Minus, RotateCcw, Briefcase, Settings } from "lucide-react";
import { placeOrder } from "../../../services/angelOneService";
import { useToast } from "../../../context/ToastContext";
import useAngelOneSocket from "../../../Hooks/useAngelOneSocket";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


/**
 * BuyWindow Component
 * A movable window for placing buy orders.
 */
const BuyWindow = ({ uid, stockName = "NTPC", stockSymbol, stockPrice = 0, stockChange = 0, stockChangePercent = 0, onClose, onSwitchToSell }) => {
    const { showToast } = useToast();
    const nodeRef = React.useRef(null);
    const [activeTab, setActiveTab] = useState("Regular");
    const [productType, setProductType] = useState("INT"); // INT or DEL
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(stockPrice); // Default to market price
    const [isMarket, setIsMarket] = useState(true); // Toggle between Limit and Market
    const [isLoading, setIsLoading] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [isSlTargetChecked, setIsSlTargetChecked] = useState(false);
    const [stopLoss, setStopLoss] = useState("");
    const [target, setTarget] = useState("");

    // Fetch user balance
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) return;

                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);

                const updatedUserInfo = { ...userInfo, tradingBalance: data.tradingBalance };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                window.dispatchEvent(new Event("userInfoUpdated"));
                setUserBalance(data.tradingBalance);
            } catch (error) {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo && userInfo.tradingBalance !== undefined) {
                    setUserBalance(userInfo.tradingBalance);
                }
            }
        };
        fetchBalance();

        const updateFromStorage = () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.tradingBalance !== undefined) {
                setUserBalance(userInfo.tradingBalance);
            }
        };
        window.addEventListener('userInfoUpdated', updateFromStorage);
        return () => window.removeEventListener('userInfoUpdated', updateFromStorage);
    }, []);

    // Subscribe to live price for this specific stock
    const dynamicStocks = React.useMemo(() => {
        return [{ token: String(uid), name: stockName, exchange: "NSE" }];
    }, [uid, stockName]);

    const { stocks: liveStocks } = useAngelOneSocket(dynamicStocks);
    const liveStock = liveStocks?.find(s => String(s.token || s.symboltoken) === String(uid));

    const currentLivePrice = liveStock?.ltp || stockPrice;
    const currentLiveChange = liveStock?.change ?? stockChange;
    const currentLiveChangePercent = liveStock?.changePercent ?? stockChangePercent;

    // Update price when stock changes
    useEffect(() => {
        setPrice(currentLivePrice);
    }, [stockName]);

    // Update price when live price changes (only in active Market mode)
    useEffect(() => {
        if (isMarket) {
            setPrice(currentLivePrice);
        }
    }, [currentLivePrice, isMarket]);

    // Calculations (mock)
    const marginRequired = (qty * price).toFixed(2);
    const charges = 0; // consistent with screenshot

    // Handle Buy Order
    const handleBuy = async () => {
        try {
            if (qty <= 0) {
                showToast("Please enter a valid quantity", "error");
                return;
            }

            setIsLoading(true);

            // Get User ID from localStorage
            const userInfo = localStorage.getItem("userInfo");
            const user = userInfo ? JSON.parse(userInfo) : null;
            const userId = user ? user._id : "unknown_user";

            const orderData = {
                variety: "NORMAL",
                tradingsymbol: stockSymbol || stockName + "-EQ", // Use passed symbol or fallback
                symboltoken: uid,
                transactiontype: "BUY",
                exchange: "NSE", // Defaulting to NSE
                ordertype: isMarket ? "MARKET" : "LIMIT",
                producttype: productType === "INT" ? "INTRADAY" : "DELIVERY",
                duration: "DAY",
                price: isMarket ? 0 : price,
                marketPrice: currentLivePrice, // Current live market price for accurate avg price execution
                quantity: qty,
                userId: userId,
                stoploss: isSlTargetChecked && stopLoss ? Number(stopLoss) : undefined,
                squareoff: isSlTargetChecked && target ? Number(target) : undefined
            };

            console.log("Placing Buy Order:", orderData);

            const response = await placeOrder(orderData);

            if (response.success) {
                if (response.data && response.data.tradingBalance !== undefined) {
                    const currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
                    currentUserInfo.tradingBalance = response.data.tradingBalance;
                    localStorage.setItem("userInfo", JSON.stringify(currentUserInfo));
                    window.dispatchEvent(new Event("userInfoUpdated"));
                }
                showToast(`Buy Order Placed! ID: ${response.data.angelOrderId || response.data.orderId}`, "success");
                onClose();
            } else {
                showToast(`Order Failed: ${response.message || 'Unknown error'}`, "error");
            }

        } catch (error) {
            console.error("Order Execution Error:", error);
            showToast("Failed to place order", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Draggable nodeRef={nodeRef} handle=".draggable-header">
            <div
                ref={nodeRef}
                className="fixed z-50 w-[500px] bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-lg shadow-2xl border border-[var(--border-primary)] font-sans overflow-hidden"
                style={{ top: "20%", left: "30%" }} // Initial Position
            >
                {/* Header Section */}
                <div className="draggable-header cursor-move bg-[#00a278]/10 p-3 border-b border-[#00a278]/20 flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">{stockName}</h2>
                            <span className="text-xs bg-[var(--bg-secondary)] text-[var(--text-muted)] px-1 rounded">NSE</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="font-semibold text-[#00a278]">{currentLivePrice.toFixed(2)}</span>
                            <span className="text-[#f23645] text-xs">{currentLiveChange.toFixed(2)} ({currentLiveChangePercent.toFixed(2)}%)</span>
                            <input type="radio" name={`exchange-${uid}`} id={`nse-${uid}`} defaultChecked className="accent-[#00a278]" />
                            <label htmlFor={`nse-${uid}`} className="text-xs text-[var(--text-muted)]">NSE</label>
                            <input type="radio" name={`exchange-${uid}`} id={`bse-${uid}`} className="accent-[#00a278]" />
                            <label htmlFor={`bse-${uid}`} className="text-xs text-[var(--text-muted)]">BSE {currentLivePrice.toFixed(2)}</label>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-[var(--bg-secondary)] rounded p-0.5">
                            <button className="px-3 py-0.5 bg-[#00a278] text-white text-xs font-bold rounded shadow-sm">B</button>
                            <button onClick={onSwitchToSell} className="px-3 py-0.5 text-[var(--text-muted)] text-xs font-bold hover:text-[var(--text-primary)] transition-colors">S</button>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-[var(--bg-secondary)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>



                <div className="flex">
                    {/* Main Form Area */}
                    <div className="flex-1 p-5 bg-[var(--bg-card)]">

                        {/* Inputs Row */}
                        <div className="flex gap-6 mb-6">
                            {/* Product Type */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase">Product Type</label>
                                <div className="flex bg-[var(--bg-secondary)] rounded p-1 w-fit">
                                    <button
                                        onClick={() => setProductType("INT")}
                                        className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${productType === "INT" ? "bg-[#00a278]/20 text-[#00a278] border border-[#00a278]/30" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        INT
                                    </button>
                                    <button
                                        onClick={() => setProductType("DEL")}
                                        className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${productType === "DEL" ? "bg-[#00a278]/20 text-[#00a278] border border-[#00a278]/30" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        DEL
                                    </button>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase">Quantity</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="w-24 bg-[var(--bg-secondary)] text-[var(--text-primary)] p-2 rounded border border-[var(--border-primary)] focus:border-[var(--accent-primary)] focus:outline-none text-right"
                                    />
                                </div>
                                <span className="text-[10px] text-[var(--text-muted)]">(Max Qty 0 Shares)</span>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase">Price</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={price}
                                        disabled={isMarket}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className={`w-28 bg-[var(--bg-secondary)] text-[var(--text-primary)] p-2 rounded border border-[var(--border-primary)] focus:border-[#00a278] focus:outline-none text-right ${isMarket ? "opacity-50 cursor-not-allowed" : ""}`}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-[var(--text-muted)]">Limit</span>
                                    <div
                                        onClick={() => setIsMarket(!isMarket)}
                                        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${isMarket ? "bg-[#00a278]" : "bg-[var(--bg-secondary)]"}`}
                                    >
                                        <div className={`h-3 w-3 bg-white rounded-full shadow-md transform transition-transform ${isMarket ? "translate-x-4" : "translate-x-0"}`}></div>
                                    </div>
                                    <span className={`text-[10px] ${isMarket ? "text-[#00a278] font-bold" : "text-[var(--text-muted)]"}`}>Market</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="flex items-center gap-2 mt-4">
                            <button
                                onClick={() => setIsSlTargetChecked(!isSlTargetChecked)}
                                className={`flex items-center justify-center h-4 w-4 rounded border ${isSlTargetChecked ? "bg-[#00a278] border-[#00a278]" : "border-[var(--border-primary)]"} text-white hover:border-[#00a278] transition-colors`}
                            >
                                {isSlTargetChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </button>
                            <span
                                onClick={() => setIsSlTargetChecked(!isSlTargetChecked)}
                                className="text-sm text-[#00a278] cursor-pointer hover:underline select-none"
                            >
                                Set Stop Loss / Target
                            </span>
                            <Settings size={14} className="text-[var(--text-muted)]" />
                        </div>

                        {/* SL and Target Inputs */}
                        {isSlTargetChecked && (
                            <div className="flex gap-6 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase">Stop Loss</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={stopLoss}
                                        onChange={(e) => setStopLoss(e.target.value)}
                                        className="w-24 bg-[var(--bg-secondary)] text-[var(--text-primary)] p-2 rounded border border-[var(--border-primary)] focus:border-[#f23645] focus:outline-none text-right hover:border-[#f23645]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase">Target</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                        className="w-24 bg-[var(--bg-secondary)] text-[var(--text-primary)] p-2 rounded border border-[var(--border-primary)] focus:border-[#00a278] focus:outline-none text-right hover:border-[#00a278]"
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar Tools */}
                    <div className="w-12 bg-[var(--bg-main)]/50 border-l border-[var(--border-primary)] flex flex-col items-center py-4 gap-4">
                        <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors" title="Chart">
                            <Briefcase size={18} />
                        </button>
                        <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors" title="Depth">
                            <RotateCcw size={18} />
                        </button>
                        <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors" title="Settings">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[var(--bg-main)] p-4 border-t border-[var(--border-primary)] flex justify-between items-center">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#00a278] uppercase font-semibold">Available Margin</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">₹ {userBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#00a278] uppercase font-semibold">Charges</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">₹ {charges}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBuy}
                        disabled={isLoading}
                        className={`bg-[#00a278] hover:bg-[#008f6a] text-white font-bold py-3 px-10 rounded shadow-lg transition-all transform active:scale-95 uppercase tracking-wider text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'PLACING...' : 'PLACE BUY ORDER'}
                    </button>
                </div>

            </div>
        </Draggable>
    );
};

export default BuyWindow;
