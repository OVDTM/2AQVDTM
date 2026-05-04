import React, { useState } from 'react';
import '../css/navbar.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Home, MyLocation, WaterDrop, AssignmentLate } from '@mui/icons-material';

export default function Navrail() {
  const [activeIndex, setActiveIndex] = useState(0);

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