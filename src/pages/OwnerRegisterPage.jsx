import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';

const OwnerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: ''
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/send-otp', { email: formData.email, name: formData.name });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register-owner', formData);
      login(res.data);
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Partner with NammaPG</h1>
            <p style={{ color: 'var(--text-muted)' }}>{step === 1 ? 'Reach thousands of students and professionals' : 'Verify your email to continue'}</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fee2e2' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="email@example.com"
                      style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: '3rem', fontSize: '1rem', marginTop: '0.5rem', gap: '8px' }}>
                <Mail size={20} /> {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  We've sent a 6-digit OTP to <strong>{formData.email}</strong>.
                </p>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.5rem', textDecoration: 'underline' }}>
                  Change email address
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Enter OTP</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    name="otp" 
                    required 
                    value={formData.otp} 
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: '3rem', fontSize: '1rem', marginTop: '0.5rem', gap: '8px' }}>
                <UserPlus size={20} /> {loading ? 'Creating account...' : 'Verify & Create Account'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already registered? <Link to="/owner-login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegisterPage;
