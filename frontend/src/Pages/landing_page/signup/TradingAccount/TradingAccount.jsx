import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";
import {
    Eye, EyeOff, ArrowUpRight, TrendingUp, Shield, Zap, Users, CheckCircle2
} from "lucide-react";

const features = [
    { icon: TrendingUp, title: '₹0 Brokerage', desc: 'Zero brokerage on equity delivery trades', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Shield, title: 'SEBI Regulated', desc: 'Safe, secure, and fully SEBI regulated', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Zap, title: 'Fast Execution', desc: 'Lightning fast order execution platform', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { icon: Users, title: '1.6Cr+ Users', desc: 'Trusted by millions of Indian investors', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

function TradingAccount() {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [info, setInfo] = useState({ name: "", email: "", password: "" });

    const handleinfo = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = info;

        if (!email || !password || (!isLogin && !name)) {
            showToast("Please fill in all fields", "error");
            return;
        }

        try {
            if (isLogin) {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
                    { email, password }
                );
                const { token, name: resName, ...userData } = res.data;
                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("loggedInUser", resName);
                    localStorage.setItem("userInfo", JSON.stringify({ ...userData, name: resName, token }));
                    showToast("Login successful! Redirecting...", "success");
                    setTimeout(() => navigate(`/trade/watchlist?token=${token}&name=${resName}`), 800);
                }
            } else {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`,
                    { name, email, password }
                );
                if (res.data.token) {
                    showToast("Signup successful! Please login.", "success");
                    setIsLogin(true);
                }
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "An unexpected error occurred.";
            showToast(errorMsg, "error");
        }
    };

    return (
        <div className="container mx-auto px-4 mt-8 mb-16 md:mt-24 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                {/* ── LEFT: Features Panel ── */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    {/* Heading */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full px-3 py-1 mb-4">
                            <CheckCircle2 size={12} className="text-[var(--accent-primary)]" />
                            <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">Free account opening</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-3 transition-colors duration-300">
                            Open a free demat &{' '}
                            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                                trading account
                            </span>
                        </h2>
                        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
                            Start investing brokerage-free and join a community of 1.6+ crore users across India.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map(({ icon: Icon, title, desc, color, bg }) => (
                            <div key={title} className={`flex gap-3 p-4 rounded-2xl border bg-[var(--bg-card)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${bg.split(' ')[1]}`}>
                                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg}`}>
                                    <Icon size={16} className={color} />
                                </div>
                                <div>
                                    <p className={`text-[13px] font-bold ${color}`}>{title}</p>
                                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
                        <Shield size={11} /> SEBI registered · NSE/BSE member · Secure & encrypted
                    </p>
                </div>

                {/* ── RIGHT: Form Card ── */}
                <div className="w-full md:w-5/12">
                    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-7 shadow-xl transition-colors duration-300">
                        {/* Form header */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1 transition-colors duration-300">
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">
                                {isLogin ? 'Login to continue trading' : 'Sign up and start trading for free'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] transition-all placeholder-[var(--text-muted)]"
                                        placeholder="Your full name"
                                        name="name"
                                        value={info.name}
                                        onChange={handleinfo}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] transition-all placeholder-[var(--text-muted)]"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={info.email}
                                    onChange={handleinfo}
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 pr-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] transition-all placeholder-[var(--text-muted)]"
                                        placeholder="Min. 8 characters"
                                        name="password"
                                        value={info.password}
                                        onChange={handleinfo}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="relative pt-2">
                                <div className="absolute inset-0 rounded-xl bg-[var(--accent-primary)] blur-xl opacity-25 scale-105 pointer-events-none" />
                                <button
                                    type="submit"
                                    className="relative w-full inline-flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 text-white font-bold py-3 rounded-xl text-[15px] transition-all duration-200 shadow-lg border border-[#5c6bc0]"
                                >
                                    {isLogin ? 'Login' : 'Sign Up for Free'}
                                    <ArrowUpRight size={17} />
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-5 text-[13px] text-[var(--text-muted)]">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                className="text-[color:var(--accent-primary)] font-semibold hover:opacity-80 transition-opacity"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TradingAccount;
