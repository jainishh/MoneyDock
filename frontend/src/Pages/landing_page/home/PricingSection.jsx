import React from 'react';
import { UserPlus, TrendingUp, BarChart2, ArrowRight, Tag } from 'lucide-react';

const pricingCards = [
    {
        icon: UserPlus,
        amount: '₹0',
        label: 'Free account opening',
        color: 'from-blue-500/15 to-indigo-500/5',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-400',
        amountColor: 'text-[#ff9800]',
    },
    {
        icon: TrendingUp,
        amount: '₹0',
        label: 'Free equity delivery and direct mutual funds',
        color: 'from-purple-500/15 to-violet-500/5',
        border: 'border-purple-500/20',
        iconColor: 'text-purple-400',
        amountColor: 'text-[#ff9800]',
    },
    {
        icon: BarChart2,
        amount: '₹20',
        label: 'Intraday and F&O trades',
        color: 'from-emerald-500/15 to-teal-500/5',
        border: 'border-emerald-500/20',
        iconColor: 'text-emerald-400',
        amountColor: 'text-[#ff9800]',
    },
];

const PricingSection = () => {
    return (
        <div className="container mx-auto px-4 py-16 mt-10">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-10">

                {/* Left: Text */}
                <div className="w-full md:w-1/3">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-3 py-1.5 mb-5">
                        <Tag size={12} className="text-[var(--accent-primary)]" />
                        <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Transparent fees</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight transition-colors duration-300 leading-tight">
                        Unbeatable{' '}
                        <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                            pricing
                        </span>
                    </h2>

                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-sm transition-colors duration-300">
                        We pioneered the concept of discount broking and price
                        transparency in India. Flat fees and no hidden charges.
                    </p>

                    <a href="/pricing" className="inline-flex items-center gap-1.5 font-medium text-[color:var(--accent-primary)] hover:opacity-80 transition-opacity text-sm">
                        See pricing <ArrowRight size={14} />
                    </a>
                </div>

                {/* Right: Pricing Cards */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {pricingCards.map(({ icon: Icon, amount, label, color, border, iconColor, amountColor }, i) => (
                        <div key={i} className={`flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br ${color} border ${border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>

                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl bg-[var(--bg-card)] border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={18} className={iconColor} />
                            </div>

                            {/* Amount */}
                            <div className={`text-5xl font-bold ${amountColor} mb-3 leading-none`}>
                                {amount}
                            </div>

                            {/* Label */}
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[130px]">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
