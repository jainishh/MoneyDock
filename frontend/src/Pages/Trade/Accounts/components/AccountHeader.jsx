import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../context/ToastContext';

const AccountHeader = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        showToast("Logged out successfully", "info");
        navigate("/login");
    };

    return (
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[var(--border-primary)]">
            <h1 className="text-[var(--text-primary)] text-lg font-bold">My Account</h1>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wide cursor-pointer"
            >
                <LogOut size={16} />
                Logout
            </button>
        </div>
    );
};

export default AccountHeader;
