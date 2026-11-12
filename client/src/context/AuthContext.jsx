import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { matchesApi } from '../api/matches';
import { requestsApi } from '../api/requests';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('skillswap_token'));
  const [loading, setLoading] = useState(true);
  const [matchCount, setMatchCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchBadgeCounts = useCallback(async () => {
    const currentToken = localStorage.getItem('skillswap_token');
    if (!currentToken) return;

    try {
      const [matchesRes, requestsRes] = await Promise.allSettled([
        matchesApi.getMatches(),
        requestsApi.getAll('received')
      ]);

      if (matchesRes.status === 'fulfilled' && matchesRes.value?.matches) {
        setMatchCount(matchesRes.value.matches.length);
      }
      if (requestsRes.status === 'fulfilled' && requestsRes.value?.counts) {
        setPendingRequestsCount(requestsRes.value.counts.pendingReceived || 0);
      }
    } catch {
      // Non-critical badge count failure
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('skillswap_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        fetchBadgeCounts();
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Failed to verify token:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [fetchBadgeCounts]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.token) {
      localStorage.setItem('skillswap_token', res.token);
      setToken(res.token);
      setUser(res.user);
      fetchBadgeCounts();
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.token) {
      localStorage.setItem('skillswap_token', res.token);
      setToken(res.token);
      setUser(res.user);
      fetchBadgeCounts();
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    setToken(null);
    setUser(null);
    setMatchCount(0);
    setPendingRequestsCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        matchCount,
        pendingRequestsCount,
        refreshBadges: fetchBadgeCounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
