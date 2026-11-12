import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 flex-1">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The skill exchange or page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}

