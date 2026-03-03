import React from 'react';
import { Landmark, ArrowRight, TrendingUp, Users, BookOpen } from 'lucide-react';

const Hero = () => {
    return (
        <div className="container mx-auto px-4 py-16 mt-10 md:mt-16 max-w-5xl">

            {/* ── Header ── */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-6">
                    <Landmark size={14} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Our Story</span>
                </div>

                <h1 className="text-3xl md:text-[42px] font-bold text-[var(--text-primary)] leading-tight tracking-tight transition-colors duration-300">
                    We pioneered the{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        discount broking
                    </span>{' '}
                    model in India.
                    <br className="hidden md:block" />
                    <span className="text-[var(--text-secondary)] font-medium text-2xl md:text-[32px]">
                        {' '}Now, breaking ground with our{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                            technology.
                        </span>
                    </span>
                </h1>

                {/* Stat chips */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {[
                        { icon: Users, value: '1.6Cr+', label: 'Clients' },
                        { icon: TrendingUp, value: '15%', label: 'Indian retail trading volume' },
                        { icon: BookOpen, value: '2010', label: 'Founded' },
                    ].map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-sm">
                            <Icon size={13} className="text-[var(--accent-primary)]" />
                            <span className="text-sm font-bold text-[var(--accent-primary)]">{value}</span>
                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent mb-14" />

            {/* ── Body Text ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[15.5px] text-[var(--text-secondary)] leading-[1.85]">

                {/* Left column */}
                <div className="space-y-5">
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        </span>
                        We kick-started operations on the 15th of August, 2010 with the goal of breaking all barriers that traders and investors face in India in terms of cost, support, and technology. We named the company MoneyDock, a combination of Zero and "Rodha", the Sanskrit word for barrier.
                    </p>
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        </span>
                        Today, our disruptive pricing models and in-house technology have made us the biggest stock broker in India.
                    </p>
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        </span>
                        Over 1.6+ crore clients place billions of orders every year through our powerful ecosystem of investment platforms, contributing over 15% of all Indian retail trading volumes.
                    </p>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </span>
                        In addition, we run a number of popular open online educational and community initiatives to empower retail traders and investors.
                    </p>
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </span>
                        <span>
                            <a href="#" className="font-semibold text-[color:var(--accent-primary)] hover:opacity-80 transition-colors">Rainmatter</a>,{' '}
                            our fintech fund and incubator, has invested in several fintech startups with the goal of growing the Indian capital markets.
                        </span>
                    </p>
                    <p className="flex gap-3">
                        <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </span>
                        <span>
                            And yet, we are always up to something new every day. Catch up on the latest updates on our{' '}
                            <a href="#" className="inline-flex items-center gap-0.5 font-medium text-[color:var(--accent-primary)] hover:opacity-80 transition-colors">blog <ArrowRight size={13} /></a>
                            {' '}or see what the media is{' '}
                            <a href="#" className="inline-flex items-center gap-0.5 font-medium text-[color:var(--accent-primary)] hover:opacity-80 transition-colors">saying about us <ArrowRight size={13} /></a>
                            {' '}or learn more about our{' '}
                            <a href="#" className="inline-flex items-center gap-0.5 font-medium text-[color:var(--accent-primary)] hover:opacity-80 transition-colors">philosophies <ArrowRight size={13} /></a>.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
