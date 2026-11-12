import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRightLeft,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { matchesApi } from '../api/matches';
import MatchCard from '../components/MatchCard';
import ListingCard from '../components/ListingCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';

export default function MatchesPage() {
  const { user, refreshBadges } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    myListingsCount: 0,
    matches: [],
    partialMatches: []
  });
  const [error, setError] = useState(null);

  // Proposal Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    targetListing: null,
    myListing: null
  });

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await matchesApi.getMatches();
      setData({
        myListingsCount: res.myListingsCount || 0,
        matches: res.matches || [],
        partialMatches: res.partialMatches || []
      });
      if (refreshBadges) refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to calculate reciprocal matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleProposeExchange = (matchedListing, myListing) => {
    setModalState({
      isOpen: true,
      targetListing: matchedListing,
      myListing: myListing
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Smart Reciprocal Exchange Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Your Smart Skill Matches
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Our algorithm scans the campus network to find classmates who offer what you want to learn, and simultaneously want what you can teach.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={fetchMatches}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors backdrop-blur-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-scan Campus</span>
          </button>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Offer Another Skill</span>
          </Link>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse mb-4"></div>
          <div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold text-rose-900 mb-1">Could not load matches</h3>
          <p className="text-sm text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchMatches}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl"
          >
            Try Again
          </button>
        </div>
      ) : data.myListingsCount === 0 ? (
        /* Empty State 1: User has no listings */
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ArrowRightLeft className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            No Open Listings Found
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            The smart matching algorithm pairs your skills with others. To find reciprocal matches, first create a listing specifying a skill you can teach and what you'd like to learn in return.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/create-listing"
              className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Listing</span>
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
            >
              Browse What Others Need
            </Link>
          </div>
        </div>
      ) : data.matches.length > 0 ? (
        /* State 2: Exact Reciprocal Matches Found! */
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-xl font-bold text-slate-900">
                {data.matches.length} Perfect Reciprocal {data.matches.length === 1 ? 'Match' : 'Matches'} Found!
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Exact 2-Way Match
            </span>
          </div>

          <div className="space-y-6">
            {data.matches.map((match, idx) => (
              <MatchCard
                key={`${match.myListing._id}-${match.matchedListing._id}-${idx}`}
                match={match}
                onProposeExchange={handleProposeExchange}
              />
            ))}
          </div>

          {/* Partial / Complementary Recommendations if any */}
          {data.partialMatches && data.partialMatches.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  More Classmates Offering What You Want to Learn
                </h3>
                <p className="text-xs text-slate-500">
                  These students offer skills on your wishlist (though their requested skill differs from yours).
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.partialMatches.map((item, idx) => (
                  <ListingCard
                    key={`partial-${item.matchedListing._id}-${idx}`}
                    listing={item.matchedListing}
                    onRequestExchange={(listing) => handleProposeExchange(listing, item.myListing)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* State 3: User has listings, but no exact reciprocal pair yet */
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              No Exact Reciprocal Match Yet
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We checked your {data.myListingsCount} open {data.myListingsCount === 1 ? 'listing' : 'listings'}, but no classmate currently offers the exact reverse pairing. Keep an eye out as students post daily, or check out classmates offering what you want below!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/create-listing"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Another Skill You Offer</span>
              </Link>
              <Link
                to="/explore"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore All Skills</span>
              </Link>
            </div>
          </div>

          {/* Complementary Matches */}
          {data.partialMatches && data.partialMatches.length > 0 && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Recommended: Classmates Teaching Skills You Want
                </h3>
                <p className="text-xs text-slate-500">
                  You can still send them a proposal to see if they'd be open to exchanging!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.partialMatches.map((item, idx) => (
                  <ListingCard
                    key={`partial-${item.matchedListing._id}-${idx}`}
                    listing={item.matchedListing}
                    onRequestExchange={(listing) => handleProposeExchange(listing, item.myListing)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Propose Exchange Modal */}
      {modalState.isOpen && (
        <RequestModal
          isOpen={modalState.isOpen}
          targetListing={modalState.targetListing}
          myListing={modalState.myListing}
          onClose={() => setModalState({ isOpen: false, targetListing: null, myListing: null })}
          onSuccess={() => {
            setModalState({ isOpen: false, targetListing: null, myListing: null });
            fetchMatches();
          }}
        />
      )}
    </div>
  );
}
