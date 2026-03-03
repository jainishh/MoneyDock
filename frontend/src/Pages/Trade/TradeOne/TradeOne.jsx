// import React, { useState } from "react";
// import ChartSection from "./ChartsSection/ChartSection";
// import OverviewSection from "./OverviewSection/OverviewSection";
// // import OptionChainSection from "./OptionChainSection/OptionChainSection";

// function TradeOne() {
//   const [activeTab, setActiveTab] = useState("chart"); // 'chart' or 'overview'

//   return (
//     <div className="flex flex-col h-full bg-[#131722] border-l border-[#2a2e39]">
//       {/* Navigation Tabs */}
//       <div className="flex bg-[#1c202b] border-b border-[#2a2e39] px-2">
//         <button
//           onClick={() => setActiveTab("chart")}
//           className={`px-4 py-2 text-[12px] font-semibold transition-colors ${
//             activeTab === "chart"
//               ? "text-[#2962ff] border-b-2 border-[#2962ff]"
//               : "text-[#868993] hover:text-white"
//           }`}
//         >
//           Chart
//         </button>
//         <button
//           onClick={() => setActiveTab("overview")}
//           className={`px-4 py-2 text-[12px] font-semibold transition-colors ${
//             activeTab === "overview"
//               ? "text-[#2962ff] border-b-2 border-[#2962ff]"
//               : "text-[#868993] hover:text-white"
//           }`}
//         >
//           Overview
//         </button>
//       </div>

//       {/* Content Rendering */}
//       <div className="flex-1 overflow-hidden">
//         {activeTab === "chart" ? (
//           <ChartSection />
//         ) : (
//           <div className="h-full overflow-y-auto customscrollbar">
//             <OverviewSection />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TradeOne;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import ChartSection from "./ChartsSection/ChartSection";
import OverviewSection from "./OverviewSection/OverviewSection";
import OptionChainSection from "./OptionChainSection/OptionChainSection";

function TradeOne() {
  const location = useLocation(); // Get location
  const stock = location.state?.stock; // Extract stock
  const initialTab = location.state?.initialTab || "chart";
  const underlyingName = location.state?.underlyingName || null;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state?.initialTab]);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)] border-l border-[var(--border-primary)]">
      {/* Navigation Tabs */}
      <div className="flex bg-[var(--bg-main)] border-b border-[var(--border-primary)] px-6 h-12">
        <div className="flex items-center gap-6 h-full">
          <button
            onClick={() => setActiveTab("chart")}
            className={`h-full text-sm font-bold border-b-2 transition-colors ${activeTab === "chart"
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }cursor-pointer`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`h-full text-sm font-bold border-b-2 transition-colors ${activeTab === "overview"
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }cursor-pointer`}
          >
            Overview
          </button>
          {/* Naya Option Chain Button */}
          <button
            onClick={() => setActiveTab("optionchain")}
            className={`h-full text-sm font-bold border-b-2 transition-colors ${activeTab === "optionchain"
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }cursor-pointer`}
          >
            Option Chain
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chart" && <ChartSection />}

        {activeTab === "overview" && (
          <div className="h-full overflow-y-auto customscrollbar">
            <OverviewSection stock={stock} /> {/* Pass stock prop */}
          </div>
        )}

        {activeTab === "optionchain" && (
          <div className="h-full overflow-y-auto customscrollbar">
            <OptionChainSection initialUnderlying={underlyingName} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TradeOne;
