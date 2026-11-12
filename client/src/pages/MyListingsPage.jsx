import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ListOrdered,
  PlusCircle,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRightLeft,
  AlertCircle
} from 'lucide-react';
import { listingsApi } from '../api/listings';
import LevelBadge from '../components/LevelBadge';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function MyListingsPage() {
  const { user, refreshBadges } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchMyListings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const userId = user.id || user._id;
      const res = await listingsApi.getAll({ user: userId, status: 'all' });
      setListings(res.listings || []);
      if (refreshBadges) refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to fetch your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete your listing for "${title}"?`)) {
      return;
    }

    try {
      await listingsApi.delete(id);
      setActionSuccess(`Listing "${title}" deleted successfully.`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      if (refreshBadges) refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
    }
  };

  const handleToggleStatus = async (listing) => {
    const nextStatus = listing.status === 'open' ? 'matched' : 'open';
    try {
      await listingsApi.update(listing._id, { status: nextStatus });
      setActionSuccess(`Listing status changed to "${nextStatus}".`);
      setListings((prev) =>
        prev.map((l) => (l._id === listing._id ? { ...l, status: nextStatus } : l))
      );
      if (refreshBadges) refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to update listing status.');
    }
  };

  const openCount = listings.filter((l) => l.status === 'open').length;
  const matchedCount = listings.filter((l) => l.status === 'matched').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListOrdered className="w-5 h-5 text-brand-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Your Skill Listings</h1>
          </div>
          <p className="text-sm text-slate-500">
            View, edit, or archive your exchange proposals and check their reciprocal matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Check Reciprocal Matches</span>
          </Link>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Offer a New Skill</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <Alert
          type="success"
          message={actionSuccess}
          onClose={() => setActionSuccess(null)}
          className="mb-6"
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Listings</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{listings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <span className="text-xs text-emerald-600 font-medium">Open & Active</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{openCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <span className="text-xs text-indigo-600 font-medium">Matched & Exchanged</span>
          <p className="text-2xl font-extrabold text-indigo-700 mt-1">{matchedCount}</p>
        </div>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-lg">
                    {listing.skillOffered}
                  </span>
                  <LevelBadge level={listing.level} size="xs" />

                  {listing.status === 'open' ? (
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Open
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      Matched
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-brand-600" />
                  <span>Seeking in return:</span>
                  <strong className="text-brand-700 font-bold">{listing.skillWanted}</strong>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">
                  {listing.description}
                </p>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-wrap">
                <button
                  onClick={() => handleToggleStatus(listing)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    listing.status === 'open'
                      ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  }`}
                  title={listing.status === 'open' ? 'Mark as Matched' : 'Reopen Listing'}
                >
                  {listing.status === 'open' ? 'Mark Matched' : 'Reopen Listing'}
                </button>

                <Link
                  to={`/listings/${listing._id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  View
                </Link>

                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit listing"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(listing._id, listing.skillOffered)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <ListOrdered className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">No skill listings yet</h2>
          <p className="text-sm text-slate-500 mb-6">
            Share what you can teach to unlock smart reciprocal match suggestions!
          </p>
          <Link
            to="/create-listing"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Listing</span>
          </Link>
        </div>
      )}
    </div>
  );
}

