import React from 'react';
import { Plus } from 'lucide-react';

const EmptyWatchlist = ({ onAddClick, onCreateClick, hasWatchlists }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 pb-20">
            {/* Illustration Placeholder - Using a generic SVG structure similar to the image */}
            <div className="mb-6 relative w-48 h-48 opacity-90">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="60" y="40" width="80" height="100" rx="4" fill="#E8EBFC" />
                    <rect x="70" y="50" width="60" height="40" rx="2" fill="white" />
                    <rect x="75" y="100" width="50" height="4" rx="2" fill="#D1D4DC" />
                    <rect x="75" y="110" width="30" height="4" rx="2" fill="#D1D4DC" />

                    {/* Charts */}
                    <rect x="75" y="65" width="8" height="20" rx="1" fill="#7986CB" />
                    <rect x="85" y="55" width="8" height="30" rx="1" fill="#FFB74D" />
                    <rect x="95" y="70" width="8" height="15" rx="1" fill="#FFB74D" />
                    <rect x="105" y="60" width="8" height="25" rx="1" fill="#7986CB" />
                    <path d="M75 80 L85 70 L95 75 L105 65" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Background Shapes */}
                    <path d="M40 70 L60 60 V120 L40 130 Z" fill="#E8EBFC" opacity="0.5" />
                    <path d="M140 70 L160 60 V120 L140 130 Z" fill="#E8EBFC" opacity="0.5" transform="scale(-1, 1) translate(-300, 0)" />

                    {/* Circle Element */}
                    <circle cx="120" cy="130" r="15" fill="#4CAF50" opacity="0.2" />
                    <path d="M115 130 L120 135 L128 125" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Decor */}
                    <circle cx="40" cy="110" r="2" fill="#FFB74D" />
                    <rect x="150" y="80" width="4" height="4" transform="rotate(45 150 80)" fill="#2962FF" />

                </svg>
            </div>

            <h3 className="text-[#333333] dark:text-[#d1d4dc] text-lg font-medium mb-2">
                Your Watchlist is Empty
            </h3>

            <p className="text-[#666666] dark:text-[#868993] text-sm max-w-[280px] mb-8">
                Create a new watchlist and search for stocks to add them here. Start tracking your favorite companies today!
            </p>

            <button
                onClick={hasWatchlists ? onAddClick : onCreateClick}
                className="flex items-center justify-center gap-2 bg-[#2962FF] text-white font-medium text-sm hover:bg-[#1E4BD8] px-6 py-2.5 rounded shadow-sm transition-colors"
            >
                <Plus size={18} />
                {hasWatchlists ? "Search & Add Stocks" : "Create Watchlist"}
            </button>
        </div>
    );
};

export default EmptyWatchlist;
