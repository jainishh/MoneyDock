import React from "react";

function PerformanceOverview() {
  return (
    <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)] space-y-6">
      <h3 className="text-sm font-bold text-[var(--text-primary)]">Performance Overview</h3>

      {/* Top Metrics */}
      <div className="grid grid-cols-5 gap-4 py-2">
        <div>
          <p className="text-[10px] text-[var(--text-muted)]">Short Term</p>
          <p className="text-[#f23645] text-xs font-bold">Very Negative</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-muted)]">Long Term</p>
          <p className="text-[#f23645] text-xs font-bold">Very Negative</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-muted)]">Market Cap</p>
          <p className="text-xs font-bold">Rs 4,170 Cr</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-muted)]">1 year Return</p>
          <p className="text-[#f23645] text-xs font-bold">-26.15%</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-muted)]">Sector Return</p>
          <p className="text-[#089981] text-xs font-bold">7.92%</p>
        </div>
      </div>

      {/* Ranks Section */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[var(--border-primary)]">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs">Quality</span>
            <span className="bg-[#f23645]/20 text-[#f23645] text-[10px] px-2 py-0.5 rounded">
              BELOW AVERAGE 1/5
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">Valuation</span>
            <span className="bg-[#f7a821]/20 text-[#f7a821] text-[10px] px-2 py-0.5 rounded">
              EXPENSIVE 2/5
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">Financial</span>
            <span className="bg-[#f23645]/20 text-[#f23645] text-[10px] px-2 py-0.5 rounded">
              EXPENSIVE 1/5
            </span>
          </div>
        </div>
        <div className="bg-[var(--bg-secondary)] p-3 rounded text-[11px] text-[var(--text-muted)]">
          <p>
            • Below Average quality company basis long term financial
            performance.
          </p>
          <p className="mt-2 text-[var(--text-primary)] font-semibold">
            Size - Ranks 9th out of 34 companies in sector.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PerformanceOverview;
