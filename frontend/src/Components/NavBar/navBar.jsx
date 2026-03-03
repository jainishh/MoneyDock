import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Home, Triangle } from "lucide-react";
import MarketIndicesStrip from "../Common/MarketIndicesStrip";
import logo from "../../assets/logo/moneydocklogofinal.png";


function NavBar() {
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
        return location.pathname === path ? "text-[var(--accent-primary)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]";
    };

    return (
        <div className="bg-[var(--bg-main)] border-b border-[var(--border-primary)] h-13 flex items-center justify-between px-6 select-none font-sans">
            {/* Left Section: Logo & Indices */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <Link className="flex items-center">
                    <img src={logo} alt="MoneyDock" className="h-auto w-28 object-contain" />
                </Link>

                {/* Live Indices */}
                <div className="hidden md:flex">
                    <MarketIndicesStrip variant="desktop" />
                </div>
            </div>

            {/* Right Section: Navigation & Tools */}
            <div className="flex items-center gap-6 text-sm">

                {/* <Link to="/markets" className={isActive("/markets") + " transition-colors"}>Markets</Link> */}
                <Link to="/trade/watchlist" className={isActive("/trade/watchlist") + " transition-colors"}>Watchlist</Link>
                <Link to="/trade/portfolio" className={isActive("/trade/portfolio") + " transition-colors"}>Portfolio</Link>
                <Link to="/trade/orders" className={isActive("/trade/orders") + " transition-colors"}>Orders</Link>
                <Link to="/trade/positions" className={isActive("/trade/positions") + " transition-colors"}>Positions</Link>


                {/* Divider */}
                <div className="h-4 w-px bg-[var(--border-primary)] mx-2"></div>

                {/* Notifications */}
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <Bell size={18} />
                </button>

                {/* Profile */}
                <Link to="/trade/accounts">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-medium text-xs border border-[var(--accent-primary)]/30 cursor-pointer hover:bg-[var(--accent-primary)]/20 transition-colors overflow-hidden">
                        {userInfo.profilePic ? (
                            <img src={userInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            (() => {
                                const name = userInfo.name || "User";
                                const parts = name.split(' ');
                                return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
                            })()
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default NavBar;
