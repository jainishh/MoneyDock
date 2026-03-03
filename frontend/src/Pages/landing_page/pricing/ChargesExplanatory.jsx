import React from 'react';
import {
    Landmark, ArrowLeftRight, PhoneCall, Stamp, Globe,
    Percent, Shield, Building2, Lock, CalendarClock,
    Briefcase, Send, FileText
} from 'lucide-react';

/* ── Color palette per card ── */
const colorThemes = [
    { bg: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/25', icon: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20' },
    { bg: 'from-purple-500/15 to-purple-500/5', border: 'border-purple-500/25', icon: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20' },
    { bg: 'from-orange-500/15 to-orange-500/5', border: 'border-orange-500/25', icon: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20' },
    { bg: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/25', icon: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20' },
    { bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/25', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20' },
    { bg: 'from-pink-500/15 to-pink-500/5', border: 'border-pink-500/25', icon: 'text-pink-400', iconBg: 'bg-pink-500/10 border-pink-500/20' },
    { bg: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/25', icon: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20' },
    { bg: 'from-indigo-500/15 to-indigo-500/5', border: 'border-indigo-500/25', icon: 'text-indigo-400', iconBg: 'bg-indigo-500/10 border-indigo-500/20' },
    { bg: 'from-rose-500/15 to-rose-500/5', border: 'border-rose-500/25', icon: 'text-rose-400', iconBg: 'bg-rose-500/10 border-rose-500/20' },
    { bg: 'from-teal-500/15 to-teal-500/5', border: 'border-teal-500/25', icon: 'text-teal-400', iconBg: 'bg-teal-500/10 border-teal-500/20' },
    { bg: 'from-violet-500/15 to-violet-500/5', border: 'border-violet-500/25', icon: 'text-violet-400', iconBg: 'bg-violet-500/10 border-violet-500/20' },
    { bg: 'from-sky-500/15 to-sky-500/5', border: 'border-sky-500/25', icon: 'text-sky-400', iconBg: 'bg-sky-500/10 border-sky-500/20' },
    { bg: 'from-lime-500/15 to-lime-500/5', border: 'border-lime-500/25', icon: 'text-lime-400', iconBg: 'bg-lime-500/10 border-lime-500/20' },
];

const charges = [
    {
        icon: Landmark,
        title: 'Securities/Commodities transaction tax',
        content: [
            'Tax by the government when transacting on the exchanges. Charged as above on both buy and sell sides when trading equity delivery. Charged only on selling side when trading intraday or on F&O.',
            'STT/CTT can be a lot more than the brokerage we charge. Important to keep a tab.'
        ]
    },
    {
        icon: ArrowLeftRight,
        title: 'Transaction/Turnover Charges',
        content: [
            'Charged by exchanges (NSE, BSE, MCX) on the value of your transactions.',
            'BSE has revised charges in XC, XD, XT, Z and ZP groups to ₹10,000 per crore w.e.f 01.01.2016.',
            'BSE revised SS and ST groups to ₹1,00,000 per crore of gross turnover.',
            'BSE revised group A, B and others at ₹375 per crore w.e.f. December 1, 2022.',
            'BSE revised M, MT, TS and MS groups to ₹275 per crore of gross turnover.'
        ]
    },
    {
        icon: PhoneCall,
        title: 'Call & trade',
        content: ['Additional charges of ₹50 per order for orders placed through a dealer, including auto square off orders.']
    },
    {
        icon: Stamp,
        title: 'Stamp charges',
        content: ['Stamp charges by the Government of India as per the Indian Stamp Act of 1899 for transacting in instruments on stock exchanges and depositories.']
    },
    {
        icon: Globe,
        title: 'NRI brokerage charges',
        isList: true,
        listItems: [
            '₹100 per order for futures and options.',
            'Non-PIS account: 0.5% or ₹100 per executed equity order (lower).',
            'PIS account: 0.5% or ₹200 per executed equity order (lower).',
            '₹500 + GST yearly account maintenance charges (AMC).'
        ]
    },
    {
        icon: Percent,
        title: 'GST',
        content: ['Tax levied by the government on services rendered. 18% of (brokerage + SEBI charges + transaction charges).']
    },
    {
        icon: Shield,
        title: 'SEBI Charges',
        content: ['Charged at ₹10 per crore + GST by the Securities and Exchange Board of India for regulating the markets.']
    },
    {
        icon: Building2,
        title: 'DP (Depository participant) charges',
        content: [
            '₹15.34 per scrip (₹3.5 CDSL fee + ₹9.5 platform fee + ₹2.34 GST) is charged on the trading account ledger when stocks are sold, irrespective of quantity.',
            'Female demat account holders (as first holder) enjoy a discount of ₹0.25 per transaction on the CDSL fee.',
            'Debit transactions of mutual funds & bonds get an additional discount of ₹0.25 on the CDSL fee.'
        ]
    },
    {
        icon: Lock,
        title: 'Pledging charges',
        content: ['₹30 + GST per pledge request per ISIN.']
    },
    {
        icon: CalendarClock,
        title: 'AMC (Account maintenance charges)',
        content: [
            <span key="a">BSDA demat: Zero charges if holding value is less than ₹4,00,000. <a href="#" className="text-[color:var(--accent-primary)] hover:underline font-medium">Learn more about BSDA →</a></span>,
            <span key="b">Non-BSDA demat: ₹300/year + 18% GST charged quarterly (90 days). <a href="#" className="text-[color:var(--accent-primary)] hover:underline font-medium">Learn more about AMC →</a></span>
        ]
    },
    {
        icon: Briefcase,
        title: 'Corporate action order charges',
        content: ['₹20 plus GST for OFS / buyback / takeover / delisting orders placed through Console.']
    },
    {
        icon: Send,
        title: 'Off-market transfer charges',
        content: ['₹0.03% or ₹25/px, whichever is higher, subject to a maximum of ₹25,000 per transaction.']
    },
    {
        icon: FileText,
        title: 'Physical CMR request',
        content: ['First CMR request is free. ₹20 + ₹100 (courier charge) + 18% GST for subsequent requests.']
    }
];

const ChargeCard = ({ icon: Icon, title, content, isList, listItems, theme }) => (
    <div className={`group flex gap-4 p-5 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}>
        {/* Icon */}
        <div className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${theme.iconBg}`}>
            <Icon size={18} className={theme.icon} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <h3 className={`text-[14.5px] font-bold mb-2 transition-colors duration-300 ${theme.icon}`}>
                {title}
            </h3>
            {isList ? (
                <ul className="space-y-1.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {listItems.map((item, i) => (
                        <li key={i} className="flex gap-2">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.icon.replace('text-', 'bg-')}`} />
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="space-y-2 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {content.map((para, i) => <p key={i}>{para}</p>)}
                </div>
            )}
        </div>
    </div>
);

const ChargesExplanatory = () => {
    const left = charges.slice(0, Math.ceil(charges.length / 2));
    const right = charges.slice(Math.ceil(charges.length / 2));

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl transition-colors duration-300">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-[color:var(--border-primary)]">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
                    <FileText size={17} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                    <h2 className="text-[22px] font-bold text-[var(--text-primary)] transition-colors duration-300">
                        Charges explained
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">A breakdown of every fee you may encounter</p>
                </div>
            </div>

            {/* Two column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    {left.map((charge, i) => (
                        <ChargeCard key={i} {...charge} theme={colorThemes[i]} />
                    ))}
                </div>
                <div className="space-y-4">
                    {right.map((charge, i) => (
                        <ChargeCard key={i} {...charge} theme={colorThemes[i + left.length]} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChargesExplanatory;
