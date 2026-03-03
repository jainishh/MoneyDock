import React from 'react';

const AppVersion = () => {
    return (
        <div className="mt-16 pb-8 flex flex-col items-center justify-center opacity-40">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-600 rounded flex items-center justify-center text-[8px] font-black text-white">
                    OM
                </div>
                <span className="text-[var(--text-primary)] text-xs font-black tracking-tighter">OUR MARKET</span>
            </div>
            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">Version 1.0.0 (Beta)</p>
        </div>
    );
};

export default AppVersion;
