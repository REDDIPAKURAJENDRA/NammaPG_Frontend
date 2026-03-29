import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Train, ShieldCheck, Wifi, Coffee, Wind, Zap } from 'lucide-react';

const PgCard = ({ pg }) => {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '200px' }}>
        <img 
          src={pg.images?.[0] || 'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&q=80&w=800'} 
          alt={pg.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {pg.verified && (
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={14} /> Verified
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          ₹{pg.rent}/mo
        </div>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
          <MapPin size={12} /> {pg.area}, {pg.city}
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{pg.name}</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {pg.sharingTypes?.map((s, idx) => (
            <span key={idx} style={{ fontSize: '0.7rem', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{s} Sharing</span>
          ))}
          <span style={{ fontSize: '0.7rem', backgroundColor: '#eef2ff', color: '#4f46e5', padding: '2px 6px', borderRadius: '4px' }}>{pg.gender}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
            <Train size={16} color="#4f46e5" />
            <span>Near {pg.nearestMetro} ({pg.distanceFromMetro} km)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {pg.wifiAvailable && <Wifi size={16} color="var(--text-muted)" title="Wifi" />}
            {pg.foodAvailable && <Coffee size={16} color="var(--text-muted)" title="Food" />}
            {pg.acAvailable && <Wind size={16} color="var(--text-muted)" title="AC" />}
            {pg.laundryAvailable && <Zap size={16} color="var(--text-muted)" title="Laundry" />}
          </div>
        </div>

        <Link 
          to={`/pg/${pg.id}`} 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 'auto', fontSize: '0.9rem' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PgCard;
