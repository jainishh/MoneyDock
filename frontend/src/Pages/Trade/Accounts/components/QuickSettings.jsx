import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useFontSize } from '../../../../context/FontSizeContext';
import { useTheme } from '../../../../context/ThemeContext';

const QuickSettings = () => {
    const { theme, setTheme } = useTheme();
    const { fontSize, setFontSize } = useFontSize();

    const fontOptions = ['Small', 'Medium', 'Large'];
    const themeOptions = [
        { id: 'light', label: 'Light', icon: <Sun size={14} /> },
        { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
        { id: 'system', label: 'System', icon: null }
    ];

    return (
        <div className="mt-4 pt-10">
            <h2 className="text-[var(--text-primary)] text-lg font-extrabold mb-8 tracking-tight">Quick Settings</h2>

            <div className="grid gap-6">
                {/* Font Size */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] group hover:border-[var(--accent-primary)]/30 transition-colors shadow-[var(--shadow-sm)]">
                    <div className="flex flex-col">
                        <h3 className="text-[var(--text-primary)] text-sm font-extrabold mb-1 tracking-wide uppercase opacity-90">Font Size</h3>
                        <p className="text-[var(--text-muted)] text-[11px] font-medium">Customise your font size as per readability</p>
                    </div>
                    <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-primary)] w-full sm:w-fit overflow-hidden">
                        {fontOptions.map((size) => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${fontSize === size
                                    ? 'bg-[var(--accent-primary)] text-white shadow-[var(--shadow-accent)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    } cursor-pointer`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appearance */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] group hover:border-[var(--accent-primary)]/30 transition-colors shadow-[var(--shadow-sm)]">
                    <div className="flex flex-col">
                        <h3 className="text-[var(--text-primary)] text-sm font-extrabold mb-1 tracking-wide uppercase opacity-90">Appearance</h3>
                        <p className="text-[var(--text-muted)] text-[11px] font-medium">Choose your theme to look the best for your eyes</p>
                    </div>
                    <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-primary)] w-full sm:w-fit overflow-hidden">
                        {themeOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setTheme(option.id)}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${theme === option.id
                                    ? 'bg-[var(--accent-primary)] text-white shadow-[var(--shadow-accent)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    } cursor-pointer`}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickSettings;
