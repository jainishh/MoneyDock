import React from "react";
import Activity from "./Components/Activity/Activity";
import AnalystRatings from "./Components/Analyst Ratings & Fundamental Ratios/AnalystRatingsFundamentalRatios";
import PerformanceOverview from "./Components/Performance Overview/PerformanceOverview";
import ShareholdingPatterns from "./Components/ShareholdingPatterns/ShareholdingPatterns";
import PriceSummary from "./Components/Price Summary/PriceSummary";
import News from "./Components/News/News";
import Events from "./Components/Events/Events";
import SimilarStocks from "./Components/Similar Stocks/SimilarStocks";

function OverviewSection({ stock }) {
  const navItems = [
    { name: "Activity", id: "activity" },
    { name: "Analyst Ratings & Fundamental Ratios", id: "analyst" },
    { name: "Performance Overview", id: "performance" },
    { name: "Shareholding Patterns", id: "shareholding" },
    { name: "Price Summary", id: "price" },
    { name: "News", id: "news" },
    { name: "Events", id: "events" },
    { name: "Similar Stocks", id: "similar" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-secondary)] h-full overflow-y-auto customscrollbar">
      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-[var(--bg-main)] z-30 p-3 border-b border-[var(--border-primary)]">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="whitespace-nowrap px-3 py-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[11px] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Container */}
      <div className="p-4 space-y-6">
        <section id="activity">
          <Activity stock={stock} />
        </section>
        <section id="analyst">
          <AnalystRatings stock={stock} />
        </section>
        <section id="performance">
          <PerformanceOverview />
        </section>
        <section id="shareholding">
          <ShareholdingPatterns />
        </section>
        <section id="price">
          <PriceSummary />
        </section>
        <section id="news">
          <News />
        </section>
        <section id="events">
          <Events />
        </section>
        <section id="similar">
          <SimilarStocks />
        </section>
      </div>
    </div>
  );
}

export default OverviewSection;
