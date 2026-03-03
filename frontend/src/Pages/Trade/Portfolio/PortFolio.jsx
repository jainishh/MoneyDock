import React, { useState } from 'react';
import Overview from './Overview/Overview';
import Equity from './Equity/Equity';
import MobilePortfolio from './MobilePortFolio/MobilePortfolio';
import { usePortfolio } from '../../../Hooks/usePortfolio';
import useAngelOneSocket from '../../../Hooks/useAngelOneSocket';

function Portfolio() {
    const [activeTab, setActiveTab] = useState('Overview');

    // Resolve userId from localStorage (same pattern as Orders / Positions)
    const userInfo = localStorage.getItem('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;
    const userId = user?._id ?? null;

    const { holdings, summary: backendSummary, loading, error, refetch } = usePortfolio(userId);

    // Memoize the mapping to avoid infinite re-render loop in useAngelOneSocket
    const dynamicStocks = React.useMemo(() => {
        return holdings?.map(h => ({
            ...h,
            token: h.symboltoken,
            name: h.tradingsymbol
        })) || [];
    }, [holdings]);

    // Get live prices for holdings
    const { stocks: liveHoldings } = useAngelOneSocket(dynamicStocks);

    // Calculate real-time summary
    const liveSummary = React.useMemo(() => {
        if (!backendSummary) return null;

        let totalCurrentValue = 0;
        let totalUnrealizedPnl = 0;

        const enrichedHoldings = (holdings || []).map(h => {
            const live = (liveHoldings || []).find(l => l.token === h.symboltoken);
            const ltp = live?.ltp || h.avgBuyPrice; // Fallback to avgBuyPrice if no tick yet
            const currentValue = h.netQty * ltp;
            const unrealizedPnl = currentValue - h.investedValue;

            totalCurrentValue += currentValue;
            totalUnrealizedPnl += unrealizedPnl;

            return {
                ...h,
                ltp,
                currentValue,
                unrealizedPnl,
                totalPnl: unrealizedPnl, // Purely unrealized in active portfolio
                changePercent: live?.changePercent || 0
            };
        });

        return {
            ...backendSummary,
            totalInvested: backendSummary.totalInvested,
            totalRealizedPnl: backendSummary.totalRealizedPnl,
            totalUnrealizedPnl,
            totalPnl: totalUnrealizedPnl, // User only wants active holdings P&L here
            currentValue: totalCurrentValue,
            holdingsCount: enrichedHoldings.length,
            uniqueSymbols: new Set(enrichedHoldings.map(h => h.tradingsymbol)).size,
            enrichedHoldings
        };
    }, [backendSummary, liveHoldings, holdings]);

    const tabs = ['Overview', 'Equity'];

    return (
        <div className="flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans">
            {/* Desktop Navigation Bar */}
            <div className="hidden md:flex items-center justify-between border-b border-[var(--border-primary)] px-6 h-12">
                <div className="flex items-center gap-6 h-full">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`h-full text-sm font-bold border-b-2 transition-colors ${activeTab === tab
                                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                } cursor-pointer`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button
                    onClick={refetch}
                    disabled={loading}
                    className="text-xs font-bold px-3 py-1.5 rounded border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] text-[var(--accent-primary)] flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {/* Content Area (Desktop) */}
            <div className="hidden md:block flex-1 overflow-y-auto customscrollbar">
                {activeTab === 'Overview' && (
                    <Overview
                        holdings={liveSummary?.enrichedHoldings || holdings}
                        summary={liveSummary}
                        loading={loading}
                        error={error}
                    />
                )}
                {activeTab === 'Equity' && (
                    <Equity
                        holdings={liveSummary?.enrichedHoldings || holdings}
                        summary={liveSummary}
                        loading={loading}
                        error={error}
                    />
                )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden h-full">
                <MobilePortfolio
                    holdings={liveSummary?.enrichedHoldings || holdings}
                    summary={liveSummary}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
}

export default Portfolio;
