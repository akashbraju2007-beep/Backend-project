import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Sparkles,
  Search,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { listingsApi } from '../api/listings';
import ListingCard from '../components/ListingCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user, matchCount } = useAuth();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await listingsApi.getAll({ status: 'open' });
        if (res.listings) {
          setFeaturedListings(res.listings.slice(0, 6));
        }
      } catch (err) {
        console.warn('Failed to fetch home listings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleRequestExchange = (listing) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedListing(listing);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />
              <span>Smart Student Skill Barter & Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Trade your skills. <br />
              <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                Learn from classmates.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Why pay expensive tutors or struggle alone? SkillSwap connects students to exchange knowledge directly: teach Python to learn Figma, swap Calculus for Spanish, or trade Web Dev for Music Production.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  placeholder="What skill do you want to learn? (e.g. Python, Figma, Spanish)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/matches"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>View Your Smart Matches ({matchCount})</span>
                  </Link>
                  <Link
                    to="/create-listing"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
                  >
                    <span>Offer a Skill</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all"
                  >
                    <span>Join Free as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
                  >
                    <span>Browse All Listings</span>
                  </Link>
                </>
              )}
            </div>

            {/* Key Value Stats */}
            <div className="pt-8 grid grid-cols-3 max-w-lg mx-auto gap-4 border-t border-slate-200/80 text-center">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Free Skill Exchange</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-600">Smart</p>
                <p className="text-xs text-slate-500 font-medium">Reciprocal Matches</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-600">Peer-to-Peer</p>
                <p className="text-xs text-slate-500 font-medium">Student Collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
              The Reciprocal Barter Model
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              How SkillSwap Works
            </h2>
            <p className="text-slate-600 text-sm">
              We make it effortless to trade knowledge without friction or financial barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900">Post Your Exchange Listing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  List a skill you can teach (e.g. Python, Calculus, French) and the skill you wish to learn (e.g. Figma, Guitar, React). Set your proficiency level.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-brand-600">
                <CheckCircle className="w-4 h-4" />
                <span>Takes less than 1 minute</span>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 relative flex flex-col justify-between ring-2 ring-amber-300/60">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Get Reciprocal Matches</h3>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our matching engine finds students whose offers and wants mirror yours: If you offer X and want Y, we find classmates who offer Y and want X!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200 flex items-center gap-2 text-xs font-semibold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>100% Mutual Synergy</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900">Connect & Exchange</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Send a personalized exchange request. When accepted, share contact details, plan study sessions on campus or Zoom, and level up together!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span>Direct student messaging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Open Listings */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Campus Market</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Recent Skill Listings</h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              <span>View all listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onRequestExchange={handleRequestExchange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">No listings yet</h3>
              <p className="text-sm text-slate-500 mb-4">Be the first to post a skill exchange on campus!</p>
              <Link
                to="/create-listing"
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold inline-block"
              >
                Create Listing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Reciprocal Matching Pitch Banner */}
      <section className="bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            <ArrowRightLeft className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find your reciprocal skill partner?
          </h2>
          <p className="text-brand-100 text-base max-w-2xl mx-auto leading-relaxed">
            Create an account, list what you want to teach and what you want to learn, and let our algorithm pair you with fellow students today.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? "/matches" : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              <span>{isAuthenticated ? "Check Smart Matches" : "Get Started Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
