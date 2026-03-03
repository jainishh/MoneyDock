import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle, FileText, CheckCircle2, IndianRupee, Landmark } from "lucide-react";

const faqs = [
    {
        icon: HelpCircle,
        color: 'text-blue-400',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        title: "What is a MoneyDock account?",
        answer: (
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                A MoneyDock account is a combined demat and trading account that allows investors to buy, sell, and hold securities digitally — all in one place.
            </p>
        ),
    },
    {
        icon: FileText,
        color: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        title: "What documents are required to open a demat account?",
        answer: (
            <div className="space-y-2">
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-3">You'll need the following to open a MoneyDock account online:</p>
                <ul className="space-y-2">
                    {['PAN number', 'Aadhaar Card (linked with a phone number for OTP)', 'Cancelled cheque or bank account statement', 'Income proof (only for F&O trading)'].map(doc => (
                        <li key={doc} className="flex items-start gap-2 text-[14px] text-[var(--text-secondary)]">
                            <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            {doc}
                        </li>
                    ))}
                </ul>
            </div>
        ),
    },
    {
        icon: CheckCircle2,
        color: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: "Is MoneyDock account opening free?",
        answer: (
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Yes, 100% free. There are <span className="text-emerald-400 font-semibold">no charges</span> for opening an online individual account with MoneyDock.
            </p>
        ),
    },
    {
        icon: IndianRupee,
        color: 'text-orange-400',
        iconBg: 'bg-orange-500/10 border-orange-500/20',
        title: "Are there any maintenance charges for a demat account?",
        answer: (
            <div className="space-y-2 text-[14px] text-[var(--text-secondary)] leading-relaxed">
                <p>AMC depends on your account type:</p>
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span><span className="font-semibold text-emerald-400">BSDA:</span> Zero charges if holdings &lt; ₹4 lakh</span>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
                        <IndianRupee size={13} className="text-orange-400 flex-shrink-0" />
                        <span><span className="font-semibold text-orange-400">Non-BSDA:</span> ₹300/year + GST, charged quarterly</span>
                    </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    <a href="#" className="text-[color:var(--accent-primary)] hover:underline">Learn more about BSDA →</a>
                </p>
            </div>
        ),
    },
    {
        icon: Landmark,
        color: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        title: "Can I open a demat account without a bank account?",
        answer: (
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                You must have a bank account in your name. If UPI verification passes, no additional proof is needed. Otherwise, provide a cancelled cheque or bank statement to link your bank to MoneyDock.
            </p>
        ),
    },
];

function AccordionItem({ icon: Icon, color, iconBg, title, answer, expanded, onClick }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(expanded && contentRef.current ? contentRef.current.scrollHeight : 0);
    }, [expanded, answer]);

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${expanded ? 'border-[var(--accent-primary)]/30 shadow-md' : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/20'} bg-[var(--bg-card)]`}>
            <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                onClick={onClick}
            >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${expanded ? iconBg : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'}`}>
                    <Icon size={16} className={expanded ? color : 'text-[var(--text-muted)]'} />
                </div>
                <span className={`flex-1 font-semibold text-[15px] transition-colors ${expanded ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                    {title}
                </span>
                <ChevronDown
                    size={17}
                    className={`flex-shrink-0 transition-all duration-300 ${expanded ? `rotate-180 ${color}` : 'text-[var(--text-muted)]'}`}
                />
            </button>

            <div
                ref={contentRef}
                style={{ height: `${height}px`, opacity: expanded ? 1 : 0 }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
                <div className="px-5 pb-5 border-t border-[var(--border-primary)] pt-4">
                    {answer}
                </div>
            </div>
        </div>
    );
}

function FAQs() {
    const [openIndex, setOpenIndex] = useState(-1);

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl transition-colors duration-300">

            {/* Header */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-4">
                    <HelpCircle size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">FAQs</span>
                </div>
                <h2 className="text-3xl md:text-[36px] font-bold text-[var(--text-primary)] tracking-tight transition-colors duration-300">
                    Frequently asked{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        questions
                    </span>
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] mt-2">Everything you need to know about opening a MoneyDock account.</p>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <AccordionItem
                        key={i}
                        {...faq}
                        expanded={openIndex === i}
                        onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    />
                ))}
            </div>
        </div>
    );
}

export default FAQs;
