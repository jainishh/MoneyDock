import React from "react";

function AnalystRatings({ stock }) {
  return (
    <div className="flex gap-8 py-4 border-b border-[var(--border-primary)]">
      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-bold">Analyst Ratings</h3>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">196.5</span>
          <span className="text-[#089981] text-sm font-bold">
            28.83%{" "}
            <span className="text-[var(--text-muted)] font-normal text-xs block">
              Expected Profit
            </span>
          </span>
        </div>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span>HOLD</span>
            <span>50%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div className="bg-[#f7a821] h-full" style={{ width: "50%" }}></div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-bold">Fundamental Ratios</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] p-2 rounded border border-[var(--border-primary)]">
            <p className="text-[10px] text-[var(--text-muted)]">PE Ratio</p>
            <p className="font-bold">53.16</p>
          </div>
          <div className="bg-[var(--bg-card)] p-2 rounded border border-[var(--border-primary)]">
            <p className="text-[10px] text-[var(--text-muted)]">ROE (Latest)</p>
            <p className="font-bold text-[#089981]">4.33%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalystRatings;
