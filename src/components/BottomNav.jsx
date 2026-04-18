import { NavLink } from 'react-router-dom';
import { Home, Heart, MapPin, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/dashboard', icon: <Home />, label: 'Home' },
    { path: '/favorites', icon: <Heart />, label: 'Favorites' },
    { path: '/location', icon: <MapPin />, label: 'Location' },
    { path: '/profile', icon: <User />, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-link nav-item ${isActive ? 'active' : ''}`}
        >
          {item.icon}
          <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: 500 }}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
