import React from 'react';
import { ArrowRightLeft, Sparkles, User, CheckCircle2, MessageSquare } from 'lucide-react';
import LevelBadge from './LevelBadge';

export default function MatchCard({ match, onProposeExchange }) {
  const { myListing, matchedListing, exchangeSummary } = match;
  const classmateName = matchedListing.user?.name || 'Fellow Student';
  const classmateBio = matchedListing.user?.bio || 'Student at campus';

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-2.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-white/20">
            <Sparkles className="w-4 h-4 fill-white" />
          </span>
          <span className="font-bold text-sm tracking-wide">
            Reciprocal Match Found!
          </span>
        </div>
        <span className="text-xs bg-white/20 font-semibold px-2 py-0.5 rounded-full">
          100% Mutual Fit
        </span>
      </div>

      <div className="p-6">
        {/* Reciprocal Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-6">
          {/* Left Column: Your Side */}
          <div className="md:col-span-5 bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Your Listing
              </span>
              <LevelBadge level={myListing.level} size="xs" />
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-slate-500 block">You teach:</span>
                <span className="text-base font-bold text-slate-900">
                  {myListing.skillOffered}
                </span>
              </div>
              <div className="border-t border-indigo-100 pt-2">
                <span className="text-xs text-slate-500 block">You want to learn:</span>
                <span className="text-base font-bold text-brand-700">
                  {myListing.skillWanted}
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Exchange Indicator */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shadow-sm">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-1 uppercase tracking-tight">
              Swaps
            </span>
          </div>

          {/* Right Column: Their Side */}
          <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  {classmateName.charAt(0)}
                </div>
                <span className="text-[11px] font-bold text-emerald-800 truncate max-w-[140px]">
                  {classmateName}'s Listing
                </span>
              </div>
              <LevelBadge level={matchedListing.level} size="xs" />
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-slate-500 block">{classmateName} teaches:</span>
                <span className="text-base font-bold text-emerald-800">
                  {matchedListing.skillOffered}
                </span>
              </div>
              <div className="border-t border-emerald-100 pt-2">
                <span className="text-xs text-slate-500 block">Wants to learn:</span>
                <span className="text-base font-bold text-slate-900">
                  {matchedListing.skillWanted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Note / Pitch from their listing */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-6">
          <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Note from {classmateName}:</span>
          </p>
          <p className="text-sm text-slate-600 italic">
            "{matchedListing.description}"
          </p>
          {classmateBio && (
            <p className="text-xs text-slate-500 mt-2 font-medium">
              About student: {classmateBio}
            </p>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Zero monetary cost — pure knowledge barter!</span>
          </div>

          <button
            onClick={() => onProposeExchange(matchedListing, myListing)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Propose Exchange with {classmateName.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
