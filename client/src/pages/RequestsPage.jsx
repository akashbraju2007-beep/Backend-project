import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Send,
  Sparkles,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { requestsApi } from '../api/requests';
import RequestCard from '../components/RequestCard';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function RequestsPage() {
  const { refreshBadges } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestsData, setRequestsData] = useState({
    sent: [],
    received: [],
    counts: { sent: 0, received: 0, pendingReceived: 0 }
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await requestsApi.getAll('all');
      setRequestsData({
        sent: res.sent || [],
        received: res.received || [],
        counts: res.counts || { sent: 0, received: 0, pendingReceived: 0 }
      });
      if (refreshBadges) refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to load exchange requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = (requestId, newStatus) => {
    setRequestsData((prev) => {
      const updatedReceived = prev.received.map((req) =>
        req._id === requestId ? { ...req, status: newStatus } : req
      );
      const pendingCount = updatedReceived.filter((r) => r.status === 'pending').length;
      return {
        ...prev,
        received: updatedReceived,
        counts: {
          ...prev.counts,
          pendingReceived: pendingCount
        }
      };
    });
    if (refreshBadges) refreshBadges();
  };

  const currentList = activeTab === 'received' ? requestsData.received : requestsData.sent;
  const filteredList = statusFilter === 'all'
    ? currentList
    : currentList.filter((r) => r.status === statusFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-5 h-5 text-brand-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Exchange Requests</h1>
          </div>
          <p className="text-sm text-slate-500">
            Review invitations from fellow students and track proposals you have sent.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {/* Main Tabs (Received vs Sent) */}
      <div className="flex items-center justify-between border-b border-slate-200 mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setActiveTab('received');
              setStatusFilter('all');
            }}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'received'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received Requests</span>
            {requestsData.counts.pendingReceived > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-600 text-white animate-pulse">
                {requestsData.counts.pendingReceived}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('sent');
              setStatusFilter('all');
            }}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sent'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Requests</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
              {requestsData.counts.sent}
            </span>
          </button>
        </div>

        {/* Status sub-filter */}
        <div className="flex items-center gap-1 pb-2">
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredList.length > 0 ? (
        <div className="space-y-4">
          {filteredList.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              type={activeTab}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            {activeTab === 'received' ? <Inbox className="w-6 h-6" /> : <Send className="w-6 h-6" />}
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No {statusFilter !== 'all' ? statusFilter : ''} {activeTab} requests
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {activeTab === 'received'
              ? 'When classmates request an exchange on your listings, they will show up here.'
              : 'Browse skills on campus or check reciprocal matches to propose an exchange!'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/matches"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Smart Matches</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

