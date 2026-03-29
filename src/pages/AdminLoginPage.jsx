import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldAlert, Lock, LogIn, AlertCircle } from 'lucide-react';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: 'admin@nammapg.com', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.role !== 'ADMIN') {
        setError('Unauthorized. Only administrators can access this portal.');
        return;
      }
      login(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef2f2' }}>
      <Navbar />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '6rem' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px', border: '1px solid #fee2e2' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <ShieldAlert size={34} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>Admin Portal</h1>
            <p style={{ color: 'var(--text-muted)' }}>Secure access for system administrators only</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fee2e2' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  name="password" 
                  required 
                  autoFocus
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: '3.5rem', fontSize: '1.125rem', marginTop: '1rem', gap: '10px', backgroundColor: '#dc2626' }}>
              <LogIn size={20} /> {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            IP address and login attempts are logged for security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
