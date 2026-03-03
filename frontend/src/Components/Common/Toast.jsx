import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    const styles = {
        success: 'border-green-500/20 bg-green-500/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-blue-500/20 bg-blue-500/5'
    };

    return (
        <div className={`
            pointer-events-auto
            flex items-center gap-3 px-4 py-3 
            rounded-lg border shadow-lg backdrop-blur-md
            animate-in slide-in-from-right-full fade-in duration-300
            min-w-[300px] max-w-md
            bg-[var(--bg-card)]/90 text-[var(--text-secondary)]
            ${styles[type]}
        `}>
            <div className="shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button
                onClick={onClose}
                className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
