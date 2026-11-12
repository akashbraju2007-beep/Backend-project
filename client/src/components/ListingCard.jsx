import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User as UserIcon, Calendar, ArrowRightLeft, Sparkles } from 'lucide-react';
import LevelBadge from './LevelBadge';
import { useAuth } from '../context/AuthContext';

export default function ListingCard({ listing, onRequestExchange, isMatchedWithUser }) {
  const { user } = useAuth();
  const isOwner = user && listing.user && (listing.user._id === user.id || listing.user._id === user._id || listing.user === user.id);
  const authorName = listing.user?.name || 'Classmate';
  const authorInitial = authorName.charAt(0).toUpperCase();

  const formattedDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 ${
      isMatchedWithUser ? 'ring-2 ring-amber-400 border-amber-300' : 'border-slate-200'
    }`}>
      {/* Top Banner if Reciprocal Match */}
      {isMatchedWithUser && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            Reciprocal Skill Match!
          </span>
          <span className="text-[11px] opacity-90">100% Exchange Fit</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Author info & status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
              {authorInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {authorName}
                {isOwner && <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">You</span>}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
                {listing.user?.bio && (
                  <span className="truncate max-w-[120px] text-slate-400">
                    • {listing.user.bio}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {listing.status === 'matched' ? (
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Matched
              </span>
            ) : (
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                Open
              </span>
            )}
          </div>
        </div>

        {/* The Exchange Core: Offers -> Wants */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Offers to teach
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-base">
                  {listing.skillOffered}
                </span>
                <LevelBadge level={listing.level} size="xs" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="flex items-center gap-1 text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md font-semibold">
              <ArrowRightLeft className="w-3 h-3" />
              in exchange for
            </span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Wants to learn
            </span>
            <span className="font-bold text-brand-700 text-base">
              {listing.skillWanted}
            </span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
          {listing.description}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/listings/${listing._id}`}
          className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isOwner ? (
          <Link
            to={`/listings/${listing._id}/edit`}
            className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
          >
            Edit Listing
          </Link>
        ) : listing.status === 'open' ? (
          <button
            onClick={() => onRequestExchange && onRequestExchange(listing)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Request Exchange</span>
          </button>
        ) : (
          <span className="text-xs font-medium text-slate-400">Exchange Complete</span>
        )}
      </div>
    </div>
  );
}
