import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Zap, IndianRupee } from "lucide-react";

const features = [
    { icon: IndianRupee, text: '₹0 account opening' },
    { icon: Zap, text: 'Flat ₹20 intraday & F&O' },
    { icon: ShieldCheck, text: 'SEBI regulated & secure' },
];

function OpenAccount() {
    const navigate = useNavigate();

    return (
        <div className="relative container mx-auto px-4 py-28 text-center overflow-hidden">

            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[var(--accent-primary)] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />

            {/* Top divider */}
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 mx-auto mb-10" />

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5 tracking-tight leading-tight transition-colors duration-300">
                Open a{' '}
                <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    MoneyDock
                </span>{' '}
                account
            </h2>

            {/* Subtitle */}
            <p className="text-[18px] text-[var(--text-muted)] mb-10 max-w-xl mx-auto leading-relaxed transition-colors duration-300">
                Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&amp;O trades.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {features.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-sm">
                        <Icon size={14} className="text-[var(--accent-primary)]" />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">{text}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-[var(--accent-primary)] blur-xl opacity-40 scale-110 pointer-events-none" />
                    <button
                        className="relative inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 text-white font-semibold py-3.5 px-10 rounded-lg text-[17px] transition-all duration-200 shadow-[var(--shadow-accent)] border border-[#5c6bc0]"
                        onClick={() => { window.scrollTo(0, 0); navigate("/signup"); }}
                    >
                        Sign up for free
                        <ArrowUpRight size={20} />
                    </button>
                </div>
                <button
                    onClick={() => navigate("/pricing")}
                    className="inline-flex items-center gap-1.5 text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                    See pricing <ArrowUpRight size={15} />
                </button>
            </div>
        </div>
    );
}

export default OpenAccount;
