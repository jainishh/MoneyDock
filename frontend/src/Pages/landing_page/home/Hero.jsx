import React, { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import img1 from '../../../assets/images/imgtwo.png'
import img2 from '../../../assets/images/imgone.png'
import img3 from '../../../assets/images/imgthree.png'

const Hero = () => {
    const images = [
        img1, // Watchlist
        img2,
        img3
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="container mx-auto px-4 pt-4 pb-8 text-center mt-10">

            {/* Smooth Animated Image Slider */}
            <div className="relative w-full max-w-6xl mx-auto h-[280px] sm:h-[370px] md:h-[470px] lg:h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#387ed1] to-purple-600 rounded-full blur-[100px] opacity-10 dark:opacity-20 z-0 pointer-events-none"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Platform Preview ${index + 1}`}
                            className={`absolute z-20 w-[96%] md:w-[40%] lg:w-[60%] mt-30 !max-w-none transition-all duration-1000 ease-in-out ${index === currentImageIndex
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 translate-y-4'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-30 mb-12 mt-16 md:mt-24 flex flex-col items-center">

                {/* Top badge */}
                <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-4 py-1.5 mb-8">
                    <TrendingUp size={14} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">India's fastest growing broker</span>
                </div>

                {/* Heading with gradient */}
                <h1 className="text-4xl md:text-[62px] font-bold text-[var(--text-primary)] mb-6 tracking-tight text-center leading-tight transition-colors duration-300">
                    Invest in{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        everything
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-[18px] md:text-[20px] text-[var(--text-secondary)] mb-8 max-w-xl mx-auto text-center transition-colors duration-300 leading-relaxed font-light">
                    Online platform to invest in stocks, derivatives, mutual funds,
                    ETFs, bonds, and more.
                </p>

                {/* Stat chips */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {[
                        { value: '1.6Cr+', label: 'Customers' },
                        { value: '₹0', label: 'Account opening' },
                        { value: '15%', label: 'Retail trade volume' },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-sm">
                            <span className="text-sm font-bold text-[var(--accent-primary)]">{value}</span>
                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-lg bg-[var(--accent-primary)] blur-xl opacity-40 scale-105 pointer-events-none" />
                        <button className="relative inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 text-white font-semibold py-3.5 px-10 rounded-lg text-[17px] transition-all duration-200 shadow-[var(--shadow-accent)] border border-[#5c6bc0]">
                            Sign up for free
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                    <a href="#" className="inline-flex items-center gap-1.5 text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium">
                        Learn more <ArrowUpRight size={15} />
                    </a>
                </div>

            </div>

        </div>
    );
};

export default Hero;
