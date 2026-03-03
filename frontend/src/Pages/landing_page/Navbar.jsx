import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor, Menu, X, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo/moneydocklogofinal.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Support', path: '/support' },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-6xl z-[100] transition-all duration-300">

      {/* ── Main pill bar ── */}
      <div className={`px-4 py-2.5 md:px-6 md:py-3 rounded-full flex justify-between items-center transition-all duration-300 ${scrolled
        ? 'bg-[var(--bg-main)]/70 backdrop-blur-2xl border border-[var(--border-primary)] shadow-xl'
        : 'bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-primary)] shadow-lg'
        }`}>

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt="MoneyDock"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 px-4">
          {navLinks.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`relative px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-200 ${isActive(path)
                ? 'text-[color:var(--accent-primary)] bg-[var(--accent-primary)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
            >
              {name}
              {isActive(path) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
              )}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">

          {/* Theme toggle pill */}
          <div className="hidden sm:flex items-center bg-[var(--bg-secondary)]/60 rounded-full p-0.5 border border-[var(--border-primary)]">
            {[
              { mode: 'light', Icon: Sun },
              { mode: 'dark', Icon: Moon },
              { mode: 'system', Icon: Monitor },
            ].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`}
                className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-200 ${theme === mode
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm scale-105'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* Sign up CTA */}
          <Link
            to="/signup"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-semibold text-white bg-[var(--accent-primary)] hover:opacity-90 hover:-translate-y-0.5 shadow-md border border-[#5c6bc0] transition-all duration-200"
          >
            Sign up <ArrowUpRight size={14} />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)]/60 p-2 rounded-full border border-[var(--border-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[110%] left-0 w-full mt-2 bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border-primary)] rounded-3xl shadow-xl overflow-hidden">
          <div className="p-4 space-y-1">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-colors duration-200 ${isActive(path)
                  ? 'text-[color:var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                {name}
                {isActive(path) && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
              </Link>
            ))}

            <div className="h-px w-full bg-[var(--border-primary)] my-2" />

            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-[15px] text-white bg-[var(--accent-primary)] hover:opacity-90 transition-opacity border border-[#5c6bc0]"
            >
              Sign up <ArrowUpRight size={16} />
            </Link>

            {/* Mobile theme toggle */}
            <div className="flex items-center justify-center gap-3 mt-3 pb-1">
              {[
                { mode: 'light', Icon: Sun, label: 'Light' },
                { mode: 'dark', Icon: Moon, label: 'Dark' },
                { mode: 'system', Icon: Monitor, label: 'System' },
              ].map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => { setTheme(mode); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${theme === mode
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] border-[var(--border-primary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;