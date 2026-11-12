import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and brief */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">SkillSwap</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              A peer-to-peer student skill exchange platform. Connect with classmates, trade your talents, and learn together without paying costly tutors or going it alone.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 p-2.5 rounded-lg border border-brand-100 max-w-md">
              <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>Smart 2-way matching engine finds students who offer what you want and want what you offer!</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/explore" className="hover:text-brand-600 transition-colors">Browse Skills</Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-brand-600 transition-colors">Smart Matches</Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-brand-600 transition-colors">Offer a Skill</Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/requests" className="hover:text-brand-600 transition-colors">Exchange Requests</Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-brand-600 transition-colors">My Listings</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-600 transition-colors">Student Profile</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillSwap. Built for students, powered by collaboration.</p>
          <div className="flex items-center gap-1">
            <span>Learn together, grow together</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
