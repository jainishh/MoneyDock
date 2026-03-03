import React, { useState, useEffect } from 'react';
import { Wallet, Briefcase, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import AddFundsModal from '../../../../Components/Common/AddFundsModal';
import WithdrawFundsModal from '../../../../Components/Common/WithdrawFundsModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const FundsBanner = () => {
    const [balance, setBalance] = useState(0);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [isWithdrawFundsOpen, setIsWithdrawFundsOpen] = useState(false);

    useEffect(() => {
        const updateBalanceFromStorage = () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.tradingBalance !== undefined) {
                setBalance(userInfo.tradingBalance);
            }
        };

        const fetchBalanceFromServer = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) return;

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);

                // Update local storage
                const updatedUserInfo = { ...userInfo, tradingBalance: data.tradingBalance };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

                setBalance(data.tradingBalance);

            } catch (error) {
                console.error('Error fetching balance from server:', error);
                // Fallback to storage if API fails
                updateBalanceFromStorage();
            }
        };

        // Initial load
        fetchBalanceFromServer();

        // Listen for updates from other components
        window.addEventListener('userInfoUpdated', updateBalanceFromStorage);

        return () => {
            window.removeEventListener('userInfoUpdated', updateBalanceFromStorage);
        };
    }, []);

    const updateBalanceAPI = async (action, amount) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                `${API_BASE_URL}/api/auth/profile/balance`,
                { action, amount },
                config
            );

            // Update local storage and trigger event for navbar
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.dispatchEvent(new Event('userInfoUpdated'));
            setBalance(data.tradingBalance);
            return true;
        } catch (error) {
            console.error('Error updating balance:', error.response?.data?.message || error.message);
            // In a real app, you'd show a toast notification here
            return false;
        }
    };

    const handleAddFunds = async (amount) => {
        if (amount > 0) {
            await updateBalanceAPI('add', amount);
        }
    };

    const handleWithdrawFunds = async (amount) => {
        if (amount > 0 && amount <= balance) {
            await updateBalanceAPI('withdraw', amount);
        }
    };

    return (
        <>
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 w-full mb-8">

                {/* Left Section: Balance Info */}
                <div className="flex flex-col text-center md:text-left w-full md:w-auto">
                    <span className="text-xs text-[var(--text-muted)] mb-0.5">
                        Trading Balance
                    </span>
                    <span className="text-[22px] font-bold text-white">
                        ₹ {balance.toFixed(2)}
                    </span>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={() => setIsWithdrawFundsOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#4f46e5] text-[#4f46e5] bg-transparent text-xs font-semibold hover:border-[#6b82fe] transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <Wallet size={14} className="stroke-2 opacity-80" />
                        WITHDRAW FUNDS
                    </button>
                    <button
                        onClick={() => setIsAddFundsOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#4f46e5] text-white text-xs font-semibold hover:bg-[#5b72ee] transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <Wallet size={14} className="stroke-2 opacity-90" />
                        ADD FUNDS
                    </button>
                </div>
            </div>

            <AddFundsModal
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
                onAdd={handleAddFunds}
            />

            <WithdrawFundsModal
                isOpen={isWithdrawFundsOpen}
                onClose={() => setIsWithdrawFundsOpen(false)}
                onWithdraw={handleWithdrawFunds}
                currentBalance={balance}
            />
        </>
    );
};

export default FundsBanner;
