import React from "react";

function News() {
  return (
    <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]">
      <h3 className="text-sm font-bold mb-4">News</h3>
      <div className="flex gap-6">
        <div className="w-1/3 border-r border-[var(--border-primary)] pr-4">
          <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
            Laxmi Organic reports 8.6% Y-o-Y net sales decline
          </p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[var(--text-muted)]">Flipitmoney</span>
            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full"></span>
            <span className="text-[#f23645] bg-[#f23645]/10 px-1 rounded font-bold">
              LXCHEM -1.68%
            </span>
            <span className="text-[var(--text-muted)]">12 days ago</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Q3 Results: Laxmi Organic Industries Ltd. reported a net sales
            decline of 8.6% at Rs 718.68 crore in December 2025... profit
            dropped 13.32% to Rs 25.41 crore.
          </p>
        </div>
      </div>
    </div>
  );
}

export default News;
