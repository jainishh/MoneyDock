import React from "react";
import { User, Users, Globe, Baby, Building2, ArrowRight } from "lucide-react";

const accountTypes = [
    {
        icon: User,
        title: "Individual Account",
        text: "Invest in equity, mutual funds and derivatives with zero brokerage on delivery.",
        color: 'text-blue-400',
        bg: 'from-blue-500/15 to-blue-500/5',
        border: 'border-blue-500/25',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        badge: 'Most popular',
    },
    {
        icon: Users,
        title: "HUF Account",
        text: "Make tax-efficient investments for your Hindu Undivided Family.",
        color: 'text-purple-400',
        bg: 'from-purple-500/15 to-purple-500/5',
        border: 'border-purple-500/25',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
        icon: Globe,
        title: "NRI Account",
        text: "Invest in Indian equities, mutual funds, and debentures from abroad.",
        color: 'text-emerald-400',
        bg: 'from-emerald-500/15 to-emerald-500/5',
        border: 'border-emerald-500/25',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        icon: Baby,
        title: "Minor Account",
        text: "Teach your little ones about money & invest for their future together.",
        color: 'text-pink-400',
        bg: 'from-pink-500/15 to-pink-500/5',
        border: 'border-pink-500/25',
        iconBg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
        icon: Building2,
        title: "Corporate / LLP / Partnership",
        text: "Manage your business surplus and investments with full compliance.",
        color: 'text-orange-400',
        bg: 'from-orange-500/15 to-orange-500/5',
        border: 'border-orange-500/25',
        iconBg: 'bg-orange-500/10 border-orange-500/20',
    },
];

function AccountTypes() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl transition-colors duration-300">

            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-[36px] font-bold text-[var(--text-primary)] tracking-tight transition-colors duration-300">
                    Explore different{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        account types
                    </span>
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] mt-3">
                    Choose the account that fits your investing goals
                </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountTypes.map(({ icon: Icon, title, text, color, bg, border, iconBg, badge }, i) => (
                    <div
                        key={i}
                        className={`group relative flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br ${bg} border ${border} hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
                    >
                        {badge && (
                            <span className="absolute top-4 right-4 text-[9px] font-bold bg-[var(--accent-primary)] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {badge}
                            </span>
                        )}

                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${iconBg}`}>
                            <Icon size={20} className={color} />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h3 className={`text-[16px] font-bold mb-1.5 ${color}`}>{title}</h3>
                            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{text}</p>
                        </div>

                        {/* Learn more */}
                        <div className={`flex items-center gap-1 text-[12px] font-semibold ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            Learn more <ArrowRight size={12} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AccountTypes;
