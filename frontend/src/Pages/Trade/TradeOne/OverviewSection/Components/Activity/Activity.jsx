import React, { useEffect, useState } from "react";
import useAngelOneSocket from "../../../../../../Hooks/useAngelOneSocket";
import BuyWindow from "../../../../../../Components/Buy&SellWindow/BuyWindow/BuyWindow";
import SellWindow from "../../../../../../Components/Buy&SellWindow/SellWindow/SellWindow";

function Activity({ stock }) {
  // Use the socket hook for real-time updates
  const { stocks: socketStocks } = useAngelOneSocket(stock ? [stock] : []);

  // Find the current stock in the socket stocks
  const liveStock = socketStocks.find(
    (s) => (s.token || s.symboltoken) === (stock?.token || stock?.symboltoken)
  ) || stock;

  // Window states
  const [showBuyWindow, setShowBuyWindow] = useState(false);
  const [showSellWindow, setShowSellWindow] = useState(false);

  const handleBuyClick = () => {
    setShowBuyWindow(true);
    setShowSellWindow(false);
  };

  const handleSellClick = () => {
    setShowSellWindow(true);
    setShowBuyWindow(false);
  };

  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    return typeof priceVal === 'number' ? priceVal : parseFloat(priceVal.toString().replace(/,/g, ''));
  };

  if (!stock) {
    return (
      <div className="flex h-40 items-center justify-center text-[var(--text-muted)] border-b border-[var(--border-primary)]">
        Select a stock to view activity
      </div>
    );
  }

  const isUp = (liveStock?.changePercent || 0) >= 0;
  const price = liveStock?.price || liveStock?.ltp || 0;
  const change = liveStock?.change || 0;
  const changePercent = liveStock?.changePercent || 0;

  return (
    <div className="space-y-6">
      {/* Window Overlays */}
      {showBuyWindow && (
        <BuyWindow
          uid={liveStock.token || liveStock.symboltoken}
          stockName={liveStock.name}
          stockSymbol={liveStock.symbol}
          stockPrice={parsePrice(price)}
          stockChange={parseFloat(change || 0)}
          stockChangePercent={parseFloat(changePercent || 0)}
          onClose={() => setShowBuyWindow(false)}
          onSwitchToSell={handleSellClick}
        />
      )}
      {showSellWindow && (
        <SellWindow
          uid={liveStock.token || liveStock.symboltoken}
          stockName={liveStock.name}
          stockSymbol={liveStock.symbol}
          stockPrice={parsePrice(price)}
          stockChange={parseFloat(change || 0)}
          stockChangePercent={parseFloat(changePercent || 0)}
          onClose={() => setShowSellWindow(false)}
          onSwitchToBuy={handleBuyClick}
        />
      )}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold uppercase">
            {liveStock?.name || liveStock?.symbol}{" "}
            <span className="text-[10px] bg-[var(--bg-secondary)] px-1 rounded ml-1 text-[var(--text-muted)]">
              {liveStock?.exch_seg || liveStock?.exchange || "NSE"}
            </span>
          </h2>
          <p className="text-sm text-[var(--text-muted)]">{liveStock?.formattedName || liveStock?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className={`text-lg font-bold ${isUp ? "text-[#089981]" : "text-[#f23645]"}`}>
              {typeof price === 'number' ? price.toFixed(2) : '0.00'} {isUp ? "▲" : "▼"}
            </p>
            <p className={`text-xs ${isUp ? "text-[#089981]" : "text-[#f23645]"}`}>
              {typeof change === 'number' ? (change > 0 ? "+" : "") + change.toFixed(2) : '0.00'} ({typeof changePercent === 'number' ? changePercent.toFixed(2) : '0.00'}%)
            </p>
          </div>
          <button
            onClick={handleBuyClick}
            className="bg-[#089981] text-white text-[11px] font-bold px-3 py-1 rounded hover:opacity-90 transition-all cursor-pointer"
          >
            BUY
          </button>
          <button
            onClick={handleSellClick}
            className="bg-[#f23645] text-white text-[11px] font-bold px-3 py-1 rounded hover:opacity-90 transition-all cursor-pointer"
          >
            SELL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 border-y border-[var(--border-primary)] py-4">
        <div>
          <p className="text-[11px] text-[var(--text-muted)]">Open</p>
          <p className="font-bold">{liveStock?.open || "--"}</p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--text-muted)]">High</p>
          <p className="font-bold text-[#089981]">{liveStock?.high || "--"}</p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--text-muted)]">Low</p>
          <p className="font-bold text-[#f23645]">{liveStock?.low || "--"}</p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--text-muted)]">Close</p>
          <p className="font-bold text-[var(--text-primary)]">{liveStock?.close || "--"}</p>
        </div>
      </div>
    </div>
  );
}

export default Activity;
