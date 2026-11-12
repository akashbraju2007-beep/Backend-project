import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRightLeft,
  User,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { listingsApi } from '../api/listings';
import LevelBadge from '../components/LevelBadge';
import RequestModal from '../components/RequestModal';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listingsApi.getById(id);
        setListing(res.listing);
      } catch (err) {
        setError(err.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const isOwner = user && listing && (
    listing.user?._id === user.id ||
    listing.user?._id === user._id ||
    listing.user === user.id
  );

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await listingsApi.delete(id);
      navigate('/my-listings');
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleRequestExchange = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse mb-6" />
        <div className="h-64 bg-white rounded-3xl border border-slate-200 p-8 animate-pulse" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center flex-1">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Listing Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This listing may have been removed or does not exist.'}</p>
        <Link
          to="/explore"
          className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const authorName = listing.user?.name || 'Classmate';
  const authorBio = listing.user?.bio || 'Campus student participating in SkillSwap.';
  const authorJoined = listing.user?.createdAt
    ? new Date(listing.user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Listings</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Header Status Bar */}
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Listing Status:</span>
            {listing.status === 'open' ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Open for Exchange
              </span>
            ) : (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Matched & In Progress
              </span>
            )}
          </div>

          {/* Owner Controls */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/listings/${listing._id}/edit`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Banner */}
        {deleteConfirm && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-900">
            <span className="font-semibold">Are you sure you want to permanently delete this listing?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-8">
          {/* Visual Exchange Header */}
          <div className="bg-gradient-to-br from-indigo-50/60 via-slate-50 to-brand-50/50 rounded-2xl p-6 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Offering */}
              <div className="md:col-span-5 bg-white p-4 rounded-xl shadow-xs border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Offers to Teach
                </span>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl font-extrabold text-slate-900">{listing.skillOffered}</h2>
                  <LevelBadge level={listing.level} size="sm" />
                </div>
                <p className="text-xs text-slate-500">Instructor: {authorName}</p>
              </div>

              {/* Arrow */}
              <div className="md:col-span-1 flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shadow-xs">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Seeking */}
              <div className="md:col-span-5 bg-white p-4 rounded-xl shadow-xs border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Wants to Learn
                </span>
                <h2 className="text-xl font-extrabold text-brand-700 mb-1">{listing.skillWanted}</h2>
                <p className="text-xs text-slate-500">Exchange curriculum desired</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Exchange Overview & Topics
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {listing.description}
            </p>
          </div>

          {/* Author Card */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Posted By
            </h3>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-base">{authorName}</h4>
                <p className="text-xs text-slate-500 mb-2">Member since {authorJoined}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{authorBio}</p>
              </div>
            </div>
          </div>

          {/* Action Call */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>SkillSwap handles the connection. No financial transactions required.</span>
            </div>

            {!isOwner && listing.status === 'open' && (
              <button
                onClick={handleRequestExchange}
                className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Request Skill Exchange</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <RequestModal
          isOpen={isModalOpen}
          targetListing={listing}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
