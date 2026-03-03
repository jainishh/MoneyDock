import React from "react";

const ShareholdingPatterns = () => {
  const data = [
    { label: "Promoters", value: "69.35%", color: "#9c27b0" },
    { label: "Non Institution", value: "25.66%", color: "#673ab7" },
    { label: "Mutual Funds", value: "2.92%", color: "#e91e63" },
    { label: "FIIs", value: "1.6%", color: "#3f51b5" },
  ];

  return (
    <div
      id="shareholding"
      className="bg-[var(--bg-card)] p-6 rounded-lg mb-6 border border-[var(--border-primary)]"
    >
      <h3 className="text-lg font-bold mb-6">Shareholdings Patterns</h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{ width: item.value, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareholdingPatterns;
