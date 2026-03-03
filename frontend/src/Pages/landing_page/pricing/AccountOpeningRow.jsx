import React from 'react';
import { UserPlus, Globe, Building, Users, CheckCircle2, IndianRupee, CalendarClock, Wallet } from 'lucide-react';

/* ── Tags ── */
const FreeTag = () => (
    <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        <CheckCircle2 size={11} strokeWidth={2.5} /> Free
    </span>
);

const PriceTag = ({ amount }) => (
    <span className="inline-flex items-center gap-1 text-[var(--accent-primary)] font-semibold text-sm">
        <IndianRupee size={13} strokeWidth={2.5} />
        {amount}
    </span>
);

/* ── Data ── */
const accountRows = [
    { icon: UserPlus, label: 'Online account', free: true },
    { icon: Building, label: 'Offline account', free: true },
    { icon: Globe, label: 'NRI account (offline only)', amount: '500' },
    { icon: Users, label: 'Partnership, LLP, HUF, or Corporate (offline only)', amount: '500' },
];

const amcRows = [
    { icon: Wallet, label: 'Up to ₹4 lakh', note: 'BSDA eligible', free: true },
    { icon: Wallet, label: '₹4 lakh – ₹10 lakh', amount: '100 / year, charged quarterly*' },
    { icon: Wallet, label: 'Above ₹10 lakh', amount: '300 / year, charged quarterly' },
];

/* ── Section title ── */
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
            <Icon size={19} className="text-[var(--accent-primary)]" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight transition-colors duration-300">
                {title}
            </h3>
            {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

/* ── Generic 2-col table ── */
const TableCard = ({ headers, rows, gradientClass }) => (
    <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden bg-[var(--bg-card)] shadow-sm">
        {/* Header */}
        <div className={`grid grid-cols-2 border-b border-[var(--border-primary)] px-5 py-3.5 ${gradientClass}`}>
            {headers.map(h => (
                <span key={h} className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{h}</span>
            ))}
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
            <div
                key={i}
                className={`grid grid-cols-2 items-center px-5 py-4 border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--accent-primary)]/5 transition-colors duration-150 ${row.free ? 'bg-emerald-500/5' : i % 2 === 1 ? 'bg-[var(--bg-secondary)]/30' : ''
                    }`}
            >
                {/* Left col */}
                <div className="flex items-center gap-3">
                    {row.icon ? (
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${row.free ? 'bg-emerald-500/10' : 'bg-[var(--accent-primary)]/10'}`}>
                            <row.icon size={13} className={row.free ? 'text-emerald-400' : 'text-[color:var(--accent-primary)]'} />
                        </div>
                    ) : (
                        <IndianRupee size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                    )}
                    <span className="text-sm text-[var(--text-secondary)]">
                        {row.label}
                        {row.note && (
                            <span className="ml-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                {row.note}
                            </span>
                        )}
                    </span>
                </div>

                {/* Right col */}
                <div>
                    {row.free ? <FreeTag /> : <PriceTag amount={row.amount} />}
                </div>
            </div>
        ))}
    </div>
);

const AccountOpeningRow = () => (
    <div className="container mx-auto px-4 py-16 max-w-5xl transition-colors duration-300 space-y-14">

        {/* ── Table 1: Account Opening ── */}
        <div>
            <SectionTitle
                icon={UserPlus}
                title="Charges for account opening"
                subtitle="One-time fee to open your demat & trading account"
            />
            <TableCard
                headers={['Type of account', 'Charges']}
                rows={accountRows}
                gradientClass="bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/5"
            />
        </div>

        {/* ── Table 2: Demat AMC ── */}
        <div>
            <SectionTitle
                icon={CalendarClock}
                title="Demat AMC"
                subtitle="Annual Maintenance Charge based on portfolio value"
            />
            <TableCard
                headers={['Value of holdings', 'AMC']}
                rows={amcRows}
                gradientClass="bg-gradient-to-r from-blue-500/10 to-indigo-500/5"
            />

            <p className="text-[11px] text-[var(--text-muted)] mt-4 leading-relaxed px-1">
                * Lower AMC applies only if the account qualifies as a Basic Services Demat Account (BSDA).
                BSDA holders cannot hold more than one demat account.{' '}
                <a href="#" className="text-[color:var(--accent-primary)] hover:opacity-80 font-medium">
                    Learn more about BSDA →
                </a>
            </p>
        </div>

    </div>
);

export default AccountOpeningRow;
