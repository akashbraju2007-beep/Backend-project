import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
  ArrowRightLeft,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { requestsApi } from '../api/requests';

export default function RequestCard({ request, type = 'received', onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const isReceived = type === 'received';
  const partnerUser = isReceived ? request.fromUser : request.toUser;
  const partnerName = partnerUser?.name || 'Classmate';
  const partnerEmail = partnerUser?.email;
  const partnerBio = partnerUser?.bio;

  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const handleUpdate = async (status) => {
    try {
      setLoading(true);
      setActionError(null);
      await requestsApi.updateStatus(request._id, status);
      if (onStatusChange) onStatusChange(request._id, status);
    } catch (err) {
      setActionError(err.message || `Failed to ${status} request.`);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = {
    pending: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Pending Response
      </span>
    ),
    accepted: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        Accepted
      </span>
    ),
    rejected: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5" />
        Declined
      </span>
    )
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
      {/* Top line: Partner & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {partnerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{partnerName}</span>
              <span className="text-xs text-slate-400">
                ({isReceived ? 'Sent you a proposal' : 'Sent to student'})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              {partnerBio && (
                <span className="truncate max-w-[200px] text-slate-400">
                  • {partnerBio}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>{statusBadge[request.status] || statusBadge.pending}</div>
      </div>

      {/* Target Listing Reference */}
      {request.listing && (
        <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="font-medium text-slate-700">Listing:</span>
            <span className="font-bold text-slate-900">{request.listing.skillOffered}</span>
            <span className="text-slate-400">for</span>
            <span className="font-bold text-brand-700">{request.listing.skillWanted}</span>
          </div>

          <Link
            to={`/listings/${request.listing._id}`}
            className="text-brand-600 hover:text-brand-800 font-semibold"
          >
            View Listing
          </Link>
        </div>
      )}

      {/* Message */}
      <div className="mt-3.5 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Message:</span>
        </div>
        <p className="text-sm text-slate-700 italic whitespace-pre-wrap">
          "{request.message}"
        </p>
      </div>

      {/* If Accepted: Contact Information Revealed! */}
      {request.status === 'accepted' && partnerEmail && (
        <div className="mt-3.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Exchange Confirmed! Connect via email:</span>
            <strong className="text-emerald-950 font-semibold underline">{partnerEmail}</strong>
          </div>
          <a
            href={`mailto:${partnerEmail}?subject=SkillSwap Exchange: ${request.listing?.skillOffered || 'Skill Exchange'}`}
            className="inline-flex items-center gap-1 font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors text-xs"
          >
            Send Email
          </a>
        </div>
      )}

      {actionError && (
        <p className="text-xs text-rose-600 mt-2 font-medium">{actionError}</p>
      )}

      {/* Action Buttons for Received & Pending */}
      {isReceived && request.status === 'pending' && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={() => handleUpdate('rejected')}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={() => handleUpdate('accepted')}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept Exchange</span>
          </button>
        </div>
      )}
    </div>
  );
}
