import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileSection = () => {
    // Manage User Info in state for immediate updates
    const [user, setUser] = useState(() => {
        const info = localStorage.getItem("userInfo");
        return info ? JSON.parse(info) : null;
    });

    useEffect(() => {
        const handleUpdate = () => {
            const info = localStorage.getItem("userInfo");
            setUser(info ? JSON.parse(info) : null);
        };

        window.addEventListener('userInfoUpdated', handleUpdate);
        window.addEventListener('storage', handleUpdate);

        return () => {
            window.removeEventListener('userInfoUpdated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const userName = user?.name || "User";

    // Generate Initials
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 p-1">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left w-full md:w-auto">
                {/* Avatar with Gradient Border */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative w-20 h-20 md:w-16 md:h-16 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-2xl md:text-xl border-2 border-[var(--border-primary)] shadow-xl overflow-hidden">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            getInitials(userName)
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-[var(--text-primary)] text-xl md:text-lg font-extrabold tracking-tight capitalize mb-1">
                        {userName}
                    </div>
                    <Link
                        to="/trade/profile"
                        className="inline-flex items-center text-[var(--accent-primary)] text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors"
                    >
                        View Profile
                        <svg className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--text-primary)] text-[11px] font-bold bg-[var(--bg-secondary)] px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm backdrop-blur-sm">
                <Clock size={14} className="text-[var(--accent-primary)]" />
                <span className="opacity-80">Member since 2026</span>
            </div>
        </div>
    );
};

export default ProfileSection;
