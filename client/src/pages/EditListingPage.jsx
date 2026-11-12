import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { listingsApi } from '../api/listings';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    level: 'intermediate',
    description: '',
    status: 'open'
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await listingsApi.getById(id);
        const listing = res.listing;

        // Verify ownership
        const isOwner = user && listing && (
          listing.user?._id === user.id ||
          listing.user?._id === user._id ||
          listing.user === user.id
        );

        if (!isOwner) {
          setError('You are not authorized to edit this listing.');
          return;
        }

        setFormData({
          skillOffered: listing.skillOffered || '',
          skillWanted: listing.skillWanted || '',
          level: listing.level || 'intermediate',
          description: listing.description || '',
          status: listing.status || 'open'
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch listing for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user]);

  const errors = {};
  if (!formData.skillOffered.trim()) errors.skillOffered = 'Skill offered is required.';
  if (!formData.skillWanted.trim()) errors.skillWanted = 'Skill wanted is required.';
  if (!formData.description.trim() || formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ skillOffered: true, skillWanted: true, description: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      setError(null);
      await listingsApi.update(id, formData);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex-1">
        <div className="h-64 bg-white rounded-3xl border border-slate-200 p-8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex-1">
      <div className="mb-6">
        <Link
          to={`/listings/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Listing</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Skill Exchange</h1>
        <p className="text-sm text-slate-500 mb-6">Update your offered skill, requested skill, or exchange status.</p>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill Offered */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Skill Offered
            </label>
            <input
              type="text"
              name="skillOffered"
              value={formData.skillOffered}
              onChange={handleChange}
              onBlur={() => handleBlur('skillOffered')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            {touched.skillOffered && errors.skillOffered && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.skillOffered}</p>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Proficiency Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Skill Wanted */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Skill Wanted
            </label>
            <input
              type="text"
              name="skillWanted"
              value={formData.skillWanted}
              onChange={handleChange}
              onBlur={() => handleBlur('skillWanted')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            {touched.skillWanted && errors.skillWanted && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.skillWanted}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Listing Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="open">Open (Active & visible in reciprocal matching)</option>
              <option value="matched">Matched (Exchange agreed, temporarily archived)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Topics
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              maxLength={1000}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              required
            />
            {touched.description && errors.description && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to={`/listings/${id}`}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
