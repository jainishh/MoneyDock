import React from 'react';

const LeftSection = ({
    imageUrl,
    title,
    description,
    tryDemo,
    learnMore,
    googlePlay,
    appStore
}) => {
    return (
        <div className="container mx-auto px-4 py-16 transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">

                {/* Left Image Placeholder */}
                <div className="w-full md:w-2/3 p-4">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-auto drop-shadow-xl rounded-xl" />
                    ) : (
                        <div className="w-full aspect-[16/10] bg-[var(--bg-card)] border-2 border-dashed border-[color:var(--border-primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-sm)] transition-all duration-300">
                            <span className="text-[var(--text-muted)] font-medium">Image Placeholder ({title})</span>
                        </div>
                    )}
                </div>

                {/* Right Text Content */}
                <div className="w-full md:w-1/3 leading-relaxed">
                    <h2 className="text-3xl font-medium text-[var(--text-primary)] mb-6 transition-colors duration-300">
                        {title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-[15px] transition-colors duration-300">
                        {description}
                    </p>

                    {/* Action Links */}
                    <div className="flex items-center gap-6 mb-8">
                        {tryDemo && (
                            <a href={tryDemo} className="text-[color:var(--accent-primary)] hover:opacity-80 font-medium text-[15px]">
                                Try demo &rarr;
                            </a>
                        )}
                        {learnMore && (
                            <a href={learnMore} className="text-[color:var(--accent-primary)] hover:opacity-80 font-medium text-[15px]">
                                Learn more &rarr;
                            </a>
                        )}
                    </div>

                    {/* App Badges */}
                    <div className="flex items-center gap-4">
                        {googlePlay && (
                            <a href={googlePlay} className="opacity-80 hover:opacity-100 transition-opacity">
                                <div className="h-10 w-32 bg-[var(--text-primary)] rounded-md flex items-center justify-center text-[var(--bg-main)] text-xs font-bold">
                                    Google Play
                                </div>
                            </a>
                        )}
                        {appStore && (
                            <a href={appStore} className="opacity-80 hover:opacity-100 transition-opacity">
                                <div className="h-10 w-32 bg-[var(--text-primary)] rounded-md flex items-center justify-center text-[var(--bg-main)] text-xs font-bold">
                                    App Store
                                </div>
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeftSection;
