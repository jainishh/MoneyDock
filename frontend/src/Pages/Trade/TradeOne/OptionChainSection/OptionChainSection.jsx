import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { ArrowLeft, RefreshCw, AlertCircle, ChevronDown, Clock, Info, BarChart2, Star, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useAngelOneSocket from "../../../../hooks/useAngelOneSocket";
import BuyWindow from "../../../../Components/Buy&SellWindow/BuyWindow/BuyWindow";
import SellWindow from "../../../../Components/Buy&SellWindow/SellWindow/SellWindow";

// ─── Popular Indices (Still used for the dropdown defaults) ─────────────────────
const FNO_INDICES = [
  { name: "NIFTY", label: "NIFTY 50" },
  { name: "BANKNIFTY", label: "BANK NIFTY" },
  { name: "FINNIFTY", label: "FIN NIFTY" },
  { name: "MIDCPNIFTY", label: "MIDCAP NIFTY" },
  { name: "SENSEX", label: "SENSEX" },
];

// ─── Market hours helper (IST) ────────────────────────────────────────────────
function isMarketOpen() {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  const day = ist.getDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;
  const hhmm = ist.getHours() * 100 + ist.getMinutes();
  return hhmm >= 915 && hhmm <= 1530;
}

/** Format "27FEB2026" → "27 Feb 2026" for display */
function formatExpiry(raw) {
  if (!raw || raw.length < 9) return raw;
  const dd = raw.slice(0, 2);
  const mon = raw.slice(2, 5);
  const yyyy = raw.slice(5);
  return `${parseInt(dd)} ${mon} ${yyyy}`;
}

// ─── Number formatting ────────────────────────────────────────────────────────
const fmt4 = (v) => (v == null ? "—" : Number(v).toFixed(4));
const fmt2 = (v) => (v == null ? "—" : Number(v).toFixed(2));

// ─── Component ────────────────────────────────────────────────────────────────
function OptionChain({ initialUnderlying }) {
  const navigate = useNavigate();
  const location = useLocation();
  const stock = location.state?.stock;
  const isMobileView = location.pathname.includes("/trade/option-chain");

  // Index/stock selector — prop takes priority, then location.state, then NIFTY
  const stockName = initialUnderlying || stock?.name || stock?.symbol || "";
  const defaultIndex = stockName || "NIFTY";
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  // Sync selected index if the user navigates to a new stock or prop changes
  useEffect(() => {
    if (initialUnderlying) setSelectedIndex(initialUnderlying);
    else setSelectedIndex(defaultIndex);
  }, [initialUnderlying, defaultIndex]);

  const underlyingName = selectedIndex;

  const [allExpiries, setAllExpiries] = useState({});
  const expiries = allExpiries[selectedIndex] || [];

  const [expiry, setExpiry] = useState("");
  const [rows, setRows] = useState([]);

  // Connect live websocket data
  const [optionTokens, setOptionTokens] = useState([]);
  const [underlyingInfo, setUnderlyingInfo] = useState(null);
  const { stocks: liveOptionData } = useAngelOneSocket(optionTokens);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [cachedAt, setCachedAt] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const lastFetchTime = React.useRef(0);

  // Buy/Sell Overlays
  const [showBuyWindow, setShowBuyWindow] = useState(false);
  const [showSellWindow, setShowSellWindow] = useState(false);
  const [selectedStockForOrder, setSelectedStockForOrder] = useState(null);

  // Hover / Actions
  const [hoveredSide, setHoveredSide] = useState(null); // { index: number, side: 'CE' | 'PE' }

  // Auto-scroll ref
  const atmRowRef = React.useRef(null);

  // Toast notification
  const [toast, setToast] = useState(null); // { msg, ok }
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  // Watchlist picker
  const [allWatchlists, setAllWatchlists] = useState([]);
  const [watchlistPicker, setWatchlistPicker] = useState(null); // { optRaw, optLive }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo?.token) return;
    fetch('/api/watchlist/getAllWatchlists', { headers: { Authorization: `Bearer ${userInfo.token}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllWatchlists(data); })
      .catch(() => { });
  }, []);

  const marketOpen = useMemo(() => isMarketOpen(), []);

  // Fetch valid option chain expiries from backend when underlyingName changes
  useEffect(() => {
    if (!underlyingName) return;
    fetch(`/api/option-chain/custom/expiries/${underlyingName}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAllExpiries(prev => ({
            ...prev,
            [underlyingName]: json.data
          }));
        }
      })
      .catch(err => console.error("Failed to fetch expiries:", err));
  }, [underlyingName]);

  // When index changes, expiries regenerate — reset selected expiry to first
  useEffect(() => {
    if (expiries.length > 0 && (!expiry || !expiries.includes(expiry))) {
      setExpiry(expiries[0]);
    }
  }, [selectedIndex, expiries, expiry]);

  const COOLDOWN_SEC = 5; // Minimum seconds between API calls

  const isIndexSupported = useMemo(() => {
    return FNO_INDICES.some(idx => idx.name === selectedIndex);
  }, [selectedIndex]);

  const fetchGreeks = useCallback(async () => {
    if (!expiry) return;

    // Reset error when starting new fetch
    setError(null);

    // Enforce cooldown to avoid rate limits
    const elapsed = (Date.now() - lastFetchTime.current) / 1000;
    if (elapsed < COOLDOWN_SEC && lastFetchTime.current > 0) {
      const remaining = Math.ceil(COOLDOWN_SEC - elapsed);
      setCooldown(remaining);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setLoading(true);
    lastFetchTime.current = Date.now();

    try {
      // Fetch data using our Custom Data Builder, removing Greek dependencies
      const endpoint = "/api/option-chain/custom/chain";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: underlyingName, expirydate: expiry }),
      });
      const json = await res.json();

      if (!json.success || !json.data || json.data.length === 0) {
        // Customize the message if we know it's a data-less response
        setError(json.message || "No data available for this expiry.");
        setRows([]);
        setOptionTokens([]);
        setCachedAt(null);

        // Auto-skip to the next expiry if no data is found
        if (expiries && expiries.length > 0) {
          const currentIndex = expiries.indexOf(expiry);
          if (currentIndex !== -1 && currentIndex < expiries.length - 1) {
            console.log(`No data for ${expiry}, auto-skipping to ${expiries[currentIndex + 1]}`);
            setExpiry(expiries[currentIndex + 1]);
            // Clear the 5-sec cooldown so it can fetch the next expiry immediately
            setCooldown(0);
            lastFetchTime.current = 0;
          }
        }
      } else {
        const optionData = json.data ?? [];
        setRows(optionData);

        // Extract real-time streaming tokens for WebSockets
        const newTokens = [];
        if (json.underlyingToken) {
          newTokens.push({ token: json.underlyingToken, exch_seg: json.underlyingExchSeg || 'NSE' });
        }
        optionData.forEach(row => {
          if (row.CE && row.CE.token) newTokens.push({ token: row.CE.token, exch_seg: row.CE.exch_seg });
          if (row.PE && row.PE.token) newTokens.push({ token: row.PE.token, exch_seg: row.PE.exch_seg });
        });
        setOptionTokens(newTokens);
        setUnderlyingInfo({ token: json.underlyingToken, exch_seg: json.underlyingExchSeg });

        setLastFetched(new Date());
        setCachedAt(json.fromCache && json.cachedAt ? new Date(json.cachedAt) : null);
      }
    } catch (err) {
      setError("Network error: " + err.message);
      setRows([]);
      setOptionTokens([]);
      setUnderlyingInfo(null);
    } finally {
      setLoading(false);
    }
  }, [underlyingName, expiry, expiries, isIndexSupported]);

  useEffect(() => {
    fetchGreeks();
  }, [fetchGreeks]);

  // Auto-skip to next expiry if no trading activity is found after a short timeout
  // NOTE: Disabled because when the market is closed or connection is slow,
  // REST API fetching takes > 5 seconds, making this 3s timeout falsely trigger
  // and race through all expiries recursively.
  /*
  useEffect(() => {
    if (!loading && rows.length > 0 && optionTokens.length > 0 && liveOptionData.length > 0) {
      const checkData = () => {
        // Exclude underlying index from check
        const optionLive = liveOptionData.filter(s => s.token !== underlyingInfo?.token);
        return optionLive.some(s => s.ltp > 0 || s.volume > 0);
      };

      if (checkData()) return;

      const timer = setTimeout(() => {
        if (!checkData() && expiries.length > 0) {
          const currentIndex = expiries.indexOf(expiry);
          if (currentIndex !== -1 && currentIndex < expiries.length - 1) {
            console.log(`Auto-skipping ${expiry} because no trading activity found.`);
            setError(`No trading activity for ${formatExpiry(expiry)}. Auto-skipping...`);
            setExpiry(expiries[currentIndex + 1]);
            setCooldown(0);
            if (lastFetchTime) lastFetchTime.current = 0;
          }
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, rows, optionTokens, liveOptionData, expiry, expiries, underlyingInfo]);
  */

  // ─── Auto-scroll to ATM row ───
  useEffect(() => {
    if (!loading && rows.length > 0 && atmRowRef.current) {
      // Use a small timeout to ensure rendering is complete before scrolling
      setTimeout(() => {
        atmRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [loading, rows, expiry]);

  // ─── Render helpers ─────────────────────────────────────────────────────────
  const ColHeader = ({ label, cls = "" }) => (
    <th className={`p-2 font-medium bg-[var(--bg-main)] min-w-[70px] whitespace-nowrap ${cls}`}>{label}</th>
  );

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handleAction = (action, optRaw, optLive) => {
    if (!optRaw?.token) return;

    // Fallback constructed stock object for actions
    const stockObj = {
      token: optRaw.token,
      name: optRaw.symbol,
      symbol: optRaw.symbol,
      exch_seg: optRaw.exch_seg,
      lotsize: optRaw.lotsize,
      price: optLive?.ltp || 0,
      ltp: optLive?.ltp || 0,
      change: optLive?.change || 0,
      percent: optLive?.changePercent || 0,
      isUp: optLive?.changePercent >= 0
    };

    if (action === 'buy') {
      setSelectedStockForOrder(stockObj);
      setShowBuyWindow(true);
      setShowSellWindow(false);
    } else if (action === 'sell') {
      setSelectedStockForOrder(stockObj);
      setShowSellWindow(true);
      setShowBuyWindow(false);
    } else if (action === 'chart') {
      navigate('/trade/chart', { state: { stock: stockObj } });
    } else if (action === 'watchlist') {
      // Show watchlist picker instead of adding directly
      setWatchlistPicker({ optRaw, optLive });
    }
  };

  const ActionTooltip = ({ optRaw, optLive }) => {
    if (!optRaw?.token) return null;
    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded px-1 py-1 shadow-lg z-20">
        <button
          onClick={(e) => { e.stopPropagation(); handleAction('buy', optRaw, optLive); }}
          className="bg-[#089981]/10 text-[#089981] hover:bg-[#089981] hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-colors">
          B
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAction('sell', optRaw, optLive); }}
          className="bg-[#f23645]/10 text-[#f23645] hover:bg-[#f23645] hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-colors">
          S
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAction('chart', optRaw, optLive); }}
          className="text-[var(--text-muted)] hover:text-white px-1.5 py-0.5 rounded transition-colors" title="Chart">
          <BarChart2 size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAction('watchlist', optRaw, optLive); }}
          className="text-[var(--text-muted)] hover:text-white px-1.5 py-0.5 rounded transition-colors" title="Add to Watchlist">
          <Plus size={12} />
        </button>
      </div>
    );
  };

  const underlyingLive = underlyingInfo?.token ? liveOptionData.find(s => s.token === underlyingInfo.token) : null;
  const currentSpotPrice = underlyingLive?.ltp || stock?.price;

  const handleToggleWatchlist = (watchlistName, inList = false) => {
    const { optRaw, optLive } = watchlistPicker;
    setWatchlistPicker(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const authToken = userInfo?.token;
    if (!authToken) { showToast('Please login first', false); return; }

    const endpoint = inList ? '/api/watchlist/removeByToken' : '/api/watchlist/addByToken';
    const symbol = optRaw.symbol || '';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ token: optRaw.token, watchlistName })
    }).then(r => r.json()).then(res => {
      if (res.success) {
        if (inList) {
          showToast(`✓ ${symbol} removed from "${watchlistName}"`);
          setAllWatchlists(prev => prev.map(wl =>
            wl.name === watchlistName ? { ...wl, stocks: (wl.stocks || []).filter(s => s.token !== optRaw.token) } : wl
          ));
        } else {
          showToast(`✓ ${symbol} added to "${watchlistName}"`);
          setAllWatchlists(prev => prev.map(wl =>
            wl.name === watchlistName ? { ...wl, stocks: [{ token: optRaw.token }, ...(wl.stocks || [])] } : wl
          ));
        }
        window.dispatchEvent(new CustomEvent('watchlist-updated', { detail: { watchlistName } }));
      } else {
        showToast(res.message || 'Action failed', false);
      }
    }).catch(e => { console.error(e); showToast('Request failed', false); });
  };

  return (
    <div
      className={`bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans ${isMobileView ? "h-full flex flex-col" : "p-4 min-h-full"
        } relative`}
    >
      {/* ── Watchlist Picker Modal (Inline Fixed Overlay) ── */}
      {watchlistPicker && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setWatchlistPicker(null)}>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-2xl p-4 min-w-[240px]" onClick={e => e.stopPropagation()}>
            <div className="text-[13px] font-bold text-[var(--text-primary)] mb-3">Add to Watchlist</div>
            {allWatchlists.length === 0 ? (
              <div className="text-[11px] text-[var(--text-muted)] py-2">No watchlists found. Please create one first.</div>
            ) : (
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto customscrollbar pr-2">
                {allWatchlists.map(wl => {
                  const inList = wl.stocks?.some(s => s.token === watchlistPicker?.optRaw?.token);
                  return (
                    <button
                      key={wl._id}
                      onClick={() => handleToggleWatchlist(wl.name, inList)}
                      className={`flex justify-between items-center text-left text-[12px] px-3 py-2 rounded transition-colors border ${inList ? 'border-[var(--border-primary)] hover:border-[#f23645] hover:text-[#f23645]' : 'border-transparent hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white'} text-[var(--text-secondary)]`}
                    >
                      <span className="truncate">📋 {wl.name}</span>
                      {inList && <span className="text-[10px] font-bold opacity-80">REMOVE</span>}
                    </button>
                  );
                })}
              </div>
            )}
            <button onClick={() => setWatchlistPicker(null)} className="mt-3 w-full text-[12px] font-medium text-[var(--text-muted)] hover:text-[#f23645] transition-colors py-2 border border-[var(--border-primary)] hover:border-[#f23645] rounded rounded-md">✕ Cancel</button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-[12px] font-medium transition-all ${toast.ok ? 'bg-[#089981] text-white' : 'bg-[#f23645] text-white'
          }`}>
          {toast.msg}
        </div>
      )}
      {/* ── Overlays ── */}
      {showBuyWindow && selectedStockForOrder && (
        <BuyWindow
          uid={selectedStockForOrder.token}
          stockName={selectedStockForOrder.name}
          stockSymbol={selectedStockForOrder.symbol}
          stockPrice={selectedStockForOrder.price || 0}
          stockChange={selectedStockForOrder.change || 0}
          stockChangePercent={selectedStockForOrder.percent || 0}
          onClose={() => setShowBuyWindow(false)}
          onSwitchToSell={() => {
            setShowBuyWindow(false);
            setShowSellWindow(true);
          }}
        />
      )}
      {showSellWindow && selectedStockForOrder && (
        <SellWindow
          uid={selectedStockForOrder.token}
          stockName={selectedStockForOrder.name}
          stockSymbol={selectedStockForOrder.symbol}
          stockPrice={selectedStockForOrder.price || 0}
          stockChange={selectedStockForOrder.change || 0}
          stockChangePercent={selectedStockForOrder.percent || 0}
          onClose={() => setShowSellWindow(false)}
          onSwitchToBuy={() => {
            setShowSellWindow(false);
            setShowBuyWindow(true);
          }}
        />
      )}

      {/* ── Mobile Header ── */}
      {isMobileView && (
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-main)] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-[var(--text-primary)] text-lg font-bold uppercase">
                {stock?.name || "OPTION CHAIN"}
              </h1>
              {stock && (
                <div className="text-[10px] font-bold flex items-center gap-1">
                  <span className="text-[var(--text-muted)]">{stock.exchange}</span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-primary)]">₹{stock.price}</span>
                  <span className={stock.isUp ? "text-[#089981]" : "text-[#f23645]"}>
                    {stock.percent}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Content Container ── */}
      <div className={`${isMobileView ? "flex-1 overflow-hidden flex flex-col" : ""}`}>

        {/* ── Toolbar ── */}
        <div
          className={`flex flex-wrap items-center gap-2 mb-3 bg-[var(--bg-main)] ${isMobileView ? "p-4 pb-0" : ""}`}
        >
          {/* Title */}
          {!isMobileView && (
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              {underlyingName}
              <span className="ml-2 px-1 text-[10px] bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-primary)] rounded">
                {stock?.exchange || "NSE"}
              </span>
              <span className="ml-2">
                {stock?.price?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`ml-2 text-xs ${stock?.isUp ? "text-[#089981]" : "text-[#f23645]"}`}>
                {stock?.change && stock?.change > 0 ? "+" : ""}{stock?.change?.toFixed(2)} ({stock?.percent}%)
              </span>
            </h3>
          )}

          <div className="flex items-center gap-3 ml-auto text-[11px]">
            {/* Expiry Selector */}
            <div className="flex items-center gap-1 font-bold">
              <span className="text-[var(--text-muted)]">Expiry:</span>
              <div className="relative">
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="appearance-none bg-transparent border border-[var(--border-primary)] rounded px-2 pr-6 py-1 outline-none text-[var(--text-primary)] cursor-pointer"
                >
                  {expiries.map((ex) => (
                    <option key={ex} value={ex} className="bg-[var(--bg-secondary)]">
                      {formatExpiry(ex)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
              </div>
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchGreeks}
              disabled={loading || cooldown > 0}
              className="flex items-center gap-1 text-[11px] font-bold border border-[var(--border-primary)] text-[#2962ff] rounded px-3 py-1 hover:bg-[#2962ff] hover:text-white hover:border-[#2962ff] transition-colors disabled:opacity-40"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              {loading ? "Loading…" : cooldown > 0 ? `Wait ${cooldown}s` : "Refresh"}
            </button>
          </div>
        </div>

        {/* ── Market Closed Banner ── */}
        {!marketOpen && (
          <div
            className={`flex items-start gap-2 bg-[#2a2000] border border-[#f0b90b]/40 rounded p-3 text-[11px] text-[#f0b90b] mb-3 ${isMobileView ? "mx-4" : ""}`}
          >
            <Clock size={14} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Market is closed.</span>{" "}
              <span className="text-[var(--text-secondary)]">Option Data is only available during market hours (Mon–Fri, 9:15 AM – 3:30 PM IST).</span>
            </div>
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div
            className={`flex items-start gap-2 bg-[var(--bg-secondary)] border border-[#f23645]/40 rounded p-3 text-[11px] text-[#f23645] mb-3 ${isMobileView ? "mx-4" : ""}`}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>
              {error === "No Data Available" && !marketOpen
                ? "No data — the market is currently closed. Please try again during market hours."
                : error}
            </span>
          </div>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && rows.length === 0 && (
          <div className="overflow-x-auto customscrollbar flex-1 opacity-70 pointer-events-none">
            <table className="w-full text-[13px] text-center border-collapse min-w-[800px]">
              <thead className="bg-[var(--bg-main)]">
                <tr className="border-b border-[var(--border-primary)] text-[var(--text-secondary)]">
                  <th colSpan="4" className="py-2 px-3 text-center tracking-widest font-bold">CALL</th>
                  <th className="py-2 px-3 bg-[var(--bg-secondary)] text-center border-x border-[var(--border-primary)] text-[10px] w-28 whitespace-nowrap text-[var(--text-muted)]">
                    LTP & OI
                  </th>
                  <th colSpan="4" className="py-2 px-3 text-center tracking-widest font-bold">PUT</th>
                </tr>
                <tr className="text-[var(--text-muted)] border-b border-[var(--border-primary)] text-[10px] font-medium">
                  <ColHeader label="Volume" cls="text-left" />
                  <ColHeader label="OI Chng.(Chng%)" cls="text-right" />
                  <ColHeader label="OI" cls="text-right" />
                  <ColHeader label="LTP (LTP Chng%)" cls="text-right" />
                  <th className="p-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-x border-[var(--border-primary)] font-medium">Strike</th>
                  <ColHeader label="LTP (LTP Chng%)" cls="text-left" />
                  <ColHeader label="OI" cls="text-left" />
                  <ColHeader label="OI Chng.(Chng%)" cls="text-left" />
                  <ColHeader label="Volume" cls="text-right" />
                </tr>
              </thead>
              <tbody>
                {Array(12).fill(null).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border-primary)]">
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-3/4 ml-auto"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2 ml-auto"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-2/3 ml-auto"></div></td>
                    <td className="p-3 bg-[var(--bg-secondary)] border-x border-[var(--border-primary)]">
                      <div className="h-4 bg-[#2a2e39] rounded animate-pulse w-1/2 mx-auto"></div>
                    </td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-2/3"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-3/4"></div></td>
                    <td className="p-3"><div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2 ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Greeks Table ── */}
        {!loading && rows.length > 0 && (
          <div className="overflow-x-auto overflow-y-auto customscrollbar flex-1">
            <table className="w-full text-[13px] text-center border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-[var(--bg-main)]">
                {/* Group header */}
                <tr className="border-b border-[var(--border-primary)] text-[var(--text-secondary)]">
                  <th colSpan="4" className="py-2 px-3 text-center tracking-widest font-bold">CALL</th>
                  <th className="py-2 px-3 bg-[var(--bg-secondary)] text-center border-x border-[var(--border-primary)] text-[10px] w-28 whitespace-nowrap text-[var(--text-muted)]">
                    LTP & OI
                  </th>
                  <th colSpan="4" className="py-2 px-3 text-center tracking-widest font-bold">PUT</th>
                </tr>
                {/* Column headers */}
                <tr className="text-[var(--text-muted)] border-b border-[var(--border-primary)] text-[10px] font-medium">
                  <ColHeader label="Volume" cls="text-left" />
                  <ColHeader label="OI Chng.(Chng%)" cls="text-right" />
                  <ColHeader label="OI" cls="text-right" />
                  <ColHeader label="LTP (LTP Chng%)" cls="text-right" />
                  <th className="p-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-x border-[var(--border-primary)] font-medium">Strike</th>
                  <ColHeader label="LTP (LTP Chng%)" cls="text-left" />
                  <ColHeader label="OI" cls="text-left" />
                  <ColHeader label="OI Chng.(Chng%)" cls="text-left" />
                  <ColHeader label="Volume" cls="text-right" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const ce = row.CE ?? {};
                  const pe = row.PE ?? {};

                  const ceLiveData = ce.token ? liveOptionData.find(s => s.token === ce.token) : null;
                  const peLiveData = pe.token ? liveOptionData.find(s => s.token === pe.token) : null;

                  const ceLtp = ceLiveData?.ltp ?? "—";
                  const peLtp = peLiveData?.ltp ?? "—";

                  // Calculate LTP Change dynamically
                  const ceChangePercent = ceLiveData?.changePercent ?? 0;
                  const peChangePercent = peLiveData?.changePercent ?? 0;

                  // Extract Volume from live data, otherwise fallback to DB data or '—'
                  const ceVolume = ceLiveData?.volume ?? ce.tradeVolume ?? "—";
                  const peVolume = peLiveData?.volume ?? pe.tradeVolume ?? "—";

                  // OI and OI Change from live data
                  const ceOi = ceLiveData?.oi || ce.oi || null;
                  const peOi = peLiveData?.oi || pe.oi || null;
                  const ceOiChange = ceLiveData?.oiChange ?? null;
                  const peOiChange = peLiveData?.oiChange ?? null;

                  // Format OI Change with colour
                  const fmtOiChng = (v) => {
                    if (v == null) return "—";
                    if (v >= 10000000) return (v / 10000000).toFixed(2) + 'Cr';
                    if (v >= 100000) return (v / 100000).toFixed(2) + 'L';
                    if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
                    return v.toString();
                  };

                  // Format volume into K/M/Cr
                  const formatVol = (v) => {
                    if (v === "—" || !v) return "—";
                    if (v >= 10000000) return (v / 10000000).toFixed(2) + 'Cr';
                    if (v >= 100000) return (v / 100000).toFixed(2) + 'L';
                    if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
                    return v.toString();
                  };

                  // Define ATM based on closest distance to the underlying true spot price
                  let isAtm = false;
                  if (currentSpotPrice && row.strikePrice) {
                    const closestStrike = rows.reduce((prev, curr) => {
                      return (Math.abs(curr.strikePrice - currentSpotPrice) < Math.abs(prev.strikePrice - currentSpotPrice) ? curr : prev);
                    });
                    isAtm = closestStrike.strikePrice === row.strikePrice;
                  }

                  return (
                    <React.Fragment key={i}>
                      {isAtm && (
                        <tr ref={atmRowRef}>
                          <td colSpan="9" className="p-0 h-[3px] bg-[#f23645] relative">
                            <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)] border border-[#f23645] text-[#f23645] font-bold text-[9px] px-2 py-0.5 rounded-sm z-10 w-auto text-center min-w-[50px]">
                              {Number(currentSpotPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr
                        className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-card)] transition-colors leading-6 group"
                        onMouseLeave={() => setHoveredSide(null)}
                      >
                        {/* ──────────────── CALL Side ──────────────── */}
                        <td colSpan={4} className="p-0 relative" onMouseEnter={() => !isMobileView && setHoveredSide({ index: i, side: 'CE' })} onClick={() => {
                          if (isMobileView && ce.token) {
                            navigate('/trade/stock-details', { state: { stock: { token: ce.token, name: ce.symbol, symbol: ce.symbol, exch_seg: ce.exch_seg, lotsize: ce.lotsize, price: ceLiveData?.ltp || 0, ltp: ceLiveData?.ltp || 0, change: ceLiveData?.change || 0, percent: ceLiveData?.changePercent || 0, isUp: ceLiveData?.changePercent >= 0 }, fromOptionChain: true } });
                          }
                        }}>
                          <div className="flex w-full h-full items-center">
                            <div className="flex-1 p-3 text-left text-[var(--text-secondary)] pl-4">{formatVol(ceVolume)}</div>
                            <div className={`flex-1 p-3 text-right ${ceOiChange > 0 ? 'text-[#089981]' : ceOiChange < 0 ? 'text-[#f23645]' : 'text-[var(--text-secondary)]'}`}>
                              {ceOiChange != null ? <>{fmtOiChng(ceOiChange)}<span className="text-[10px] ml-1 opacity-70">({ceOi && ceOi > 0 ? ((ceOiChange / ceOi) * 100).toFixed(1) + '%' : '—'})</span></> : "—"}
                            </div>
                            {/* Live OI data or fallback */}
                            <div className="flex-1 p-3 text-right text-[var(--text-secondary)]">{ceOi ? Number(ceOi).toLocaleString('en-IN') : "—"}</div>
                            <div className={`flex-1 p-3 text-right font-medium pr-4 ${ceChangePercent > 0 ? 'text-[#089981]' : ceChangePercent < 0 ? 'text-[#f23645]' : 'text-[var(--text-secondary)]'}`}>
                              {ceLtp !== "—" ? `₹${ceLtp}` : "—"}
                              {ceChangePercent !== 0 && (
                                <span className="text-[10px] ml-1 opacity-80">
                                  ({ceChangePercent > 0 ? '+' : ''}{ceChangePercent.toFixed(2)}%)
                                </span>
                              )}
                            </div>
                          </div>
                          {hoveredSide?.index === i && hoveredSide?.side === 'CE' && <ActionTooltip optRaw={ce} optLive={ceLiveData} />}
                        </td>

                        {/* ──────────────── Strike ──────────────── */}
                        <td className={`p-3 bg-[var(--bg-secondary)] group-hover:bg-[var(--bg-card)] font-bold text-[14px] border-x border-[var(--border-primary)] whitespace-nowrap text-center ${isAtm ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                          {Number(row.strikePrice).toLocaleString("en-IN")}
                        </td>

                        {/* ──────────────── PUT Side ──────────────── */}
                        <td colSpan={4} className="p-0 relative" onMouseEnter={() => !isMobileView && setHoveredSide({ index: i, side: 'PE' })} onClick={() => {
                          if (isMobileView && pe.token) {
                            navigate('/trade/stock-details', { state: { stock: { token: pe.token, name: pe.symbol, symbol: pe.symbol, exch_seg: pe.exch_seg, lotsize: pe.lotsize, price: peLiveData?.ltp || 0, ltp: peLiveData?.ltp || 0, change: peLiveData?.change || 0, percent: peLiveData?.changePercent || 0, isUp: peLiveData?.changePercent >= 0 }, fromOptionChain: true } });
                          }
                        }}>
                          <div className="flex w-full h-full items-center">
                            <div className={`flex-1 p-3 text-left font-medium pl-4 ${peChangePercent > 0 ? 'text-[#089981]' : peChangePercent < 0 ? 'text-[#f23645]' : 'text-[var(--text-secondary)]'}`}>
                              {peLtp !== "—" ? `₹${peLtp}` : "—"}
                              {peChangePercent !== 0 && (
                                <span className="text-[10px] ml-1 opacity-80">
                                  ({peChangePercent > 0 ? '+' : ''}{peChangePercent.toFixed(2)}%)
                                </span>
                              )}
                            </div>
                            <div className="flex-1 p-3 text-left text-[var(--text-secondary)]">{peOi ? Number(peOi).toLocaleString('en-IN') : "—"}</div>
                            <div className={`flex-1 p-3 text-left ${peOiChange > 0 ? 'text-[#089981]' : peOiChange < 0 ? 'text-[#f23645]' : 'text-[var(--text-secondary)]'}`}>
                              {peOiChange != null ? <>{fmtOiChng(peOiChange)}<span className="text-[10px] ml-1 opacity-70">({peOi && peOi > 0 ? ((peOiChange / peOi) * 100).toFixed(1) + '%' : '—'})</span></> : "—"}
                            </div>
                            <div className="flex-1 p-3 text-right text-[var(--text-secondary)] pr-4">{formatVol(peVolume)}</div>
                          </div>
                          {hoveredSide?.index === i && hoveredSide?.side === 'PE' && <ActionTooltip optRaw={pe} optLive={peLiveData} />}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)] gap-3">
            {!marketOpen ? (
              <>
                <Clock size={32} className="opacity-40" />
                <p className="text-sm">Market is closed — data will be available during trading hours.</p>
                <p className="text-[10px]">Mon–Fri, 9:15 AM – 3:30 PM IST</p>
              </>
            ) : (
              <>
                <AlertCircle size={32} className="opacity-40" />
                <p className="text-sm">No Greeks data available for this expiry.</p>
              </>
            )}
            <button
              onClick={fetchGreeks}
              disabled={cooldown > 0}
              className="text-[11px] border border-[var(--border-primary)] rounded px-3 py-1 hover:border-[var(--accent-primary)] transition-colors disabled:opacity-40"
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OptionChain;
