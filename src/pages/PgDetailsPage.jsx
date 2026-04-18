import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  MapPin, Train, ShieldCheck, Wifi, Coffee, Wind, Zap, 
  Phone, CreditCard, User, Clock, CheckCircle2, ChevronLeft 
} from 'lucide-react';

const PgDetailsPage = () => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPg = async () => {
      try {
        const res = await api.get(`/pgs/${id}`);
        setPg(res.data);
      } catch (err) {
        console.error("Failed to load PG details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPg();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!pg) return <div className="container" style={{ padding: '4rem 1rem' }}>PG not found.</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', background: 'transparent', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <ChevronLeft size={18} /> Back to Search Results
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
          
          {/* Content Section */}
          <main>
            {/* Image Gallery */}
            <div style={{ borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'white', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ height: '450px', position: 'relative' }}>
                <img 
                  src={pg.images?.[activeImage] || 'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&q=80&w=1200'} 
                  alt={pg.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {pg.verified && (
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <ShieldCheck size={20} /> Personally Verified
                  </div>
                )}
              </div>
              {pg.images?.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderTop: '1px solid var(--border)', overflowX: 'auto' }}>
                  {pg.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      onClick={() => setActiveImage(idx)}
                      style={{ 
                        width: '80px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        border: activeImage === idx ? '3px solid var(--primary)' : '1px solid var(--border)'
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* General Info */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{pg.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <MapPin size={20} />
                <span>{pg.address}, {pg.area}, {pg.city}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: 'var(--primary)', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Train size={24} /></div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nearest Metro</div>
                    <div style={{ fontWeight: 700 }}>{pg.nearestMetro} ({pg.distanceFromMetro} km)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#ec4899', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><User size={24} /></div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preferred Gender</div>
                    <div style={{ fontWeight: 700 }}>{pg.gender}</div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Description</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '2rem' }}>{pg.description || "No description provided."}</p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                <AmenityItem icon={<Wifi size={20} />} label="Wifi" available={pg.wifiAvailable} />
                <AmenityItem icon={<Coffee size={20} />} label="Food" available={pg.foodAvailable} />
                <AmenityItem icon={<Wind size={20} />} label="AC Rooms" available={pg.acAvailable} />
                <AmenityItem icon={<Zap size={20} />} label="Laundry" available={pg.laundryAvailable} />
                <AmenityItem icon={<ShieldCheck size={20} />} label="Security" available={true} />
                {pg.customAmenities?.map((amenity, idx) => (
                  <AmenityItem key={`custom-${idx}`} icon={<CheckCircle2 size={20} />} label={amenity} available={true} />
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar Area */}
          <aside>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '1rem', 
              border: '1px solid var(--border)', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '6rem'
            }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Starting from</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{pg.rent}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span></div>
                <div style={{ fontSize: '0.9rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <CreditCard size={14} /> ₹{pg.deposit} security deposit
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '1rem' }}>Sharing Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pg.sharingTypes?.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 600 }}>{s} Sharing</span>
                      <span style={{ fontSize: '0.85rem' }}>Available</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href={`tel:${pg.contactNumber}`} className="btn btn-primary" style={{ height: '3.5rem', fontSize: '1.125rem', gap: '10px' }}>
                  <Phone size={20} /> Contact Owner
                </a>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Clock size={14} /> Responds within 24 hours
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff7ed', borderRadius: '0.75rem', border: '1px solid #fed7aa' }}>
                <div style={{ fontSize: '0.85rem', color: '#9a3412', display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>Mention <b>NammaPG</b> when calling to get exclusive offers!</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

const AmenityItem = ({ icon, label, available }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    color: available ? 'var(--text-main)' : 'var(--text-muted)',
    opacity: available ? 1 : 0.4
  }}>
    <div style={{ color: available ? 'var(--primary)' : 'inherit' }}>{icon}</div>
    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{label}</span>
    {available ? <CheckCircle2 size={16} color="#10b981" style={{ marginLeft: 'auto' }} /> : <Zap size={16} style={{ marginLeft: 'auto', opacity: 0 }} />}
  </div>
);

export default PgDetailsPage;
