import React from 'react';
import {
    BarChart2, LayoutDashboard, PiggyBank, Code2, BookOpen,
    Zap, LineChart, Smartphone, ArrowRight, Globe, Wifi, ShieldCheck,
    TrendingUp, AlertCircle, FileText, Layers
} from 'lucide-react';

const products = [
    {
        id: 'trade',
        icon: BarChart2,
        color: 'from-blue-500/15 to-indigo-500/5',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-400',
        badge: 'Trading Platform',
        badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        name: 'MoneyDock Trade',
        tagline: 'Our ultra-fast flagship trading platform',
        desc: 'Lightning-fast order execution with live streaming market data, advanced charting tools, a clean elegant UI, and full F&O support. Available on web, Android, and iOS.',
        features: [
            { icon: Zap, text: 'Ultra-low latency execution' },
            { icon: LineChart, text: 'Advanced charting & indicators' },
            { icon: Smartphone, text: 'Android & iOS apps' },
        ],
        links: [
            { label: 'Try demo', href: '#' },
            { label: 'Learn more', href: '#' },
        ],
        stores: true,
    },
    {
        id: 'console',
        icon: LayoutDashboard,
        color: 'from-purple-500/15 to-violet-500/5',
        border: 'border-purple-500/20',
        iconColor: 'text-purple-400',
        badge: 'Dashboard',
        badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        name: 'MoneyDock Console',
        tagline: 'Your central account dashboard',
        desc: 'Track your entire portfolio in one place. Get in-depth P&L reports, tax summaries, fund statements, and beautiful visualisations of your investment journey.',
        features: [
            { icon: TrendingUp, text: 'P&L analytics & reports' },
            { icon: FileText, text: 'Tax & fund statements' },
            { icon: ShieldCheck, text: 'Secure account management' },
        ],
        links: [
            { label: 'Learn more', href: '#' },
        ],
        stores: false,
    },
    {
        id: 'funds',
        icon: PiggyBank,
        color: 'from-emerald-500/15 to-teal-500/5',
        border: 'border-emerald-500/20',
        iconColor: 'text-emerald-400',
        badge: 'Mutual Funds',
        badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        name: 'MoneyDock Funds',
        tagline: 'Commission-free direct mutual funds',
        desc: 'Invest in direct mutual funds online with ₹0 commission, delivered directly to your Demat account. Browse, compare, and invest in thousands of funds effortlessly.',
        features: [
            { icon: Layers, text: '2,000+ direct mutual funds' },
            { icon: AlertCircle, text: '₹0 commission, no hidden fees' },
            { icon: Smartphone, text: 'Mobile SIP management' },
        ],
        links: [
            { label: 'Learn more', href: '#' },
        ],
        stores: true,
    },
    {
        id: 'api',
        icon: Code2,
        color: 'from-orange-500/15 to-amber-500/5',
        border: 'border-orange-500/20',
        iconColor: 'text-orange-400',
        badge: 'Developer API',
        badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        name: 'MoneyDock API',
        tagline: 'Build on top of our trading infrastructure',
        desc: 'Integrate live market data, execute trades, and build powerful fintech products with our clean HTTP/JSON APIs. Perfect for developers, algo traders, and startups.',
        features: [
            { icon: Globe, text: 'REST & WebSocket APIs' },
            { icon: Wifi, text: 'Real-time data streaming' },
            { icon: Code2, text: 'SDKs for Python & Node.js' },
        ],
        links: [
            { label: 'View API docs', href: '#' },
        ],
        stores: false,
    },
    {
        id: 'learn',
        icon: BookOpen,
        color: 'from-pink-500/15 to-rose-500/5',
        border: 'border-pink-500/20',
        iconColor: 'text-pink-400',
        badge: 'Education',
        badgeColor: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
        name: 'MoneyDock Learn',
        tagline: 'Stock market education for everyone',
        desc: 'An easy-to-grasp collection of stock market lessons with in-depth coverage and illustrations. Content is broken into bite-size modules to help you learn at your own pace.',
        features: [
            { icon: BookOpen, text: '200+ structured chapters' },
            { icon: Smartphone, text: 'Learn on mobile, anytime' },
            { icon: ShieldCheck, text: 'Free — no subscription needed' },
        ],
        links: [
            { label: 'Start learning', href: '#' },
        ],
        stores: true,
    },
];

const ProductCard = ({ product, reverse }) => {
    const { icon: Icon, color, border, iconColor, badge, badgeColor, name, tagline, desc, features, links, stores } = product;
    return (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-start p-6 md:p-10 rounded-2xl bg-gradient-to-br ${color} border ${border} transition-all duration-200`}>

            {/* Icon side */}
            <div className="flex-shrink-0 w-full md:w-[200px] flex flex-col items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-[var(--bg-card)] border ${border} flex items-center justify-center shadow-sm`}>
                    <Icon size={26} className={iconColor} />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest ${badgeColor}`}>{badge}</span>

                {/* Feature bullets */}
                <div className="space-y-2.5 mt-2">
                    {features.map(({ icon: FIcon, text }) => (
                        <div key={text} className="flex items-center gap-2.5">
                            <FIcon size={13} className={iconColor} />
                            <span className="text-[12.5px] text-[var(--text-secondary)]">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Text side */}
            <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight transition-colors duration-300">{name}</h2>
                <p className={`text-sm font-semibold mb-4 ${iconColor}`}>{tagline}</p>
                <p className="text-[14.5px] text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xl transition-colors duration-300">{desc}</p>

                {/* Links */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    {links.map(({ label, href }) => (
                        <a key={label} href={href} className={`inline-flex items-center gap-1 text-[13px] font-semibold ${iconColor} hover:opacity-75 transition-opacity`}>
                            {label} <ArrowRight size={13} />
                        </a>
                    ))}
                </div>

                {/* App store badges */}
                {stores && (
                    <div className="flex flex-wrap gap-3">
                        {['Google Play', 'App Store'].map(store => (
                            <a key={store} href="#" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 rounded-lg px-3.5 py-2 transition-colors shadow-sm">
                                <Smartphone size={13} />
                                {store}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductSections = () => (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {products.map((p, i) => (
            <ProductCard key={p.id} product={p} reverse={i % 2 !== 0} />
        ))}
    </div>
);

export default ProductSections;
