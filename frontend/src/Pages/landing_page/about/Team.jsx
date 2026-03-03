import React, { useState } from 'react';
import { Users, ChevronDown, ExternalLink, Twitter, Globe, MessageCircle } from 'lucide-react';

const teamMembers = [
    { name: 'Nikhil Kamath', role: 'Co-founder & CFO', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop', bio: 'Nikhil is an avid reader and always keeps up with the latest in the financial world.' },
    { name: 'Dr. Kailash Nadh', role: 'CTO', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop', bio: 'Kailash has a PhD in Artificial Intelligence & Computational Linguistics, and is the mastermind behind our tech and products.' },
    { name: 'Venu Madhav', role: 'COO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', bio: 'Venu is the backbone of our operations ensuring smooth sailing for all our processes.' },
    { name: 'Seema Patil', role: 'Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop', bio: 'Seema has led the quality team since the beginning and is now a director. She is an extremely disciplined fitness enthusiast.' },
    { name: 'Karthik Rangappa', role: 'Chief of Education', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop', bio: 'Karthik single-handedly wrote Varsity, our massive educational program. He heads investor education initiatives and loves stock markets, classic rock, single malts, and photography.' },
    { name: 'Austin Prakesh', role: 'Director Strategy', img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=250&auto=format&fit=crop', bio: 'Austin is a strategist with a profound understanding of global financial markets.' },
];

const Team = () => {
    const [openBio, setOpenBio] = useState(null);

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">

            {/* ── Section Header ── */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-5">
                    <Users size={13} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Our Team</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight transition-colors duration-300">
                    The{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        people
                    </span>{' '}
                    behind MoneyDock
                </h2>
            </div>

            {/* ── CEO Featured Card ── */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/5 border border-[var(--accent-primary)]/20 mb-14 shadow-sm">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[var(--accent-primary)] blur-2xl opacity-20 pointer-events-none scale-110" />
                    <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=290&auto=format&fit=crop"
                        alt="Nithin Kamath"
                        className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-2 border-[var(--accent-primary)]/40 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 z-20 bg-[var(--accent-primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
                        CEO
                    </div>
                </div>

                {/* Bio */}
                <div className="flex-1 text-left space-y-3">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] transition-colors duration-300">Nithin Kamath</h3>
                        <p className="text-sm text-[var(--accent-primary)] font-semibold">Founder & CEO</p>
                    </div>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
                        Nithin bootstrapped and founded MoneyDock in 2010 to overcome the hurdles he faced during his decade-long stint as a trader. Today, MoneyDock has changed the landscape of the Indian broking industry.
                    </p>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
                        He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC). Playing basketball is his zen.
                    </p>
                    {/* Social links */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        {[
                            { icon: Globe, label: 'Homepage' },
                            { icon: MessageCircle, label: 'TradingQnA' },
                            { icon: Twitter, label: 'Twitter' },
                        ].map(({ icon: Icon, label }) => (
                            <a key={label} href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--accent-primary)] hover:opacity-75 transition-opacity border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 rounded-full px-3 py-1">
                                <Icon size={12} />
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Team Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {teamMembers.map((member, idx) => (
                    <div key={idx} className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 hover:shadow-lg transition-all duration-200">

                        {/* Avatar */}
                        <div className="relative mb-4">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-[var(--border-primary)] group-hover:border-[var(--accent-primary)]/40 transition-colors shadow-sm"
                            />
                            <div className="absolute inset-0 rounded-full bg-[var(--accent-primary)] opacity-0 group-hover:opacity-10 transition-opacity" />
                        </div>

                        {/* Name & Role */}
                        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-300">{member.name}</h3>
                        <p className="text-xs text-[var(--accent-primary)] font-medium mt-1 mb-3">{member.role}</p>

                        {/* Bio Toggle */}
                        <button
                            onClick={() => setOpenBio(openBio === idx ? null : idx)}
                            className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors font-medium"
                        >
                            Bio
                            <ChevronDown size={13} className={`transition-transform duration-200 ${openBio === idx ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`text-[13px] text-[var(--text-secondary)] leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${openBio === idx ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                            <p>{member.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Team;
