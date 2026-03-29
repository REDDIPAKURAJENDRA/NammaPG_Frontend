import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, User, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
          <Home size={28} />
          <span>NammaPG</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Search size={18} /> Search
          </Link>
          
          {user ? (
            <>
              <Link to={user.role === 'ADMIN' ? '/admin/dashboard' : '/owner/dashboard'} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '2rem' }}>
                <User size={18} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={{ background: 'transparent', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/owner-login" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Owner Login</Link>
              <Link to="/owner-register" className="btn btn-primary">List Your PG</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
