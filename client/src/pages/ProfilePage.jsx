import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  ListOrdered,
  Inbox,
  PlusCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, matchCount, pendingRequestsCount } = useAuth();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Verified Student
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {joinedDate}
              </span>
            </div>

            {user?.bio && (
              <p className="text-sm text-slate-600 pt-2 italic">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/matches"
          className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Smart Matches
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{matchCount}</p>
            <p className="text-xs text-slate-500 mt-1">Reciprocal pairings ready</p>
          </div>
        </Link>

        <Link
          to="/requests"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Pending Inbound
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{pendingRequestsCount}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting your response</p>
          </div>
        </Link>

        <Link
          to="/my-listings"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              My Listings
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListOrdered className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">Manage</p>
            <p className="text-xs text-slate-500 mt-1">Edit or post new skills</p>
          </div>
        </Link>
      </div>

      {/* Helpful Actions */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Have another talent to share?</h3>
          <p className="text-xs text-slate-300 mt-1">
            The more skills you list, the more reciprocal exchange matches our engine can discover.
          </p>
        </div>
        <Link
          to="/create-listing"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Skill</span>
        </Link>
      </div>
    </div>
  );
}

