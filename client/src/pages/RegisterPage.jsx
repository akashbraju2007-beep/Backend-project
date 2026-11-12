import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightLeft, User, Mail, Lock, FileText, Eye, EyeOff, Sparkles } from 'lucide-react';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = {};
  if (!formData.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
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
    setTouched({ name: true, email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setError(null);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio.trim()
      });
      navigate('/create-listing');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-700 to-indigo-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Join the Student Exchange
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create your account to barter skills and unlock reciprocal matches
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Jordan Smith"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    touched.name && errors.name
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                  required
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Student Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@campus.edu"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    touched.email && errors.email
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                  required
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    touched.password && errors.password
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Student Bio & Major (Optional)
              </label>
              <textarea
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                maxLength={300}
                placeholder="e.g. CS Sophomore interested in frontend development and languages."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 block text-right">
                {formData.bio.length} / 300
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Create Account & Start Swapping</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

