import React from 'react';
import { LayoutDashboard, ArrowRight, Zap, Shield, Smartphone } from 'lucide-react';

const highlights = [
    { icon: Zap, text: 'Lightning fast execution' },
    { icon: Shield, text: 'Bank-grade security' },
    { icon: Smartphone, text: 'Web & mobile apps' },
];

const Hero = () => {
    return (
        <div className="relative container mx-auto px-4 py-20 text-center mt-12 border-b border-[color:var(--border-primary)] mb-16 overflow-hidden transition-colors duration-300">

            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[var(--accent-primary)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-6">
                <LayoutDashboard size={13} className="text-[var(--accent-primary)]" />
                <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Our Products</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-[54px] font-bold text-[var(--text-primary)] mb-5 tracking-tight leading-tight transition-colors duration-300">
                MoneyDock{' '}
                <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Products
                </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed transition-colors duration-300">
                Sleek, modern, and intuitive trading platforms built for every kind of investor.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {highlights.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-sm">
                        <Icon size={13} className="text-[var(--accent-primary)]" />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">{text}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <a href="#" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--accent-primary)] hover:opacity-80 transition-opacity">
                Check out our investment offerings <ArrowRight size={15} />
            </a>
        </div>
    );
};

export default Hero;
