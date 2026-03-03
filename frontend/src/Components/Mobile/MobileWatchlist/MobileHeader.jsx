import React from 'react';
import { Search, Zap, Plus } from 'lucide-react';

import MobileSearchContainer from './Search/MobileSearchContainer';
import MarketIndicesStrip from '../../Common/MarketIndicesStrip';

const MobileHeader = ({
    onAddStock,
    onSelectStock,
    onBuy,
    onSell,
    watchlists = [],
    activeWatchlist,
    onWatchlistChange,
    onAddWatchlist,
    forceSearchOpen,
    onForceSearchOpenHandled,
    onTabContextMenu
}) => {
    return (
        <div className="md:hidden bg-[var(--bg-main)] text-[var(--text-secondary)] pb-2 font-sans sticky top-0 z-50">
            {/* Search Component */}
            <MobileSearchContainer
                onAddStock={onAddStock}
                onSelectStock={onSelectStock}
                onBuy={onBuy}
                onSell={onSell}
                forceOpen={forceSearchOpen}
                onForceOpenHandled={onForceSearchOpenHandled}
            />
            {/* Live Market Indices Strip */}
            <MarketIndicesStrip variant="mobile" />



            {/* Tabs */}
            {/* Tabs */}
            <div className="flex items-center justify-between text-sm font-medium mt-2 border-b border-[var(--border-primary)] pb-0 px-4">
                <div className="flex overflow-x-auto customscrollbar-thin gap-6 flex-1 mask-linear-fade">
                    {watchlists.map((list) => {
                        const isActive = activeWatchlist?._id === list._id;
                        return (
                            <div
                                key={list._id}
                                onClick={() => onWatchlistChange && onWatchlistChange(list)}
                                onContextMenu={(e) => onTabContextMenu && onTabContextMenu(e, list)}
                                className={`pb-2 px-1 cursor-pointer whitespace-nowrap transition-colors select-none ${isActive
                                    ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border-b-2 border-transparent"
                                    }`}
                            >
                                {isActive && <span className="text-[var(--accent-primary)] mr-1">•</span>}
                                {list.name}
                            </div>
                        );
                    })}
                </div>
                <div
                    onClick={onAddWatchlist}
                    className="text-[var(--accent-primary)] pb-2 pl-4 ml-2 border-l border-[var(--border-primary)] cursor-pointer flex items-center shrink-0"
                >
                    <Plus size={18} />
                </div>
            </div>

        </div>
    );
};

export default MobileHeader;
