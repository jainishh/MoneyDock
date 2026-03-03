import React from 'react';

const RightSection = ({
    imageUrl,
    title,
    description,
    learnMore
}) => {
    return (
        <div className="container mx-auto px-4 py-16 transition-colors duration-300">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">

                {/* Left Text Content */}
                <div className="w-full md:w-1/3 leading-relaxed">
                    <h2 className="text-3xl font-medium text-[var(--text-primary)] mb-6 transition-colors duration-300">
                        {title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-[15px] transition-colors duration-300">
                        {description}
                    </p>
                    {learnMore && (
                        <a href={learnMore} className="text-[color:var(--accent-primary)] hover:opacity-80 font-medium text-[15px]">
                            {title === "Kite Connect API" ? "Kite Connect \u2192" : "Learn more \u2192"}
                        </a>
                    )}
                </div>

                {/* Right Image Placeholder */}
                <div className="w-full md:w-2/3 p-4">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-auto drop-shadow-xl rounded-xl" />
                    ) : (
                        <div className="w-full aspect-[16/10] bg-[var(--bg-card)] border-2 border-dashed border-[color:var(--border-primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-sm)] transition-all duration-300">
                            <span className="text-[var(--text-muted)] font-medium">Image Placeholder ({title})</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RightSection;
