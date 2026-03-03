
import React from 'react';
import { Landmark, Scale, Zap } from 'lucide-react';

const ActionCards = () => {
    return (
        <div className="mb-6">
            <h2 className="text-[var(--text-primary)] text-sm font-bold mb-3">Pledging & Pay Later (MTF)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Card 1: Pledge Holdings */}
                <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-3 group">
                    <div className="p-1.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        <Scale size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-[var(--text-secondary)] font-bold text-xs mb-0.5">Pledge Holdings for Extra Margin</div>
                        <div className="text-[var(--text-muted)] text-[10px]">Increase your trading balance</div>
                    </div>
                </div>

                {/* Card 2: Pay Later with MTF */}
                <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-3 group">
                    <div className="p-1.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        <Zap size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-[var(--text-secondary)] font-bold text-xs mb-0.5">Pay Later with MTF</div>
                        <div className="text-[var(--text-muted)] text-[10px]">4x your buying power for MTF stocks</div>
                    </div>
                </div>

                {/* Card 3: Stock Recommendations */}
                <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-3 group">
                    <div className="p-1.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        <Landmark size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-[var(--text-secondary)] font-bold text-xs mb-0.5">View Stock Recommendations</div>
                        <div className="text-[var(--text-muted)] text-[10px]">Also available on F&O</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionCards;
