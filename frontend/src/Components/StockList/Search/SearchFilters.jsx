import React from "react";

/**
 * SearchFilters Component
 * Renders the filter tabs for search results (All, Indices, Cash, F&O, MF).
 */
const SearchFilters = ({ activeFilter, onFilterChange }) => {
    const filters = ["All", "Indices", "Cash", "F&O", "MF"];

    return (
        <div className="sticky top-0 bg-[var(--bg-main)] z-10 px-4 pt-2 border-b border-[var(--border-primary)] flex gap-6 text-sm font-medium text-[var(--text-muted)] mb-2">
            {filters.map((filter) => (
                <button
                    key={filter}
                    className={`pb-2 cursor-pointer transition-colors ${activeFilter === filter
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'hover:text-[var(--text-secondary)]'
                        }`}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default SearchFilters;
