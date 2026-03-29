import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  BarChart, Home, PlusCircle, Edit3, Trash2, Clock, CheckCircle, XCircle, 
  Eye, IndianRupee, MapPin, Users 
} from 'lucide-react';

const OwnerDashboardPage = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMyPgs = async () => {
    try {
      const res = await api.get('/owner/pgs');
      setPgs(res.data);
    } catch (err) {
      console.error("Dashboard failed to load", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPgs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/owner/pgs/${id}`);
        setPgs(pgs.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete listing");
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. You have {pgs.length} active listings.</p>
          </div>
          <Link to="/owner/add-pg" className="btn btn-primary" style={{ gap: '8px', padding: '0.75rem 1.5rem' }}>
            <PlusCircle size={20} /> Add New Listing
          </Link>
        </header>

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <StatCard icon={<Home />} label="Total PGs" value={pgs.length} color="#4f46e5" />
          <StatCard icon={<CheckCircle />} label="Approved" value={pgs.filter(p => p.approvalStatus === 'APPROVED').length} color="#10b981" />
          <StatCard icon={<Clock />} label="Pending Review" value={pgs.filter(p => p.approvalStatus === 'PENDING').length} color="#f59e0b" />
          <StatCard icon={<Users />} label="Occupancy" value="~85%" color="#ec4899" />
        </div>

        {/* Listings Table */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Your PG Listings</h3>
            <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', background: 'transparent' }}>View Full History</button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your listings...</div>
          ) : pgs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>PG Details</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Rent</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Verified</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pgs.map((pg) => (
                    <tr key={pg.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <img 
                            src={pg.images?.[0] || 'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=100&h=100&fit=crop'} 
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                            alt=""
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{pg.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} /> {pg.area}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IndianRupee size={16} /> {pg.rent}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <StatusBadge status={pg.approvalStatus} />
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        {pg.verified ? (
                          <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                            <CheckCircle size={16} /> Yes
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                            <Clock size={16} /> Pending
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <Link to={`/pg/${pg.id}`} style={{ color: 'var(--primary)', padding: '6px', backgroundColor: '#eef2ff', borderRadius: '6px' }} title="View">
                            <Eye size={18} />
                          </Link>
                          <Link to={`/owner/edit-pg/${pg.id}`} style={{ color: 'var(--accent)', padding: '6px', backgroundColor: '#fff7ed', borderRadius: '6px' }} title="Edit">
                            <Edit3 size={18} />
                          </Link>
                          <button onClick={() => handleDelete(pg.id)} style={{ color: '#ef4444', padding: '6px', backgroundColor: '#fef2f2', borderRadius: '6px', background: 'transparent' }} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
              <Home size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>You haven't listed any PGs yet.</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start reaching potential tenants in minutes!</p>
              <Link to="/owner/add-pg" className="btn btn-primary">Create Your First Listing</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
    <div style={{ backgroundColor: `${color}15`, color: color, padding: '12px', borderRadius: '12px' }}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  let styles = { color: '#6b7280', bg: '#f3f4f6' };
  if (status === 'APPROVED') styles = { color: '#059669', bg: '#dcfce7' };
  if (status === 'REJECTED') styles = { color: '#dc2626', bg: '#fef2f2' };
  if (status === 'PENDING') styles = { color: '#d97706', bg: '#fff7ed' };

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px',
      padding: '4px 10px', 
      borderRadius: '2rem', 
      fontSize: '0.75rem', 
      fontWeight: 700, 
      backgroundColor: styles.bg, 
      color: styles.color,
      textTransform: 'uppercase'
    }}>
      {status === 'APPROVED' && <CheckCircle size={12} />}
      {status === 'PENDING' && <Clock size={12} />}
      {status === 'REJECTED' && <XCircle size={12} />}
      {status}
    </span>
  );
};

export default OwnerDashboardPage;
