import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  ShieldCheck, AlertCircle, CheckCircle, XCircle, Trash2, 
  MapPin, IndianRupee, User, Eye, Search, Clock, ShieldAlert 
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllPgs = async () => {
    try {
      const res = await api.get('/admin/pgs');
      setPgs(res.data);
    } catch (err) {
      console.error("Management console failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPgs();
  }, []);

  const handleVerify = async (id, currentStatus) => {
    try {
      const res = await api.put(`/admin/pgs/${id}/verify`, { verified: !currentStatus });
      setPgs(pgs.map(p => p.id === id ? res.data : p));
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleApproval = async (id, status) => {
    try {
      const res = await api.put(`/admin/pgs/${id}/approval-status`, { status });
      setPgs(pgs.map(p => p.id === id ? res.data : p));
    } catch (err) {
      alert("Approval update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Delete this listing permanently?")) {
      try {
        await api.delete(`/admin/pgs/${id}`);
        setPgs(pgs.filter(p => p.id !== id));
      } catch (err) {
        alert("Deletion failed");
      }
    }
  };

  const filteredPgs = pgs.filter(pg => {
    const matchesFilter = filter === 'ALL' || pg.approvalStatus === filter;
    const matchesSearch = pg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pg.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pg.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={32} color="#dc2626" /> Admin Console
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>System-wide moderation and verification controls.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM STATUS</div>
              <div style={{ color: '#059669', fontWeight: 800 }}>OPERATIONAL</div>
            </div>
          </div>
        </header>

        {/* Global Toolbar */}
        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by PG name, area or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '0.75rem' }}>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.5rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: filter === f ? 'white' : 'transparent',
                  color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing with database...</div>
        ) : filteredPgs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredPgs.map(pg => (
              <div key={pg.id} style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '1.5rem', padding: '1.5rem', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <img src={pg.images?.[0]} style={{ width: '120px', height: '90px', borderRadius: '0.75rem', objectFit: 'cover' }} alt="" />
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pg.name}</h3>
                    <StatusBadge status={pg.approvalStatus} />
                    {pg.verified && <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800 }}><ShieldCheck size={14} /> VERIFIED</span>}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '2rem', fontSize: '0.9rem', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {pg.area}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={16} /> {pg.rent}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {pg.ownerName || 'Unknown Owner'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {new Date(pg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pg.approvalStatus === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleApproval(pg.id, 'APPROVED')} className="btn" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.5rem 1rem' }}>Approve</button>
                        <button onClick={() => handleApproval(pg.id, 'REJECTED')} className="btn" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.5rem 1rem' }}>Reject</button>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleVerify(pg.id, pg.verified)} 
                        className="btn" 
                        style={{ backgroundColor: pg.verified ? '#f1f5f9' : '#e0e7ff', color: pg.verified ? '#475569' : '#4338ca', flex: 1, padding: '0.5rem' }}>
                        {pg.verified ? 'Unverify' : 'Verify PG'}
                      </button>
                      <button onClick={() => handleDelete(pg.id)} style={{ color: '#ef4444', background: 'transparent', padding: '0.5rem' }}><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No PG listings match your criteria.</h3>
          </div>
        )}

      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let styles = { color: '#6b7280', bg: '#f3f4f6' };
  if (status === 'APPROVED') styles = { color: '#059669', bg: '#dcfce7' };
  if (status === 'REJECTED') styles = { color: '#dc2626', bg: '#fef2f2' };
  if (status === 'PENDING') styles = { color: '#d97706', bg: '#fff7ed' };

  return (
    <span style={{ padding: '2px 10px', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 800, backgroundColor: styles.bg, color: styles.color, textTransform: 'uppercase' }}>
      {status}
    </span>
  );
};

export default AdminDashboardPage;
