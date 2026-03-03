import React from 'react';
import {
    Globe, ArrowUpRight, TrendingUp, BarChart2, BookOpen,
    PiggyBank, Shield, Cpu, Layers, Wallet, LineChart
} from 'lucide-react';

const partners = [
    { icon: TrendingUp, name: 'Streak', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Algo trading & strategy builder without coding.' },
    { icon: BarChart2, name: 'Sensibull', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Options trading platform with live strategies.' },
    { icon: LineChart, name: 'Tijori Finance', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Portfolio analytics and stock research tools.' },
    { icon: PiggyBank, name: 'Smallcase', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'Invest in curated baskets of stocks & ETFs.' },
    { icon: BookOpen, name: 'Varsity', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', desc: 'Free stock market education & learning modules.' },
    { icon: Wallet, name: 'Rainmatter', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', desc: 'Fintech fund & incubator growing capital markets.' },
];

const Universe = () => {
    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl transition-colors duration-300">

            {/* Top blog note */}
            <p className="text-center text-[var(--text-muted)] text-[14px] mb-16 transition-colors duration-300">
                Want to know more about our technology stack?{' '}
                <a href="#" className="inline-flex items-center gap-1 text-[color:var(--accent-primary)] hover:opacity-80 font-medium">
                    Check out the MoneyDock tech blog <Globe size={13} />
                </a>
            </p>

            {/* Section Header */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-5">
                    <Layers size={13} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Ecosystem</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight transition-colors duration-300">
                    The MoneyDock{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        Universe
                    </span>
                </h2>
                <p className="text-[var(--text-secondary)] text-[15px] max-w-lg mx-auto transition-colors duration-300">
                    Extend your trading and investment experience even further with our partner platforms
                </p>
            </div>

            {/* Partner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
                {partners.map(({ icon: Icon, name, color, bg, desc }) => (
                    <a
                        key={name}
                        href="#"
                        className={`group flex flex-col gap-3 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                    >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg}`}>
                            <Icon size={18} className={color} />
                        </div>

                        {/* Name + arrow */}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-[15px] text-[var(--text-primary)] group-hover:text-[color:var(--accent-primary)] transition-colors">{name}</span>
                            <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[color:var(--accent-primary)] transition-colors" />
                        </div>

                        {/* Desc */}
                        <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">{desc}</p>
                    </a>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-lg bg-[var(--accent-primary)] blur-xl opacity-30 scale-110 pointer-events-none" />
                    <button className="relative inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 text-white font-semibold py-3.5 px-10 rounded-lg text-[16px] transition-all duration-200 shadow-[var(--shadow-accent)] border border-[#5c6bc0]">
                        Sign up for free
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Universe;
