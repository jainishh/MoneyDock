import React from 'react';
import { Users, BellOff, Globe, ArrowRight, Star, TrendingUp, Shield, Zap, IndianRupee } from 'lucide-react';

const features = [
    {
        icon: Users,
        color: 'from-blue-500/20 to-indigo-500/10',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        title: 'Customer-first always',
        desc: "1.6+ crore customers trust us with thousands of crores of equity investments, making us one of India's fastest-growing brokers.",
    },
    {
        icon: BellOff,
        color: 'from-purple-500/20 to-violet-500/10',
        border: 'border-purple-500/20',
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        title: 'No spam or gimmicks',
        desc: 'No gimmicks, spam, "gamification", or annoying push notifications. High quality apps, at your pace.',
        link: 'Our philosophies.'
    },
    {
        icon: Globe,
        color: 'from-emerald-500/20 to-teal-500/10',
        border: 'border-emerald-500/20',
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'The MoneyDock universe',
        desc: 'Not just an app — a whole ecosystem of fintech products that offer you tailored services for all your needs.',
    },
];

const stats = [
    { value: '1.6Cr+', label: 'Active customers' },
    { value: '15%', label: 'Retail trade volume' },
    { value: '₹0', label: 'Account opening' },
];

const highlights = [
    { icon: TrendingUp, label: '₹0 equity delivery brokerage', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Shield, label: 'SEBI regulated & secure', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Zap, label: 'Lightning fast order execution', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { icon: IndianRupee, label: 'Flat ₹20 for F&O & intraday', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

const TrustSection = () => (
    <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between max-w-6xl mx-auto gap-12">

            {/* ── LEFT: Text Content ── */}
            <div className="w-full md:w-1/2">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-6">
                    <Star size={13} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Why choose us</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight transition-colors duration-300">
                    Trust with{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        confidence
                    </span>
                </h2>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-sm">
                            <span className="text-sm font-bold text-[var(--accent-primary)]">{value}</span>
                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Feature cards */}
                <div className="space-y-4">
                    {features.map(({ icon: Icon, color, border, iconColor, iconBg, title, desc, link }, i) => (
                        <div key={i} className={`flex gap-4 p-4 rounded-2xl bg-gradient-to-br ${color} border ${border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group`}>
                            <div className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${iconBg}`}>
                                <Icon size={18} className={iconColor} />
                            </div>
                            <div>
                                <h3 className={`text-[15px] font-bold mb-1 transition-colors duration-300 ${iconColor}`}>{title}</h3>
                                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
                                    {desc}
                                    {link && (<> <a href="#" className="inline-flex items-center gap-0.5 font-semibold text-[color:var(--accent-primary)] hover:opacity-80">{link} <ArrowRight size={12} /></a></>)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT: Highlights grid (no image) ── */}
            <div className="w-full md:w-5/12 flex flex-col gap-5 self-center">

                {/* Big stat card */}
                <div className="rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/15 to-purple-500/5 border border-[var(--accent-primary)]/25 p-7 text-center">
                    <p className="text-[13px] text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">Active Customers</p>
                    <p className="text-[56px] font-black bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent leading-none mb-1">1.6Cr+</p>
                    <p className="text-[13px] text-[var(--text-secondary)]">and growing every day 🚀</p>
                </div>

                {/* 2×2 highlight cards */}
                <div className="grid grid-cols-2 gap-3">
                    {highlights.map(({ icon: Icon, label, color, bg }) => (
                        <div key={label} className={`flex flex-col gap-3 p-4 rounded-2xl border bg-[var(--bg-card)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${bg.split(' ')[1]}`}>
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${bg}`}>
                                <Icon size={17} className={color} />
                            </div>
                            <p className={`text-[12.5px] font-semibold leading-snug ${color}`}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
);

export default TrustSection;
