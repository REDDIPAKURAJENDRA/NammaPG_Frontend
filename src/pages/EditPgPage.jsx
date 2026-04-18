import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  Save, MapPin, Train, IndianRupee, Users, Image, 
  Wifi, Coffee, Wind, Zap, CheckCircle2, ChevronLeft, Loader2 
} from 'lucide-react';

const EditPgPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPg = async () => {
      try {
        const res = await api.get(`/pgs/${id}`);
        setFormData(res.data);
      } catch (err) {
        alert("Failed to load PG details");
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPg();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSharingChange = (type) => {
    setFormData(prev => {
      const sharing = [...prev.sharingTypes];
      if (sharing.includes(type)) {
        return { ...prev, sharingTypes: sharing.filter(s => s !== type) };
      } else {
        return { ...prev, sharingTypes: [...sharing, type] };
      }
    });
  };

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
      setImageUrl('');
    }
  };

  const removeImage = (url) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
  };

  const addCustomAmenity = () => {
    if (customAmenityInput.trim() && !formData.customAmenities?.includes(customAmenityInput.trim())) {
      setFormData(prev => ({ ...prev, customAmenities: [...(prev.customAmenities || []), customAmenityInput.trim()] }));
      setCustomAmenityInput('');
    }
  };

  const removeCustomAmenity = (amenity) => {
    setFormData(prev => ({ ...prev, customAmenities: prev.customAmenities.filter(a => a !== amenity) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/owner/pgs/${id}`, formData);
      alert("PG listing updated successfully!");
      navigate('/owner/dashboard');
    } catch (err) {
      alert("Failed to update listing. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', background: 'transparent', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Edit Your PG</h1>
            <p style={{ color: 'var(--text-muted)' }}>Listing ID: {id}</p>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <section>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>PG Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Skyline Luxury PG" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Area</label>
                    <input type="text" name="area" required value={formData.area} onChange={handleChange} placeholder="e.g. HSR Layout" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Nearest Metro Station</label>
                    <input type="text" name="nearestMetro" required value={formData.nearestMetro} onChange={handleChange} placeholder="e.g. Silk Institute" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Contact Number</label>
                    <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="10-digit mobile" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Gender Preference</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                      <option value="MALE">Boys Only</option>
                      <option value="FEMALE">Girls Only</option>
                      <option value="UNISEX">Colive (Any)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Pricing & Sharing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Monthly Rent (₹)</label>
                  <input type="number" name="rent" required value={formData.rent} onChange={handleChange} placeholder="e.g. 8500" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Security Deposit (₹)</label>
                  <input type="number" name="deposit" required value={formData.deposit} onChange={handleChange} placeholder="e.g. 15000" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '10px' }}>Sharing Types Available</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['1', '2', '3', '4+'].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      onClick={() => handleSharingChange(type)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.5rem', 
                        border: '1px solid var(--border)', 
                        background: formData.sharingTypes?.includes(type) ? 'var(--primary)' : 'white',
                        color: formData.sharingTypes?.includes(type) ? 'white' : 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                      {type} Sharing
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                <Checkbox label="Wifi" name="wifiAvailable" checked={formData.wifiAvailable} onChange={handleChange} />
                <Checkbox label="Food" name="foodAvailable" checked={formData.foodAvailable} onChange={handleChange} />
                <Checkbox label="AC Rooms" name="acAvailable" checked={formData.acAvailable} onChange={handleChange} />
                <Checkbox label="Laundry" name="laundryAvailable" checked={formData.laundryAvailable} onChange={handleChange} />
                <Checkbox label="Parking" name="parkingAvailable" checked={formData.parkingAvailable} onChange={handleChange} />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '10px' }}>Custom Amenities</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    value={customAmenityInput} 
                    onChange={(e) => setCustomAmenityInput(e.target.value)} 
                    placeholder="e.g. Gym, Swimming Pool" 
                    style={{ ...inputStyle, flex: 1 }} 
                  />
                  <button type="button" onClick={addCustomAmenity} className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '0.5rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.customAmenities?.map((amenity, idx) => (
                    <div key={idx} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                      {amenity}
                      <button type="button" onClick={() => removeCustomAmenity(amenity)} style={{ color: '#ef4444', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Images (URLs)</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="Paste image URL here" 
                  style={{ ...inputStyle, flex: 1 }} 
                />
                <button type="button" onClick={addImage} className="btn btn-primary" style={{ padding: '0 1.5rem' }}>Add</button>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {formData.images?.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '80px' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    <button 
                      type="button" 
                      onClick={() => removeImage(url)}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <button type="submit" className="btn btn-primary" disabled={saving} style={{ height: '3.5rem', fontSize: '1.125rem', fontWeight: 700, marginTop: '1rem', gap: '10px' }}>
              <Save size={24} /> {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--border)',
  fontSize: '1rem'
};

const Checkbox = ({ label, name, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    <span style={{ fontWeight: 500 }}>{label}</span>
  </label>
);

export default EditPgPage;
