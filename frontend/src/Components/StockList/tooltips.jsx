import { BarChart2, Flag, Link, Pin, PinOff, Trash2 } from "lucide-react";

function Tooltips({ position, onBuy, onSell, onDelete, onMarketDepth, onOptionChain, onPin, isPinned }) {
    return (
        <div className="relative inline-block">
            {/* Tooltip Container */}
            <div className="flex items-center gap-1 bg-[var(--bg-card)] px-2 py-1.5 rounded-md border border-[var(--border-primary)] shadow-xl">

                {/* Buy Button (B) */}
                <button
                    onClick={onBuy}
                    className="w-6 h-6 flex items-center justify-center bg-[#26a69a] hover:bg-[#2bbbad] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
                >
                    B
                </button>

                {/* Sell Button (S) */}
                <button
                    onClick={onSell}
                    className="w-6 h-6 flex items-center justify-center bg-[#ef5350] hover:bg-[#e57373] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer mr-2"
                >
                    S
                </button>

                {/* Icons */}
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <button onClick={onMarketDepth} className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer" title="Market Depth">
                        <BarChart2 size={16} />
                    </button>

                    <button onClick={onOptionChain} className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer" title="Option Chain">
                        <Link size={16} />
                    </button>

                    <button
                        onClick={onPin}
                        className={`transition-colors cursor-pointer ${isPinned ? 'text-[#f0b90b] hover:text-[#f0b90b]/70' : 'hover:text-[#f0b90b]'}`}
                        title={isPinned ? "Unpin" : "Pin to Top"}
                    >
                        {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>

                    <button onClick={onDelete} className="hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Arrow Pointer */}
                {position === "bottom" ? (
                    // Arrow at TOP (for bottom tooltip)
                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-t border-l border-[var(--border-primary)] rotate-45 transform"></div>
                ) : (
                    // Arrow at BOTTOM (for top tooltip - default)
                    <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-b border-r border-[var(--border-primary)] rotate-45 transform"></div>
                )}
            </div>
        </div>
    );
}

export default Tooltips;

