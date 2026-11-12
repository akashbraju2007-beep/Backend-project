import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MatchesPage from './pages/MatchesPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import MyListingsPage from './pages/MyListingsPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on route transition
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/matches"
                element={
                  <ProtectedRoute>
                    <MatchesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-listing"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <RequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

