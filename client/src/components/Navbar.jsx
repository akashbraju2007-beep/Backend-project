import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Sparkles,
  PlusCircle,
  Inbox,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  ListOrdered
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, matchCount, pendingRequestsCount } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-brand-600 bg-brand-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-brand-600 bg-brand-50 font-semibold'
        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-700 to-indigo-600 bg-clip-text text-transparent">
                    SkillSwap
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-md">
                    Student
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:block">Campus Skill Exchange</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/explore" className={navLinkClass}>
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/matches" className={navLinkClass}>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Smart Matches</span>
                    {matchCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-amber-500 text-white rounded-full animate-pulse">
                        {matchCount}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/requests" className={navLinkClass}>
                    <Inbox className="w-4 h-4" />
                    <span>Requests</span>
                    {pendingRequestsCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-brand-600 text-white rounded-full">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/my-listings" className={navLinkClass}>
                    <ListOrdered className="w-4 h-4" />
                    <span>My Listings</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Offer a Skill</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[110px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile & Bio</span>
                      </Link>
                      <Link
                        to="/my-listings"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <ListOrdered className="w-4 h-4" />
                        <span>Manage Listings</span>
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Join SkillSwap
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && matchCount > 0 && (
              <Link
                to="/matches"
                className="p-1.5 text-amber-600 bg-amber-50 rounded-lg flex items-center gap-1 text-xs font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>{matchCount}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <NavLink
            to="/explore"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-slate-500" />
              <span>Explore Listings</span>
            </div>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/matches"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Smart Matches</span>
                </div>
                {matchCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                    {matchCount} new
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/requests"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-5 h-5 text-slate-500" />
                  <span>Exchange Requests</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/my-listings"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <ListOrdered className="w-5 h-5 text-slate-500" />
                  <span>My Listings</span>
                </div>
              </NavLink>

              <NavLink
                to="/profile"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-slate-500" />
                  <span>Profile & Bio</span>
                </div>
              </NavLink>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  to="/create-listing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Offer a Skill</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user?.name})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
              >
                Join SkillSwap
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
