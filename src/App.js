import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import AdminDashboard from './components/dashboard/AdminDashboard';
import VendorDashboard from './components/dashboard/VendorDashboard';

import { useAuth } from './context/AuthContext';

function DashboardRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === 'ADMIN') return <AdminDashboard />;
  if (user.role === 'VENDEUR') return <VendorDashboard />;

  // CLIENT or other roles: no dashboard -> redirect home or profile
  return <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />

        {/* Dashboard avec routes imbriquées */}
        <Route path="/dashboard/*" element={<DashboardRoute />} />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
