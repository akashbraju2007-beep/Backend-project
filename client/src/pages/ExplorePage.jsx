import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Filter, RotateCcw, PlusCircle, Compass, Sparkles } from 'lucide-react';
import { listingsApi } from '../api/listings';
import ListingCard from '../components/ListingCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  // Filters from URL query params
  const searchQuery = searchParams.get('search') || '';
  const levelFilter = searchParams.get('level') || '';
  const statusFilter = searchParams.get('status') || 'open';
  const skillFilter = searchParams.get('skill') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchQuery,
          level: levelFilter,
          status: statusFilter,
          skill: skillFilter
        };
        const res = await listingsApi.getAll(params);
        setListings(res.listings || []);
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchQuery, levelFilter, statusFilter, skillFilter]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch.trim());
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    setSearchParams({ status: 'open' });
  };

  const handleRequestExchange = (listing) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedListing(listing);
  };

  const hasActiveFilters = !!(searchQuery || levelFilter || (statusFilter && statusFilter !== 'open') || skillFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-brand-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Skill Listings</h1>
          </div>
          <p className="text-sm text-slate-500">
            Browse skills offered by classmates or search for specific subjects you want to learn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Reciprocal Matches</span>
          </Link>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Offer a Skill</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search skills, tools, subjects..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </form>

          {/* Level Filter */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => updateParam('level', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="">All Proficiency Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => updateParam('status', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="open">Open Listings Only</option>
              <option value="matched">Matched Only</option>
              <option value="all">All Listings (Open & Matched)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchSubmit}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Apply Filter
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick popular tags */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Popular:</span>
          {['Python', 'Figma', 'React', 'Calculus', 'Spanish', 'Music Production'].map((skill) => (
            <button
              key={skill}
              onClick={() => updateParam('skill', skillFilter === skill ? '' : skill)}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                skillFilter.toLowerCase() === skill.toLowerCase()
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
        <span>Showing {listings.length} skill {listings.length === 1 ? 'exchange' : 'exchanges'}</span>
        {hasActiveFilters && (
          <span className="text-brand-600 font-semibold">Filtered results</span>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onRequestExchange={handleRequestExchange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No matching listings found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Try adjusting your search terms or clear filters to view all open opportunities.
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/create-listing"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
            >
              Post this Skill Wanted
            </Link>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {selectedListing && (
        <RequestModal
          isOpen={!!selectedListing}
          targetListing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
