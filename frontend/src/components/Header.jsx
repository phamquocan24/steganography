/**
 * Professional Header Component
 * Blue gradient theme with React Router navigation
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, History, Menu, X, Book } from 'lucide-react';
import clsx from 'clsx';

export default function Header({ stats, showHistory, setShowHistory, historyCount }) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md flex-shrink-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Steganalysis Pro
                            </h1>
                            <p className="text-xs text-gray-500">Phát hiện bằng Deep Learning</p>
                        </div>
                    </Link>

                    {/* Center: Navigation Menu (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" active={isActive('/')}>
                            <Shield className="w-4 h-4 mr-2" />
                            Phân tích
                        </NavLink>
                        <NavLink to="/guide" active={isActive('/guide')}>
                            <Book className="w-4 h-4 mr-2" />
                            Hướng dẫn
                        </NavLink>
                        <NavLink to="/about" active={isActive('/about')}>
                            Giới thiệu
                        </NavLink>
                        <NavLink to="/architecture" active={isActive('/architecture')}>
                            Kiến trúc
                        </NavLink>
                    </nav>

                    {/* Right: Stats & History */}
                    <div className="flex items-center space-x-4">
                        {/* Stats (Hidden on mobile) */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <StatBadge label="Tổng" value={stats.total} color="gray" />
                            <StatBadge label="Stego" value={stats.stego} color="red" />
                            <StatBadge label="Sạch" value={stats.clean} color="green" />
                        </div>

                        {/* History Button */}
                        <button
                            onClick={() => setShowHistory(true)}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                        >
                            <History className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Lịch sử</span>
                            <span className="ml-1">({historyCount})</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
                        <nav className="space-y-2">
                            <MobileNavLink to="/" active={isActive('/')} onClick={() => setMobileMenuOpen(false)}>
                                Phân tích
                            </MobileNavLink>
                            <MobileNavLink to="/guide" active={isActive('/guide')} onClick={() => setMobileMenuOpen(false)}>
                                Hướng dẫn
                            </MobileNavLink>
                            <MobileNavLink to="/about" active={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>
                                Giới thiệu
                            </MobileNavLink>
                            <MobileNavLink to="/architecture" active={isActive('/architecture')} onClick={() => setMobileMenuOpen(false)}>
                                Kiến trúc
                            </MobileNavLink>
                        </nav>
                        {/* Mobile Stats */}
                        <div className="flex items-center justify-around mt-4 pt-4 border-t border-gray-200">
                            <StatBadge label="Tổng" value={stats.total} color="gray" />
                            <StatBadge label="Stego" value={stats.stego} color="red" />
                            <StatBadge label="Sạch" value={stats.clean} color="green" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

function NavLink({ to, children, active }) {
    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children, active, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={clsx(
                "block w-full text-left px-4 py-3 rounded-lg font-medium transition-all",
                active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
            )}
        >
            {children}
        </Link>
    );
}

function StatBadge({ label, value, color }) {
    const colors = {
        gray: 'bg-gray-100 text-gray-700',
        red: 'bg-red-100 text-red-700',
        green: 'bg-green-100 text-green-700'
    };

    return (
        <div className={clsx("px-3 py-1.5 rounded-lg text-center", colors[color])}>
            <div className="text-xs font-medium">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
}
