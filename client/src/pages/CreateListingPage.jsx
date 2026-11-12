import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { listingsApi } from '../api/listings';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { refreshBadges } = useAuth();

  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    level: 'intermediate',
    description: ''
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const errors = {};
  if (!formData.skillOffered.trim()) {
    errors.skillOffered = 'Skill offered is required.';
  } else if (formData.skillOffered.length > 100) {
    errors.skillOffered = 'Skill cannot exceed 100 characters.';
  }

  if (!formData.skillWanted.trim()) {
    errors.skillWanted = 'Skill wanted is required.';
  } else if (formData.skillWanted.length > 100) {
    errors.skillWanted = 'Skill cannot exceed 100 characters.';
  }

  if (!formData.description.trim()) {
    errors.description = 'Please describe what you can teach and what you want to learn.';
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  } else if (formData.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters.';
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      skillOffered: true,
      skillWanted: true,
      description: true
    });

    if (!isFormValid) return;

    try {
      setLoading(true);
      setError(null);
      await listingsApi.create({
        skillOffered: formData.skillOffered.trim(),
        skillWanted: formData.skillWanted.trim(),
        level: formData.level,
        description: formData.description.trim()
      });

      if (refreshBadges) refreshBadges();
      // Redirect to smart matches to immediately see if reciprocal matches exist!
      navigate('/matches');
    } catch (err) {
      setError(err.message || 'Failed to create skill listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex-1">
      <div className="mb-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Post a Skill Exchange</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Offer a skill you can teach and specify what you'd like to learn in return.
        </p>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill Offered */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Skill You Can Teach (Offer) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="skillOffered"
              value={formData.skillOffered}
              onChange={handleChange}
              onBlur={() => handleBlur('skillOffered')}
              placeholder="e.g. Python Programming, Figma UI/UX, Spanish Conversation, Calculus"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                touched.skillOffered && errors.skillOffered
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            {touched.skillOffered && errors.skillOffered && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.skillOffered}</p>
            )}
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Proficiency Level in this Skill <span className="text-rose-500">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="beginner">Beginner (Can teach basics, fundamentals & entry setups)</option>
              <option value="intermediate">Intermediate (Solid experience with core topics & workflows)</option>
              <option value="advanced">Advanced (Deep expertise, complex troubleshooting, exam prep)</option>
            </select>
          </div>

          {/* Skill Wanted */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Skill You Want to Learn (Request) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="skillWanted"
              value={formData.skillWanted}
              onChange={handleChange}
              onBlur={() => handleBlur('skillWanted')}
              placeholder="e.g. React.js, Digital Audio / Ableton, Linear Algebra, Public Speaking"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                touched.skillWanted && errors.skillWanted
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            {touched.skillWanted && errors.skillWanted && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.skillWanted}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Using clean skill names helps our smart engine find exact reciprocal matches!
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Exchange Details & Curriculum <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              maxLength={1000}
              placeholder="Describe what specific topics you can cover (e.g., pandas, loops, git) and what you hope to learn from your exchange partner..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all resize-none ${
                touched.description && errors.description
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
              <span>{touched.description && errors.description ? errors.description : 'Min 10 characters'}</span>
              <span>{formData.description.length} / 1000</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/my-listings"
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Publish & Find Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
