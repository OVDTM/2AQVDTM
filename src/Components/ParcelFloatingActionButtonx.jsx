import React from 'react';
import { useState } from 'react';
import '../css/fab.css';
import { Add } from '@mui/icons-material';
import CreateParcelPopup from './Dialog';

export default function FabMenu({ onCreated }) {
  const [open, setOpen] = useState(false);
  return (
    <>
        <div className="fab-container">
        <button
            className="fab fab-large"
            title="Créer une parcelle"
            onClick={() => setOpen(true)}
        >
            <Add />
        </button>
        </div>
        <CreateParcelPopup open={open} handleClose={() => setOpen(false)} onCreated={onCreated} />
    </>
  );
}