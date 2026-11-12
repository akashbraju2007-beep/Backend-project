import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { requestsApi } from '../api/requests';
import Alert from './Alert';
import { useAuth } from '../context/AuthContext';

export default function RequestModal({ isOpen, onClose, targetListing, myListing, onSuccess }) {
  const { user, refreshBadges } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && targetListing) {
      setError(null);
      setSuccess(false);

      // Prepopulate a friendly message tailored to whether it's a reciprocal match
      if (myListing) {
        setMessage(
          `Hi ${targetListing.user?.name?.split(' ')[0] || 'there'}! I saw your listing. I can teach you ${myListing.skillOffered} and I would love to learn ${targetListing.skillOffered} from you. Let's exchange skills!`
        );
      } else {
        setMessage(
          `Hi ${targetListing.user?.name?.split(' ')[0] || 'there'}! I'm interested in your "${targetListing.skillOffered}" listing. I would love to connect and discuss an exchange!`
        );
      }
    }
  }, [isOpen, targetListing, myListing]);

  if (!isOpen || !targetListing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setError('Please enter a message of at least 5 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await requestsApi.create({
        listing: targetListing._id,
        message: message.trim()
      });
      setSuccess(true);
      if (refreshBadges) refreshBadges();
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.message || 'Failed to send exchange request.');
    } finally {
      setLoading(false);
    }
  };

  const recipientName = targetListing.user?.name || 'Classmate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Request Skill Exchange</h3>
              <p className="text-xs text-slate-500">Send an invitation to {recipientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Exchange Request Sent!</h4>
              <p className="text-sm text-slate-500 max-w-xs">
                {recipientName} has been notified and can review your message in their requests inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Context Summary Box */}
              <div className="bg-brand-50/60 rounded-xl p-3.5 border border-brand-100 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between font-semibold text-brand-800">
                  <span>Target Listing Details</span>
                  <span className="text-[10px] bg-brand-200/60 px-2 py-0.5 rounded-full uppercase">
                    Level: {targetListing.level}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">They Teach</span>
                    <span className="font-bold text-slate-800">{targetListing.skillOffered}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">They Want</span>
                    <span className="font-bold text-slate-800">{targetListing.skillWanted}</span>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Message to {recipientName} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  placeholder="Introduce yourself, mention how you can help each other, and propose a preferred schedule or method to meet..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-all resize-none"
                  required
                />
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>Minimum 5 characters</span>
                  <span>{message.length} / 500</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || message.trim().length < 5}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
