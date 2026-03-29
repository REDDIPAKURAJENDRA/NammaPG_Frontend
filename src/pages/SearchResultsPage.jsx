import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SearchFilterBar from '../components/SearchFilterBar';
import PgCard from '../components/PgCard';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

const SearchResultsPage = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialFilters = Object.fromEntries(searchParams.entries());

  const fetchPgs = async (filters) => {
    setLoading(true);
    try {
      const q = new URLSearchParams(filters).toString();
      const res = await api.get(`/pgs?${q}`);
      setPgs(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPgs(initialFilters);
  }, [location.search]);

  const handleSearch = (filters) => {
    const query = new URLSearchParams(filters).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <MapPin size={16} /> Home / Search / Bangalore
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          
          {/* Filters Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={20} /> Filters
                </h3>
                <button onClick={() => navigate('/search')} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, background: 'transparent' }}>
                  Reset
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Simplified Sidebar Filters */}
                <div>
                  <label style={{ display: 'block', pointer: '600', marginBottom: '6px', fontSize: '0.875rem' }}>Area</label>
                  <input 
                    type="text" 
                    placeholder="Search Area" 
                    defaultValue={initialFilters.area}
                    onBlur={(e) => handleSearch({...initialFilters, area: e.target.value})}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', pointer: '600', marginBottom: '6px', fontSize: '0.875rem' }}>Max Rent</label>
                  <input 
                    type="number" 
                    placeholder="Max Rent" 
                    defaultValue={initialFilters.maxRent}
                    onBlur={(e) => handleSearch({...initialFilters, maxRent: e.target.value})}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', pointer: '600', marginBottom: '6px', fontSize: '0.875rem' }}>Gender</label>
                  <select 
                    defaultValue={initialFilters.gender}
                    onChange={(e) => handleSearch({...initialFilters, gender: e.target.value})}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}>
                    <option value="">Any</option>
                    <option value="MALE">Boys</option>
                    <option value="FEMALE">Girls</option>
                    <option value="UNISEX">Colive</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {loading ? "Searching..." : `${pgs.length} PGs found in ${initialFilters.area || 'Bangalore'}`}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select 
                  onChange={(e) => handleSearch({...initialFilters, sortBy: e.target.value})}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <option value="newest">Newest</option>
                  <option value="rent">Rent: Low to High</option>
                  <option value="distanceFromMetro">Distance from Metro</option>
                  <option value="verified">Verified First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4, 5, 6].map(n => <div key={n} style={{ height: '350px', backgroundColor: 'white', borderRadius: '0.75rem', animate: 'pulse' }}></div>)}
              </div>
            ) : pgs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {pgs.map(pg => <PgCard key={pg.id} pg={pg} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No exact matches found.</h3>
                <p>Try broadening your search or resetting filters.</p>
                <button onClick={() => navigate('/search')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Reset Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
