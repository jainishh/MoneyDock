import React, { useEffect, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const WatchlistContextMenu = ({ x, y, onRename, onDelete, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    // Adjust position to stay within viewport
    const style = {
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 9999,
    };

    return (
        <div ref={menuRef} style={style}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-2xl py-1 min-w-[160px] animate-in fade-in duration-100"
        >
            <button
                onClick={() => { onRename(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
                <Pencil size={14} className="text-[var(--text-muted)]" />
                Rename
            </button>
            <div className="border-t border-[var(--border-primary)] mx-2" />
            <button
                onClick={() => { onDelete(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f23645] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
                <Trash2 size={14} />
                Delete
            </button>
        </div>
    );
};

export default WatchlistContextMenu;
