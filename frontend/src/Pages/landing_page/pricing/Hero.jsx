import React from 'react';
import { TrendingUp, PiggyBank, BarChart2, ArrowRight, CheckCircle2, Tag } from 'lucide-react';

const coins = [
    {
        icon: TrendingUp,
        amount: '0',
        badge: 'Zero brokerage',
        title: 'Free equity delivery',
        desc: 'All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.',
        color: 'from-blue-500/15 to-indigo-500/5',
        border: 'border-blue-500/25',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        iconColor: 'text-blue-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    },
    {
        icon: BarChart2,
        amount: '20',
        badge: 'Flat fee',
        title: 'Intraday and F&O trades',
        desc: 'Flat ₹20 or 0.03% (whichever is lower) per executed order across equity, currency, and commodity trades.',
        color: 'from-[var(--accent-primary)]/15 to-purple-500/5',
        border: 'border-[var(--accent-primary)]/25',
        iconBg: 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20',
        iconColor: 'text-[color:var(--accent-primary)]',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
        featured: true,
    },
    {
        icon: PiggyBank,
        amount: '0',
        badge: 'No commission',
        title: 'Free direct MF',
        desc: 'All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.',
        color: 'from-emerald-500/15 to-teal-500/5',
        border: 'border-emerald-500/25',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        iconColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    },
];

const PricingCoin = ({ icon: Icon, amount, badge, title, desc, color, border, iconBg, iconColor, badgeBg, featured }) => (
    <div className={`group relative w-full md:w-1/3`}>
        {featured && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-[10px] font-bold bg-[var(--accent-primary)] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow">
                Most popular
            </div>
        )}
        <div className={`h-full rounded-2xl bg-gradient-to-br ${color} border ${border} hover:shadow-xl transition-all duration-300 p-7 flex flex-col items-center text-center gap-4 hover:-translate-y-1`}>

            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${iconBg}`}>
                <Icon size={20} className={iconColor} />
            </div>

            {/* Amount */}
            <div className="flex items-start justify-center leading-none">
                <span className="text-[28px] text-[#ff9800] font-semibold mt-1.5 mr-0.5">₹</span>
                <span className="text-[80px] md:text-[88px] font-bold text-[#ff9800] leading-none">{amount}</span>
            </div>

            {/* Badge */}
            <span className={`inline-flex items-center gap-1.5 border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeBg}`}>
                <CheckCircle2 size={10} strokeWidth={3} />
                {badge}
            </span>

            {/* Title */}
            <h3 className="text-[17px] font-bold text-[var(--text-primary)] transition-colors duration-300">
                {title}
            </h3>

            {/* Description */}
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300 flex-1">
                {desc}
            </p>

            {/* Learn more */}
            <a href="/pricing" className={`inline-flex items-center gap-1 text-[12.5px] font-semibold ${iconColor} hover:opacity-75 transition-opacity`}>
                Learn more <ArrowRight size={12} />
            </a>
        </div>
    </div>
);

const Hero = () => (
    <div className="container mx-auto px-4 py-20 mt-10 transition-colors duration-300">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-6">
                <Tag size={13} className="text-[var(--accent-primary)]" />
                <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-[48px] font-bold text-[var(--text-primary)] mb-4 tracking-tight transition-colors duration-300">
                Simple,{' '}
                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                    transparent
                </span>{' '}
                charges
            </h1>
            <p className="text-[17px] text-[var(--text-secondary)] transition-colors duration-300">
                Complete list of all charges and taxes — no hidden fees, ever.
            </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-5 max-w-5xl mx-auto">
            {coins.map((coin, i) => <PricingCoin key={i} {...coin} />)}
        </div>
    </div>
);

export default Hero;
