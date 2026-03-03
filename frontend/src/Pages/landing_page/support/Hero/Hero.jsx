import React from "react";
import { Search, Headphones, Ticket, MessageCircle, BookOpen } from "lucide-react";

const suggestions = [
    "How do I open my account?",
    "How do I activate F&O?",
    "How to add funds?",
    "What are intraday margins?",
];

function Hero() {
    return (
        <div className="w-full border-b border-[var(--border-primary)] transition-colors duration-300 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 60%, color-mix(in srgb, var(--accent-primary) 8%, var(--bg-card)) 100%)'
            }}
        >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--accent-primary)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 max-w-5xl py-14 relative z-10">
                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center shadow-sm">
                            <Headphones size={26} className="text-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-[var(--text-primary)] text-3xl leading-tight">
                                Support{' '}
                                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                                    Portal
                                </span>
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm mt-1">How can we help you today?</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg px-4 py-2.5 transition-all hover:border-[var(--accent-primary)]/40">
                            <MessageCircle size={15} />
                            Chat with us
                        </a>
                        <button className="inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 text-white rounded-lg py-2.5 px-5 font-semibold text-sm transition-all shadow-md">
                            <Ticket size={15} />
                            My Tickets
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div className="mt-8">
                    <div className="w-full max-w-[700px] bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl flex items-center py-3.5 px-4 shadow-lg transition-all focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20">
                        <Search size={20} strokeWidth={2} className="mr-3 text-[var(--text-muted)] flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Eg: How do I open my account, How do I activate F&O..."
                            className="border-none outline-none w-full text-[15px] text-[var(--text-primary)] bg-transparent placeholder-[var(--text-muted)]"
                        />
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-primary)] text-[10px] text-[var(--text-muted)] font-mono">⌘K</kbd>
                    </div>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
                        <BookOpen size={11} /> Popular:
                    </span>
                    {suggestions.map(s => (
                        <button key={s} className="text-xs bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 text-[var(--text-secondary)] hover:text-[color:var(--accent-primary)] rounded-full px-3 py-1 transition-all">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Hero;
