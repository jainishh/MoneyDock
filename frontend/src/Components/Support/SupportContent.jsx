import React from 'react';
import { HelpCircle, Ticket, FileText, ShieldCheck, Mail, MessageSquare, Phone, ExternalLink } from 'lucide-react';

export const HelpSupportContent = () => (
    <div className="space-y-6">
        <section>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-500" />
                Contact Channels
            </h3>
            <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail size={18} className="text-[var(--text-muted)]" />
                        <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Email Support</p>
                            <p className="text-[10px] text-[var(--text-muted)]">support@ourstockmarket.com</p>
                        </div>
                    </div>
                    <ExternalLink size={14} className="text-[var(--text-muted)]" />
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Phone size={18} className="text-[var(--text-muted)]" />
                        <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Priority Call</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Available 9 AM - 6 PM</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">CALL</span>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Frequently Asked Questions</h3>
            <div className="space-y-2">
                {[
                    "How to complete KYC?",
                    "Steps to withdraw funds",
                    "Understanding order types",
                    "Security best practices"
                ].map((q, i) => (
                    <div key={i} className="p-3 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] flex justify-between items-center hover:text-[var(--text-primary)] cursor-pointer">
                        <span>{q}</span>
                        <ExternalLink size={12} className="opacity-50" />
                    </div>
                ))}
            </div>
        </section>
    </div>
);

export const RaiseTicketContent = () => (
    <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">Need Technical Help?</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Our support team typically responds within 4 working hours for active trading issues.
            </p>
        </div>

        <form className="space-y-4">
            <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Issue Category</label>
                <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors">
                    <option>Order Placement Issue</option>
                    <option>Fund Transfer Query</option>
                    <option>Profile & Account KYC</option>
                    <option>Technical Glitch</option>
                    <option>Feedback/Suggestion</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Description</label>
                <textarea
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                    placeholder="Describe your issue in detail..."
                ></textarea>
            </div>
            <button type="button" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-lg shadow-emerald-500/20">
                SUBMIT TICKET
            </button>
        </form>
    </div>
);

export const TermsContent = () => (
    <div className="prose prose-sm prose-invert max-w-none text-[var(--text-secondary)] space-y-4 text-xs leading-relaxed">
        <p className="font-bold text-[var(--text-primary)]">Last Updated: February 2026</p>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">1. Acceptance of Terms</h4>
            <p>By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">2. Trading Risk</h4>
            <p>Trading in stocks, options, and futures involves substantial risk of loss and is not suitable for every investor. You are solely responsible for your trading decisions.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">3. Account Responsibility</h4>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">4. Service Limitations</h4>
            <p>While we strive for 100% uptime, technical glitches or maintenance may occur. We are not liable for losses resulting from platform unavailability.</p>
        </section>
    </div>
);

export const PrivacyContent = () => (
    <div className="prose prose-sm prose-invert max-w-none text-[var(--text-secondary)] space-y-4 text-xs leading-relaxed">
        <p className="font-bold text-[var(--text-primary)]">Effective Date: Jan 01, 2026</p>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">Data Collection</h4>
            <p>We collect personal information necessary for KYC compliance and platform functionality, including your name, contact details, and financial identifiers.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">Information Usage</h4>
            <p>Your data is used solely to provide services, ensure security, and comply with regulatory requirements from exchange and government authorities.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">Data Security</h4>
            <p>We implement industry-standard AES-256 encryption and multi-factor authentication to protect your sensitive data from unauthorized access.</p>
        </section>
        <section>
            <h4 className="text-[var(--text-primary)] font-bold mb-2">Cookie Policy</h4>
            <p>We use cookies only for session management and performance tracking to enhance your trading experience. We do not sell your data to third parties.</p>
        </section>
    </div>
);
