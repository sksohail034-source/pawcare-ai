import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, Dumbbell, PawPrint, Menu, X, Syringe, Clock, BarChart3, Pill, ShoppingBag, AlertCircle, Leaf, CreditCard, Heart } from 'lucide-react';

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  const mainItems = [
    { path: '/dashboard', icon: <Home size={22} />, label: 'Home' },
    { path: '/ai', icon: <Sparkles size={22} />, label: 'AI Scan' },
    { path: '/exercise', icon: <Dumbbell size={22} />, label: 'Exercise' },
    { path: '/pets', icon: <PawPrint size={22} />, label: 'Pets' },
  ];

  const moreItems = [
    { path: '/vaccinations', icon: <Syringe size={20} />, label: 'Vaccinations' },
    { path: '/routine', icon: <Clock size={20} />, label: 'Smart Routine' },
    { path: '/health-charts', icon: <BarChart3 size={20} />, label: 'Health Charts' },
    { path: '/medications', icon: <Pill size={20} />, label: 'Medications' },
    { path: '/products', icon: <ShoppingBag size={20} />, label: 'Products' },
    { path: '/emergency-vet', icon: <AlertCircle size={20} />, label: 'Emergency Vet' },
    { path: '/care-protocols', icon: <Leaf size={20} />, label: 'Care Protocols' },
    { path: '/subscriptions', icon: <CreditCard size={20} />, label: 'Subscription' },
    { path: '/donations', icon: <Heart size={20} />, label: 'Donations' },
  ];

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <>
      {showMore && (
        <div className="more-menu-overlay" onClick={() => setShowMore(false)}>
          <div className="more-menu" onClick={e => e.stopPropagation()}>
            <div className="more-menu-header">
              <span style={{ fontWeight: 700, fontSize: 16 }}>More Features</span>
              <button onClick={() => setShowMore(false)} style={{ padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            <div className="more-menu-grid">
              {moreItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `more-menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setShowMore(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {mainItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          className={`nav-item ${isMoreActive ? 'active' : ''}`}
          onClick={() => setShowMore(!showMore)}
        >
          <Menu size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
