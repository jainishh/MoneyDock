import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, LayoutGrid, Star } from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(() =>
        JSON.parse(localStorage.getItem("userInfo") || "{}")
    );

    useEffect(() => {
        const handleUpdate = () => {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "{}"));
        };

        window.addEventListener('userInfoUpdated', handleUpdate);
        window.addEventListener('storage', handleUpdate);

        return () => {
            window.removeEventListener('userInfoUpdated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const isActive = (path) => {
        return location.pathname.startsWith(path) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]';
    };

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-main)] border-t border-[var(--border-primary)] h-16 flex items-center justify-around px-2 z-50 text-[var(--text-muted)]">
            <Link to="/trade/watchlist" className={`flex flex-col items-center gap-1 ${isActive('/trade/watchlist')}`}>
                <div className={`p-1 rounded ${location.pathname === '/trade/watchlist' ? 'bg-[var(--bg-secondary)]' : ''}`}>
                    <Star size={20} className={location.pathname === '/trade/watchlist' ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : ''} />
                </div>
                <span className={`text-[10px] font-medium ${location.pathname === '/trade/watchlist' ? 'text-[var(--text-secondary)]' : ''}`}>Watchlist</span>
            </Link>

            <Link to="/trade/portfolio" className={`flex flex-col items-center gap-1 ${isActive('/trade/portfolio')}`}>
                <Briefcase size={22} />
                <span className={`text-[10px] font-medium ${location.pathname.startsWith('/trade/portfolio') ? 'text-[var(--text-secondary)]' : ''}`}>Portfolio</span>
            </Link>

            <Link to="/trade/orders" className={`flex flex-col items-center gap-1 ${isActive('/trade/orders')}`}>
                <FileText size={22} />
                <span className={`text-[10px] font-medium ${location.pathname.startsWith('/trade/orders') ? 'text-[var(--text-secondary)]' : ''}`}>Orders</span>
            </Link>

            <Link to="/trade/positions" className={`flex flex-col items-center gap-1 ${isActive('/trade/positions')}`}>
                <LayoutGrid size={22} />
                <span className={`text-[10px] font-medium ${location.pathname.startsWith('/trade/positions') ? 'text-[var(--text-secondary)]' : ''}`}>Positions</span>
            </Link>

            <Link to="/trade/accounts" className={`flex flex-col items-center gap-1 ${isActive('/trade/accounts')}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-[10px] border overflow-hidden transition-all ${location.pathname.startsWith('/trade/accounts') ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-primary)]'}`}>
                    {userInfo.profilePic ? (
                        <img src={userInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        getInitials(userInfo.name)
                    )}
                </div>
                <span className={`text-[10px] font-medium ${location.pathname.startsWith('/trade/accounts') ? 'text-[var(--text-secondary)]' : ''}`}>Profile</span>
            </Link>
        </div>
    );
};

export default MobileNav;
