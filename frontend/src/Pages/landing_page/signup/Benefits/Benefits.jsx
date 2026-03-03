import React from "react";
import { Tag, Sparkles, BellOff, Network } from "lucide-react";

const benefitItems = [
    {
        icon: Tag,
        title: 'Unbeatable pricing',
        desc: 'Zero charges for equity & mutual fund investments. Flat ₹20 for intraday and F&O trades.',
        color: 'text-blue-400',
        bg: 'from-blue-500/15 to-blue-500/5',
        border: 'border-blue-500/25',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
        icon: Sparkles,
        title: 'Best investing experience',
        desc: 'Simple and intuitive trading platform with an easy-to-understand, powerful user interface.',
        color: 'text-purple-400',
        bg: 'from-purple-500/15 to-purple-500/5',
        border: 'border-purple-500/25',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
        icon: BellOff,
        title: 'No spam or gimmicks',
        desc: 'Committed to transparency — no gimmicks, spam, "gamification", or intrusive push notifications.',
        color: 'text-emerald-400',
        bg: 'from-emerald-500/15 to-emerald-500/5',
        border: 'border-emerald-500/25',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        icon: Network,
        title: 'The MoneyDock universe',
        desc: 'More than just an app — gain free access to the entire ecosystem of our partner products.',
        color: 'text-orange-400',
        bg: 'from-orange-500/15 to-orange-500/5',
        border: 'border-orange-500/25',
        iconBg: 'bg-orange-500/10 border-orange-500/20',
    },
];

function Benefits() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl transition-colors duration-300">

            {/* Section header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-tight transition-colors duration-300">
                    Benefits of opening a{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        MoneyDock
                    </span>{' '}
                    demat account
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] mt-3 max-w-lg mx-auto">
                    Everything you need to invest smarter — all in one platform.
                </p>
            </div>

            {/* 2×2 Benefit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {benefitItems.map(({ icon: Icon, title, desc, color, bg, border, iconBg }, i) => (
                    <div
                        key={i}
                        className={`group flex gap-4 p-6 rounded-2xl bg-gradient-to-br ${bg} border ${border} hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
                    >
                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${iconBg}`}>
                            <Icon size={20} className={color} />
                        </div>

                        {/* Text */}
                        <div>
                            <h3 className={`text-[16px] font-bold mb-1.5 ${color}`}>{title}</h3>
                            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Benefits;
