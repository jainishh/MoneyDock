import React from "react";
import { TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";

function PriceSummary() {
  const summaries = [
    { title: "Performance Today", desc: "Underperformed sector by -2.48%" },
    {
      title: "Consecutive Fall",
      desc: "Stock has been losing for the last 2 days",
    },
    { title: "Day's Low", desc: "Stock touched intraday low of Rs 148.32" },
    { title: "Weighted Average", desc: "Volume traded close to Low Price" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold">Price Summary</h3>
        <div className="flex gap-2">
          <ChevronLeft size={16} className="text-[var(--text-muted)] cursor-pointer" />
          <ChevronRight size={16} className="text-[var(--text-muted)] cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {summaries.map((item, i) => (
          <div
            key={i}
            className="min-w-[220px] bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-primary)]"
          >
            <TrendingDown className="text-[#f23645] mb-2" size={18} />
            <p className="text-[12px] font-bold text-[var(--text-primary)] mb-1">
              {item.title}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriceSummary;
