import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose, className = '' }) {
  if (!message) return null;

  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
  };

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${styles[type] || styles.info} ${className}`}>
      {icons[type] || icons.info}
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
