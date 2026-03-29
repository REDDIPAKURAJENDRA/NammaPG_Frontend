import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import PgDetailsPage from './pages/PgDetailsPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import OwnerRegisterPage from './pages/OwnerRegisterPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddPgPage from './pages/AddPgPage';
import EditPgPage from './pages/EditPgPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
      Authenticating NammaPG...
    </div>
  );
  
  if (!user) {
    if (allowedRoles.includes('ADMIN')) return <Navigate to="/admin-login" />;
    return <Navigate to="/owner-login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/pg/:id" element={<PgDetailsPage />} />
          
          {/* Auth Routes */}
          <Route path="/owner-login" element={<OwnerLoginPage />} />
          <Route path="/owner-register" element={<OwnerRegisterPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          
          {/* Owner Protected Routes */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/add-pg" 
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <AddPgPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/edit-pg/:id" 
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <EditPgPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
