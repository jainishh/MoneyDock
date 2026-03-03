import React, { useState } from 'react';
import {
    TrendingUp, DollarSign, Cpu, Calculator, ArrowRight,
    BarChart2, Percent, RepeatIcon, BadgePercent, Shield, Stamp
} from 'lucide-react';

const tabs = [
    { id: 'equity', label: 'Equity', icon: TrendingUp },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'commodity', label: 'Commodity', icon: Cpu },
];

/* ── Row icons per charge type ── */
const chargeIcons = {
    'Brokerage': BarChart2,
    'STT/CTT': Percent,
    'Transaction charges': RepeatIcon,
    'GST': BadgePercent,
    'SEBI charges': Shield,
    'Stamp charges': Stamp,
};

const equityData = [
    { charge: 'Brokerage', delivery: 'Zero Brokerage', intraday: '0.03% or ₹20/order (lower)', futures: '0.03% or ₹20/order (lower)', options: 'Flat ₹20/order' },
    { charge: 'STT/CTT', delivery: '0.1% on buy & sell', intraday: '0.025% on sell side', futures: '0.02% on sell side', options: '0.125% intrinsic value\n0.1% sell side (on premium)' },
    { charge: 'Transaction charges', delivery: 'NSE: 0.00297%\nBSE: 0.00375%', intraday: 'NSE: 0.00297%\nBSE: 0.00375%', futures: 'NSE: 0.00173%\nBSE: 0', options: 'NSE: 0.03503%\nBSE: 0.0325% (on premium)' },
    { charge: 'GST', delivery: '18% on brokerage + charges', intraday: '18% on brokerage + charges', futures: '18% on brokerage + charges', options: '18% on brokerage + charges' },
    { charge: 'SEBI charges', delivery: '₹10 / crore', intraday: '₹10 / crore', futures: '₹10 / crore', options: '₹10 / crore' },
    { charge: 'Stamp charges', delivery: '0.015% or ₹1500/crore (buy)', intraday: '0.003% or ₹300/crore (buy)', futures: '0.002% or ₹200/crore (buy)', options: '0.003% or ₹300/crore (buy)' },
];

const currencyData = [
    { charge: 'Brokerage', futures: '0.03% or ₹20/order (lower)', options: '₹20/order' },
    { charge: 'STT/CTT', futures: 'No STT', options: 'No STT' },
    { charge: 'Transaction charges', futures: 'NSE: 0.00035%\nBSE: 0.00045%', options: 'NSE: 0.0311%\nBSE: 0.001%' },
    { charge: 'GST', futures: '18% on brokerage + charges', options: '18% on brokerage + charges' },
    { charge: 'SEBI charges', futures: '₹10 / crore', options: '₹10 / crore' },
    { charge: 'Stamp charges', futures: '0.0001% or ₹10/crore (buy)', options: '0.0001% or ₹10/crore (buy)' },
];

const commodityData = [
    { charge: 'Brokerage', futures: '0.03% or ₹20/order (lower)', options: '₹20/order' },
    { charge: 'STT/CTT', futures: '0.01% on sell (Non-Agri)', options: '0.05% on sell side' },
    { charge: 'Transaction charges', futures: 'MCX: 0.0021%\nNSE: 0.0001%', options: 'MCX: 0.0418%\nNSE: 0.001%' },
    { charge: 'GST', futures: '18% on brokerage + charges', options: '18% on brokerage + charges' },
    { charge: 'SEBI charges', futures: 'Agri: ₹1/crore\nNon-agri: ₹10/crore', options: '₹10 / crore' },
    { charge: 'Stamp charges', futures: '0.002% or ₹200/crore (buy)', options: '0.003% or ₹300/crore (buy)' },
];

/* ── Highlight certain values ── */
const HighlightCell = ({ value }) => {
    if (!value) return null;
    const isZero = value === 'Zero Brokerage' || value === 'No STT';
    const isFlat = value === 'Flat ₹20/order' || value === '₹20/order';
    return (
        <span className={
            isZero ? 'inline-block text-emerald-400 font-semibold' :
                isFlat ? 'inline-block text-[color:var(--accent-primary)] font-semibold' :
                    ''
        }>
            {value}
        </span>
    );
};

const Th = ({ children }) => (
    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-left">
        {children}
    </th>
);

const Td = ({ children, isLabel }) => (
    <td className={`px-5 py-4 text-[13px] align-top whitespace-pre-line leading-relaxed ${isLabel
            ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)]/60 w-[160px]'
            : 'text-[var(--text-secondary)]'
        }`}>
        {children}
    </td>
);

const TableWrapper = ({ children }) => (
    <div className="overflow-x-auto w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
            {children}
        </table>
    </div>
);

const LabelCell = ({ charge }) => {
    const Icon = chargeIcons[charge];
    return (
        <td className="px-5 py-4 align-top w-[160px] bg-[var(--bg-secondary)]/60">
            <div className="flex items-start gap-2">
                {Icon && <Icon size={14} className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />}
                <span className="font-semibold text-[13px] text-[var(--text-primary)]">{charge}</span>
            </div>
        </td>
    );
};

const EquityTable = () => (
    <TableWrapper>
        <thead>
            <tr className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/5 border-b border-[var(--border-primary)]">
                <Th />
                <Th>Equity Delivery</Th>
                <Th>Equity Intraday</Th>
                <Th>F&amp;O – Futures</Th>
                <Th>F&amp;O – Options</Th>
            </tr>
        </thead>
        <tbody>
            {equityData.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)]/40 transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--bg-secondary)]/20'}`}>
                    <LabelCell charge={row.charge} />
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed"><HighlightCell value={row.delivery} /></td>
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.intraday} /></td>
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.futures} /></td>
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.options} /></td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const CurrencyTable = () => (
    <TableWrapper>
        <thead>
            <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border-b border-[var(--border-primary)]">
                <Th />
                <Th>Currency Futures</Th>
                <Th>Currency Options</Th>
            </tr>
        </thead>
        <tbody>
            {currencyData.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)]/40 transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--bg-secondary)]/20'}`}>
                    <LabelCell charge={row.charge} />
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.futures} /></td>
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.options} /></td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const CommodityTable = () => (
    <TableWrapper>
        <thead>
            <tr className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border-b border-[var(--border-primary)]">
                <Th />
                <Th>Commodity Futures</Th>
                <Th>Commodity Options</Th>
            </tr>
        </thead>
        <tbody>
            {commodityData.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)]/40 transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--bg-secondary)]/20'}`}>
                    <LabelCell charge={row.charge} />
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.futures} /></td>
                    <td className="px-5 py-4 text-[13px] align-top text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"><HighlightCell value={row.options} /></td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const Brokerage = () => {
    const [activeTab, setActiveTab] = useState('equity');

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl transition-colors duration-300">

            {/* Tab Bar — pill style */}
            <div
                className="flex gap-2 mb-6 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`.tab-scroll-b::-webkit-scrollbar { display: none; }`}</style>
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 py-2 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 border ${activeTab === id
                                ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-md'
                                : 'text-[var(--text-muted)] border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-secondary)] bg-[var(--bg-card)]'
                            }`}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tables */}
            {activeTab === 'equity' && <EquityTable />}
            {activeTab === 'currency' && <CurrencyTable />}
            {activeTab === 'commodity' && <CommodityTable />}

            {/* Footer CTA */}
            <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Calculator size={16} className="text-[var(--text-muted)]" />
                <p className="text-[15px] text-[var(--text-secondary)]">
                    <a href="#" className="inline-flex items-center gap-1 text-[color:var(--accent-primary)] hover:opacity-80 transition-colors font-medium">
                        Calculate your costs upfront <ArrowRight size={14} />
                    </a>
                    {' '}using our brokerage calculator
                </p>
            </div>
        </div>
    );
};

export default Brokerage;
