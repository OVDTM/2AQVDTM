import React from 'react';
import '../css/navbar.css';
import { Home, MyLocation, WaterDrop, AssignmentLate } from '@mui/icons-material';

export default function Navrail({ activeIndex, setActiveIndex }) {
  const pages = [
    { name: 'Dashboard', icon: <Home /> },
    { name: 'Parcelles', icon: <MyLocation /> },
    { name: 'Irrigation', icon: <WaterDrop /> },
    { name: 'Alertes', icon: <AssignmentLate /> }
  ];

  return (
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
  );
}