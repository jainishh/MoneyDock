import React from 'react';
import { BookOpen, MessageSquare, ArrowRight, GraduationCap, Users } from 'lucide-react';

const resources = [
    {
        icon: BookOpen,
        color: 'from-blue-500/15 to-indigo-500/5',
        border: 'border-blue-500/20',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        iconColor: 'text-blue-400',
        badgeText: 'Free learning',
        badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        title: 'Varsity',
        desc: 'The largest online stock market education book in the world covering everything from the basics to advanced trading.',
        link: 'Varsity',
        href: '#',
    },
    {
        icon: MessageSquare,
        color: 'from-purple-500/15 to-violet-500/5',
        border: 'border-purple-500/20',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        iconColor: 'text-purple-400',
        badgeText: 'Active community',
        badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        title: 'TradingQ&A',
        desc: "The most active trading and investment community in India for all your market related queries.",
        link: 'TradingQ&A',
        href: '#',
    },
];

const EducationSection = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-start justify-between max-w-6xl mx-auto gap-10">

                {/* Left: Heading */}
                <div className="w-full md:w-2/5">
                    <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-3 py-1.5 mb-5">
                        <GraduationCap size={13} className="text-[var(--accent-primary)]" />
                        <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Education</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight leading-tight transition-colors duration-300">
                        Free and open{' '}
                        <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                            market education
                        </span>
                    </h2>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 transition-colors duration-300">
                        We believe that free, unbiased knowledge is the key to better investing. Explore resources built for everyone — from beginners to pros.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2">
                            <BookOpen size={13} className="text-[var(--accent-primary)]" />
                            <span className="text-xs text-[var(--text-muted)]">200+ chapters</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2">
                            <Users size={13} className="text-[var(--accent-primary)]" />
                            <span className="text-xs text-[var(--text-muted)]">500k+ members</span>
                        </div>
                    </div>
                </div>

                {/* Right: Cards */}
                <div className="w-full md:w-3/5 space-y-4">
                    {resources.map(({ icon: Icon, color, border, iconBg, iconColor, badgeText, badgeColor, title, desc, link, href }, i) => (
                        <div key={i} className={`group flex gap-5 p-5 rounded-2xl bg-gradient-to-br ${color} border ${border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${iconBg} border flex items-center justify-center`}>
                                <Icon size={20} className={iconColor} />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-[15px] font-bold text-[var(--text-primary)] transition-colors duration-300">{title}</h3>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor} uppercase tracking-wide`}>{badgeText}</span>
                                </div>
                                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3 transition-colors duration-300">{desc}</p>
                                <a href={href} className={`inline-flex items-center gap-1 text-[13px] font-semibold ${iconColor} hover:opacity-80 transition-opacity`}>
                                    {link} <ArrowRight size={13} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EducationSection;
