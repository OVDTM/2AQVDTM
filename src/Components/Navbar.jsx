import React from 'react';
import '../css/navbar.css';
import { Home, MyLocation, AssignmentLate, Logout } from '@mui/icons-material';
import BookIcon from '@mui/icons-material/Book';

export default function Navrail({ activeIndex, setActiveIndex }) {
  const pages = [
    { name: 'Dashboard', icon: <Home /> },
    { name: 'Parcelles', icon: <MyLocation /> },
    { name: 'Alertes', icon: <AssignmentLate /> }
  ];

  return (
    <div className="nav-rail">
      <nav className="nav-container">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`nav-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {page.icon}
          </button>
        ))}
      </nav>
      <nav className="nav-container">
        <button className={`nav-item`} onClick={() => alert('Déconnexion')}>
          <Logout />
        </button>
        <button className={`nav-item`} onClick={() => alert('redirecting to docs')}>
          <BookIcon />
        </button>
      </nav>
    </div>
  );
}