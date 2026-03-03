import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Minus, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { placeOrder } from '../../../../services/angelOneService';
import { useToast } from '../../../../context/ToastContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const MobileSellOrder = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const stock = location.state?.stock || {
        name: "COALINDIA",
        exchange: "NSE",
        fullName: "COAL INDIA LTD",
        price: "408.95",
        change: "-10.20",
        percent: "-2.43",
        isUp: false
    };

    const [productType, setProductType] = useState('Delivery');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(stock.price);
    const [orderType, setOrderType] = useState('Market');
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

    // Update price when stock changes
    useEffect(() => {
        setPrice(stock.price);
    }, [stock.name]);

    // Update price when live price changes (only in active Market mode)
    useEffect(() => {
        if (orderType === 'Market') {
            setPrice(stock.price);
        }
    }, [stock.price, orderType]);

    const handleQuantityChange = (increment) => {
        setQuantity(prev => Math.max(1, prev + increment));
    };

    const handlePriceChange = (increment) => {
        setPrice(prev => {
            const newPrice = parseFloat(prev) + increment;
            return newPrice.toFixed(2);
        });
    };

    const handleSell = async () => {
        try {
            if (quantity <= 0) {
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
                tradingsymbol: stock.symbol || stock.name,
                symboltoken: stock.token,
                transactiontype: "SELL",
                exchange: stock.exchange || "NSE",
                ordertype: orderType === 'Market' ? "MARKET" : "LIMIT",
                producttype: productType === "Intraday" ? "INTRADAY" : "DELIVERY",
                duration: "DAY",
                price: orderType === 'Market' ? 0 : price,
                marketPrice: stock.price, // Capture current market price
                quantity: quantity,
                userId: userId,
                stoploss: isSlTargetChecked && stopLoss ? Number(stopLoss) : undefined,
                squareoff: isSlTargetChecked && target ? Number(target) : undefined
            };

            const response = await placeOrder(orderData);

            if (response.success) {
                if (response.data && response.data.tradingBalance !== undefined) {
                    const currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
                    currentUserInfo.tradingBalance = response.data.tradingBalance;
                    localStorage.setItem("userInfo", JSON.stringify(currentUserInfo));
                    window.dispatchEvent(new Event("userInfoUpdated"));
                }
                showToast(`Sell Order Placed! ID: ${response.data.angelOrderId}`, "success");
                const targetTab = orderType === 'Market' ? 'Order History' : 'Open Orders';
                navigate('/trade/orders', { state: { activeTab: targetTab, refresh: Date.now() } });
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
        <div className="h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-[var(--text-primary)] text-lg font-bold uppercase">{stock.name}</h1>
                        <div className="text-[10px] font-bold flex items-center gap-1">
                            <span className="text-[var(--text-muted)]">{stock.exchange}</span>
                            <span className="text-[var(--text-secondary)]">•</span>
                            <span className="text-[var(--text-primary)]">₹{stock.price}</span>
                            <span className={stock.isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{stock.percent}%</span>
                        </div>
                    </div>
                </div>
                <button className="text-[var(--text-secondary)]">
                    <Settings size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto customscrollbar p-4">
                {/* Product Type Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setProductType('Delivery')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border rounded transition-colors ${productType === 'Delivery'
                            ? 'border-[#f23645] bg-[#f23645]/10 text-[#f23645]'
                            : 'border-[var(--border-primary)] text-[var(--text-muted)] bg-[var(--bg-card)]'
                            }`}
                    >
                        Delivery
                    </button>
                    <button
                        onClick={() => setProductType('Intraday')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border rounded transition-colors ${productType === 'Intraday'
                            ? 'border-[#f23645] bg-[#f23645]/10 text-[#f23645]'
                            : 'border-[var(--border-primary)] text-[var(--text-muted)] bg-[var(--bg-card)]'
                            }`}
                    >
                        Intraday
                    </button>
                </div>

                {/* Quantity Input */}
                <div className="mb-6 bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-4 block">No. of Shares</label>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-primary)] transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="bg-transparent text-center text-2xl font-bold text-[var(--text-primary)] w-full outline-none"
                        />
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-primary)] transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Price Input */}
                <div className="mb-6 bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-4 block">Enter Price</label>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handlePriceChange(-0.05)}
                            className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-primary)] transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={orderType === 'Market'} // Disable if Market order
                            className={`bg-transparent text-center text-2xl font-bold text-[var(--text-primary)] w-full outline-none ${orderType === 'Market' ? 'opacity-50' : ''}`}
                        />
                        <button
                            onClick={() => handlePriceChange(0.05)}
                            className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-primary)] transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--border-primary)] pt-4">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">Place order at</span>
                        <div className="flex bg-[var(--bg-main)] rounded-full p-1 border border-[var(--border-primary)]">
                            <button
                                onClick={() => { setOrderType('Market'); setPrice(stock.price); }} // Reset to Market/Current Price
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${orderType === 'Market'
                                    ? 'bg-[var(--border-primary)] text-[var(--text-primary)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                            >
                                Market
                            </button>
                            <button
                                onClick={() => setOrderType('Limit')}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${orderType === 'Limit'
                                    ? 'bg-[#f23645] text-white shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                            >
                                Limit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Options */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setIsSlTargetChecked(!isSlTargetChecked)}
                        className={`flex items-center justify-center h-4 w-4 rounded border ${isSlTargetChecked ? "bg-[#f23645] border-[#f23645]" : "border-[var(--border-primary)]"} text-white hover:border-[#f23645] transition-colors`}
                    >
                        {isSlTargetChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                    <span
                        onClick={() => setIsSlTargetChecked(!isSlTargetChecked)}
                        className="text-sm text-[#f23645] cursor-pointer hover:underline select-none"
                    >
                        Set Stop Loss / Target
                    </span>
                    <Settings size={14} className="text-[var(--text-muted)]" />
                </div>

                {/* SL and Target Inputs */}
                {isSlTargetChecked && (
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2 block">Stop Loss</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={stopLoss}
                                onChange={(e) => setStopLoss(e.target.value)}
                                className="bg-transparent text-lg font-bold text-[var(--text-primary)] w-full outline-none"
                            />
                        </div>
                        <div className="flex-1 bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2 block">Target</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="bg-transparent text-lg font-bold text-[var(--text-primary)] w-full outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
                <div className="flex justify-between items-center mb-4 text-xs font-medium">
                    <span className="text-[var(--text-muted)]">Margin Required (Approx)</span>
                    <span className="text-[var(--text-muted)]">Available Margin</span>
                </div>
                <div className="flex justify-between items-center mb-4 font-bold">
                    <span className="text-[var(--text-primary)] text-sm">₹{(price * quantity).toFixed(2)} <span className="text-[#f23645] text-xs">+ Charges</span></span>
                    <span className="text-[var(--text-primary)] text-sm">₹{userBalance.toFixed(2)}</span>
                </div>
                <button
                    onClick={handleSell}
                    disabled={isLoading}
                    className={`w-full bg-[#f23645] hover:bg-[#c92a37] text-white py-3.5 rounded text-sm font-bold uppercase tracking-wide transition-colors shadow-lg shadow-[#f23645]/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isLoading ? 'Placing Order...' : 'Sell'}
                </button>
            </div>
        </div>
    );
};

export default MobileSellOrder;
