import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, Loader, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmergencyVetPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

  useEffect(() => {
    getLocationAndClinics();
  }, []);

  async function getLocationAndClinics() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      
      await fetchNearbyClinics(latitude, longitude);
    } catch (err) {
      setError('Could not get location. Please enable location access.');
      toast.error('Location access required');
      setLoading(false);
    }
  }

  async function fetchNearbyClinics(lat, lng) {
    setLoading(true);
    try {
      const radius = 10000;
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();
      
      const clinicsData = data.elements.map(el => ({
        id: el.id,
        name: el.tags?.name || 'Veterinary Clinic',
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        address: el.tags?.['addr:street'] ? 
          `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}, ${el.tags['addr:city'] || ''}` : 
          'Address not available',
        phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
        openingHours: el.tags?.opening_hours || 'Hours not available',
        website: el.tags?.website || '',
      }));

      setClinics(clinicsData.slice(0, 20));
    } catch (err) {
      setError('Could not find nearby clinics');
      toast.error('Error finding clinics');
    } finally {
      setLoading(false);
    }
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  }

  function callClinic(phone) {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  }

  function openMaps(lat, lon, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, '_blank');
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h2>🚨 Emergency Vet Locator</h2>
        <p style={{ color: 'var(--text-muted)' }}>Find nearest 24/7 veterinary clinics</p>
      </div>

      {error && (
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 255, 255, 0.5))',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginBottom: 24 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={24} color="#dc2626" />
            <div>
              <strong style={{ color: '#dc2626' }}>Location Required</strong>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{error}</p>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={getLocationAndClinics}
            style={{ marginTop: 12 }}
          >
            Retry Location
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Loader size={40} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: 16 }} />
          <p>Finding nearby clinics...</p>
        </div>
      )}

      {!loading && !error && clinics.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <MapPin size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3>No clinics found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try expanding your search area</p>
        </div>
      )}

      {!loading && clinics.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Found {clinics.length} clinics near you
          </p>
        </div>
      )}

      {clinics.map((clinic, idx) => (
        <div 
          key={clinic.id} 
          className="card animate-fade-in"
          style={{ marginBottom: 12, cursor: 'pointer' }}
          onClick={() => setSelectedClinic(selectedClinic?.id === clinic.id ? null : clinic)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{clinic.name}</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {clinic.address}
                </span>
              </div>
              
              {userLocation && (
                <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
                  ~{getDistance(userLocation.lat, userLocation.lng, clinic.lat, clinic.lon)} km away
                </div>
              )}
              
              {selectedClinic?.id === clinic.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 13 }}>{clinic.openingHours}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8 }}>
                    {clinic.phone && (
                      <button 
                        className="btn btn-primary"
                        onClick={(e) => { e.stopPropagation(); callClinic(clinic.phone); }}
                        style={{ flex: 1 }}
                      >
                        <Phone size={16} /> Call
                      </button>
                    )}
                    <button 
                      className="btn btn-secondary"
                      onClick={(e) => { e.stopPropagation(); openMaps(clinic.lat, clinic.lon, clinic.name); }}
                      style={{ flex: 1 }}
                    >
                      <Navigation size={16} /> Directions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}