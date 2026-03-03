import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, PiggyBank, Rocket, BarChart2, ArrowUpRight } from "lucide-react";

const fallbackIcons = [TrendingUp, PiggyBank, Rocket, BarChart2];

const options = [
    {
        title: "Stocks",
        desc: "Invest in all exchange-listed securities",
        img: "media/images/investoptions1.svg",
        color: "from-blue-500/20 to-indigo-500/10",
        border: "border-blue-500/20",
    },
    {
        title: "Mutual funds",
        desc: "Invest in commission-free direct mutual funds",
        img: "media/images/investoptions2.svg",
        color: "from-purple-500/20 to-violet-500/10",
        border: "border-purple-500/20",
    },
    {
        title: "IPO",
        desc: "Apply to the latest IPOs instantly via UPI",
        img: "media/images/investoptions3.svg",
        color: "from-emerald-500/20 to-teal-500/10",
        border: "border-emerald-500/20",
    },
    {
        title: "Futures & options",
        desc: "Hedge and mitigate market risk through simplified F&O trading",
        img: "media/images/investoptions4.svg",
        color: "from-orange-500/20 to-amber-500/10",
        border: "border-orange-500/20",
    },
];

function InvestmentOptions() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 text-center py-16">

            {/* Section Heading */}
            <div className="mb-3 inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5">
                <TrendingUp size={13} className="text-[var(--accent-primary)]" />
                <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">What you can invest in</span>
            </div>
            <h2 className="mt-4 mb-12 text-[1.8rem] font-bold text-[var(--text-primary)] tracking-tight">
                Investment options with{' '}
                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                    MoneyDock
                </span>
            </h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
                {options.map((opt, index) => {
                    const FallbackIcon = fallbackIcons[index];
                    return (
                        <div
                            key={index}
                            className={`group flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br ${opt.color} border ${opt.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                        >
                            {/* Image / Icon */}
                            <div className="w-14 h-14 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
                                <img
                                    src={opt.img}
                                    alt={opt.title}
                                    className="w-9 h-9 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <span style={{ display: 'none' }} className="items-center justify-center">
                                    <FallbackIcon size={20} className="text-[var(--accent-primary)]" />
                                </span>
                            </div>

                            {/* Text */}
                            <div className="pt-1">
                                <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1 group-hover:text-[color:var(--accent-primary)] transition-colors">
                                    {opt.title}
                                </h3>
                                <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                                    {opt.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA Button */}
            <div className="mt-14">
                <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-lg bg-[var(--accent-primary)] blur-xl opacity-30 scale-110 pointer-events-none" />
                    <button
                        className="relative inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 text-white font-semibold py-3 px-9 rounded-lg text-[16px] transition-all duration-200 shadow-[var(--shadow-accent)] border border-[#5c6bc0]"
                        onClick={() => { window.scrollTo(0, 0); navigate("/signup"); }}
                    >
                        Explore Investments
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvestmentOptions;
