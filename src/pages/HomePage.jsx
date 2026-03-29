import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SearchFilterBar from '../components/SearchFilterBar';
import PgCard from '../components/PgCard';
import { ArrowRight, Star, MapPin, Users, Search as SearchIcon } from 'lucide-react';

const HomePage = () => {
  const [featuredPgs, setFeaturedPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/pgs?verified=true&sortBy=verified');
        setFeaturedPgs(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch Pgs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (filters) => {
    const query = new URLSearchParams(filters).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <header style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', 
        padding: '6rem 0 8rem 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Find Your Perfect PG in Bangalore
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Discover affordable, verified, and high-quality PGs near metro stations for a hassle-free living experience.
          </p>
        </div>
      </header>

      <div className="container" style={{ marginTop: '-4rem' }}>
        <SearchFilterBar onSearch={handleSearch} />
      </div>

      {/* Featured Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Featured Verified PGs</h2>
              <p style={{ color: 'var(--text-muted)' }}>Handpicked and verified for your peace of mind</p>
            </div>
            <button 
              onClick={() => navigate('/search')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, background: 'transparent' }}>
              View all PGs <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3].map(n => <div key={n} style={{ height: '400px', backgroundColor: 'white', borderRadius: '1rem', animate: 'pulse' }}></div>)}
            </div>
          ) : featuredPgs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {featuredPgs.map(pg => <PgCard key={pg.id} pg={pg} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: 'white', borderRadius: '1rem' }}>
              <SearchIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>No PGs found in your area yet.</h3>
              <p>Try searching with different filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '6rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem' }}>Why NammaPG?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#eef2ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary)' }}>
                <MapPin size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Near Metro Stations</h3>
              <p style={{ color: 'var(--text-muted)' }}>Save time and money on daily commute with our metro-focused search.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#ecfdf5', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--secondary)' }}>
                <Star size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Verified Listings</h3>
              <p style={{ color: 'var(--text-muted)' }}>Our team personally verifies every PG to ensure safety and quality.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#fff7ed', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--accent)' }}>
                <Users size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Zero Brokerage</h3>
              <p style={{ color: 'var(--text-muted)' }}>Directly connect with PG owners and save thousands on brokerage fees.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', backgroundColor: 'var(--text-main)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>NammaPG</h2>
          <p style={{ opacity: 0.6 }}>© 2024 NammaPG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
