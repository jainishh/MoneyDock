import React, { useState, useRef, useEffect } from "react";
import {
    PlusCircle, UserCircle, Globe, IndianRupee, AtSign, PiggyBank,
    ChevronDown, ChevronUp, Bell, ArrowRight, Zap
} from 'lucide-react';

const categories = [
    {
        icon: PlusCircle, label: 'Account Opening', color: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20',
        links: ['Resident individual', 'Minor', 'Non Resident Indian (NRI)', 'Company, Partnership, HUF and LLP', 'Glossary']
    },
    {
        icon: UserCircle, label: 'Your MoneyDock Account', color: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20',
        links: ['Your Profile', 'Account modification', 'Client Master Report (CMR) and DP', 'Nomination', 'Transfer and conversion of securities']
    },
    {
        icon: Globe, label: 'Trading Platform', color: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        links: ['IPO', 'Trading FAQs', 'Margin Trading Facility (MTF) and Margins', 'Charts and orders', 'Alerts and Nudges', 'General']
    },
    {
        icon: IndianRupee, label: 'Funds', color: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20',
        links: ['Add money', 'Withdraw money', 'Add bank accounts', 'eMandates']
    },
    {
        icon: AtSign, label: 'Console', color: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        links: ['Portfolio', 'Corporate actions', 'Funds statement', 'Reports', 'Profile', 'Segments']
    },
    {
        icon: PiggyBank, label: 'MoneyDock Funds', color: 'text-pink-400', iconBg: 'bg-pink-500/10 border-pink-500/20',
        links: ['Mutual funds', 'National Pension Scheme (NPS)', 'Fixed Deposit (FD)', 'Features', 'Payments and Orders', 'General']
    },
];

const quickLinks = [
    'Track account opening',
    'Track segment activation',
    'Intraday margins',
    'Platform user manual',
    'Charges & fees',
    'Contact support',
];

const announcements = [
    'Exclusion of F&O contracts on 8 securities from August 29, 2025',
    'Revision in expiry day of Index and Stock derivatives contracts',
];

/* ── Accordion Item ── */
function AccordionItem({ icon: Icon, label, color, iconBg, links, expanded, onClick }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(expanded && contentRef.current ? contentRef.current.scrollHeight : 0);
    }, [expanded]);

    return (
        <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${expanded ? 'border-[var(--accent-primary)]/30 shadow-md' : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/20'} bg-[var(--bg-card)]`}>
            <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                onClick={onClick}
            >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${expanded ? iconBg : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'}`}>
                    <Icon size={17} className={expanded ? color : 'text-[var(--text-muted)]'} />
                </div>
                <span className={`font-semibold text-[15px] flex-1 transition-colors ${expanded ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                    {label}
                </span>
                {expanded
                    ? <ChevronUp size={17} className={color} />
                    : <ChevronDown size={17} className="text-[var(--text-muted)]" />
                }
            </button>

            <div
                ref={contentRef}
                style={{ height: `${height}px`, opacity: expanded ? 1 : 0 }}
                className="transition-all duration-300 ease-in-out overflow-hidden border-t border-[var(--border-primary)]"
            >
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {links.map((link, i) => (
                        <a key={i} href="#"
                            className={`flex items-center gap-2 text-[13.5px] font-medium ${color} hover:opacity-75 transition-opacity py-1`}
                        >
                            <ArrowRight size={13} />
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MainContent() {
    const [openIndex, setOpenIndex] = useState(-1);

    return (
        <div className="pb-20">
            <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8 max-w-6xl">

                {/* ── Left: Accordion ── */}
                <div className="w-full md:w-2/3 space-y-3">
                    {categories.map((cat, i) => (
                        <AccordionItem
                            key={i}
                            {...cat}
                            expanded={openIndex === i}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>

                {/* ── Right: Notices + Quick Links ── */}
                <div className="w-full md:w-1/3 flex flex-col gap-5">

                    {/* Announcements */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-500/20">
                            <Bell size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Announcements</span>
                        </div>
                        <ul className="px-5 py-4 space-y-3">
                            {announcements.map((ann, i) => (
                                <li key={i} className="flex gap-2.5 text-[13.5px]">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                    <a href="#" className="text-[var(--text-secondary)] hover:text-amber-400 transition-colors leading-relaxed">
                                        {ann}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                            <Zap size={14} className="text-[var(--accent-primary)]" />
                            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Quick Links</span>
                        </div>
                        <div className="divide-y divide-[var(--border-primary)]">
                            {quickLinks.map((link, i) => (
                                <a key={i} href="#"
                                    className="flex items-center gap-3 px-5 py-3.5 text-[13.5px] font-medium text-[color:var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-colors group"
                                >
                                    <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)]/10 text-[10px] font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent-primary)]/20">
                                        {i + 1}
                                    </span>
                                    {link}
                                    <ArrowRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MainContent;
