import React, { useState } from 'react';
import { Search, Train, Wallet, Users, Settings2 } from 'lucide-react';

const SearchFilterBar = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    city: 'Bangalore',
    area: '',
    nearestMetro: '',
    maxRent: '',
    sharingType: '',
    gender: '',
    foodAvailable: '',
    acAvailable: '',
    ...initialFilters
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <section style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
      marginTop: '-3rem',
      position: 'relative',
      zIndex: 10
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <Search size={14} /> Area
          </label>
          <input 
            type="text" 
            name="area" 
            value={filters.area} 
            onChange={handleChange}
            placeholder="e.g. HSR Layout, Koramangala"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
          />
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <Train size={14} /> Nearest Metro
          </label>
          <input 
            type="text" 
            name="nearestMetro" 
            value={filters.nearestMetro} 
            onChange={handleChange}
            placeholder="e.g. Indiranagar, Majestic"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
          />
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <Wallet size={14} /> Max Budget (₹)
          </label>
          <input 
            type="number" 
            name="maxRent" 
            value={filters.maxRent} 
            onChange={handleChange}
            placeholder="e.g. 15000"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
          />
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <Users size={14} /> Occupancy / Gender
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
              name="sharingType" 
              value={filters.sharingType} 
              onChange={handleChange}
              style={{ width: '50%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <option value="">Sharing</option>
              <option value="1">1 Sharing</option>
              <option value="2">2 Sharing</option>
              <option value="3">3 Sharing</option>
              <option value="4">4 Sharing</option>
            </select>
            <select 
              name="gender" 
              value={filters.gender} 
              onChange={handleChange}
              style={{ width: '50%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <option value="">Gender</option>
              <option value="MALE">Boys</option>
              <option value="FEMALE">Girls</option>
              <option value="UNISEX">Colive</option>
            </select>
          </div>
        </div>

        <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '3rem', fontSize: '1rem', gap: '8px' }}>
            <Search size={20} /> Find PGs
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="checkbox" name="foodAvailable" checked={filters.foodAvailable} onChange={handleChange} /> Food Included
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="checkbox" name="acAvailable" checked={filters.acAvailable} onChange={handleChange} /> AC Available
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Settings2 size={16} /> Advanced Filters
        </div>
      </div>
    </section>
  );
};

export default SearchFilterBar;
