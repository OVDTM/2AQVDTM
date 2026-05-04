import React, { useState } from 'react';
import '../css/navbar.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function Navrail() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className="nav-container">
      {[...Array(4)].map((_, index) => (
        <button
          key={index}
          className={`nav-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => setActiveIndex(index)}
        >
          <AddCircleIcon />
        </button>
      ))}
    </nav>
  );
}