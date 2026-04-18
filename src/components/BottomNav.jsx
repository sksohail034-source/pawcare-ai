import { NavLink } from 'react-router-dom';
import { Home, Heart, User, Clock, Leaf } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/dashboard', icon: <Home />, label: 'Home' },
    { path: '/routine', icon: <Clock />, label: 'Routine' },
    { path: '/care', icon: <Leaf />, label: 'Care' },
    { path: '/donate', icon: <Heart />, label: 'Donate' },
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
