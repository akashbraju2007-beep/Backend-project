import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRightLeft, Lock, Mail, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const from = location.state?.from?.pathname || '/matches';

  const errors = {};
  if (!formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
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
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setError(null);
      await login(formData.email.trim(), formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts helper to make reviewing and testing a breeze!
  const handleQuickLogin = (email, pwd) => {
    setFormData({ email, password: pwd });
    setTouched({ email: false, password: false });
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
          Welcome back to campus
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to trade skills and view your reciprocal matches
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="student@campus.edu"
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>Sign In to SkillSwap</span>
            </button>
          </form>

          {/* Quick Demo Pre-fill Box */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>One-Click Demo Accounts (Reciprocal Match Pairings):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex@campus.edu', 'password123')}
                className="p-2 rounded-lg border border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-left transition-colors"
              >
                <div className="font-bold text-slate-800">Alex Rivera</div>
                <div className="text-[10px] text-slate-500">Offers Python 🔄 Wants Figma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('maya@campus.edu', 'password123')}
                className="p-2 rounded-lg border border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-left transition-colors"
              >
                <div className="font-bold text-slate-800">Maya Lin</div>
                <div className="text-[10px] text-slate-500">Offers Figma 🔄 Wants Python</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              (Both accounts match each other reciprocally! Password: password123)
            </p>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              New to SkillSwap?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
                Create a student account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

