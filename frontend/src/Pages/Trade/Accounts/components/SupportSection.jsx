import React, { useState } from 'react';
import { HelpCircle, Ticket, FileText, ShieldCheck, ChevronRight } from 'lucide-react';
import SupportModal from '../../../../Components/Support/SupportModal';
import { HelpSupportContent, RaiseTicketContent, TermsContent, PrivacyContent } from '../../../../Components/Support/SupportContent';

const SupportSection = () => {
    const [activeItem, setActiveItem] = useState(null);

    const supportItems = [
        {
            id: 'help',
            label: "Help & Support",
            icon: <HelpCircle size={18} />,
            color: "text-blue-500",
            content: <HelpSupportContent />
        },
        {
            id: 'ticket',
            label: "Raise a Ticket",
            icon: <Ticket size={18} />,
            color: "text-emerald-500",
            content: <RaiseTicketContent />
        },
        {
            id: 'terms',
            label: "Terms & Conditions",
            icon: <FileText size={18} />,
            color: "text-orange-500",
            content: <TermsContent />
        },
        {
            id: 'privacy',
            label: "Privacy Policy",
            icon: <ShieldCheck size={18} />,
            color: "text-purple-500",
            content: <PrivacyContent />
        }
    ];

    const currentItem = supportItems.find(item => item.id === activeItem);

    return (
        <div className="mt-12">
            <h2 className="text-[var(--text-primary)] text-lg font-extrabold mb-6 tracking-tight">Support & Legal</h2>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-sm)] divide-y divide-[var(--border-primary)] overflow-hidden">
                {supportItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className="w-full flex items-center justify-between p-5 hover:bg-[var(--bg-card)]/50 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-[var(--bg-main)] ${item.color} shadow-sm border border-[var(--border-primary)]`}>
                                {item.icon}
                            </div>
                            <span className="text-[var(--text-primary)] text-sm font-bold opacity-90 group-hover:opacity-100">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            {/* Modal for Support Content */}
            <SupportModal
                isOpen={!!activeItem}
                onClose={() => setActiveItem(null)}
                title={currentItem?.label}
                icon={currentItem?.icon}
            >
                {currentItem?.content}
            </SupportModal>

            {/* Logout Shortcut (Alternative placement for mobile accessibility) */}
            <div className="mt-8 px-4">
                <p className="text-[var(--text-muted)] text-[10px] text-center font-bold uppercase tracking-[0.2em] opacity-60">
                    Trusted by over 1M+ traders
                </p>
            </div>
        </div>
    );
};

export default SupportSection;
