import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem
} from '@mui/material';
import '../css/dialog.css';

const PLANT_TYPES = ['Blé', 'Maïs', 'Orge', 'Tournesol', 'Colza'];
const EMPTY_FORM = { name: '', size: '', type: '', date: '', zone: '' };

export default function CreateParcelPopup({ open, handleClose, onCreated, editData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.nom          ?? '',
        size: editData.surface?.toString() ?? '',
        type: editData.type         ?? '',
        date: editData.date_semis
          ? new Date(editData.date_semis).toISOString().split('T')[0]
          : '',
        zone: editData.localisation ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        const parcelleRes = await fetch(`/api/parcelles/${editData.parcelleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom:          formData.name,
            localisation: formData.zone,
            surface:      parseFloat(formData.size),
          }),
        });
        if (!parcelleRes.ok) throw new Error('Erreur lors de la modification de la parcelle.');

        if (editData.cultureId && formData.type && formData.date) {
          const cultRes = await fetch(`/api/cultures/${editData.cultureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: formData.type, date_semis: formData.date }),
          });
          if (!cultRes.ok) throw new Error('Erreur lors de la modification de la culture.');
        }
      } else {
        const parcelleResponse = await fetch('/api/parcelles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom:          formData.name,
            localisation: formData.zone,
            surface:      parseFloat(formData.size),
            ferme_id:     1,
          }),
        });
        if (!parcelleResponse.ok) throw new Error('Plantade sur la création de la parcelle.');
        const nouvelleParcelle = await parcelleResponse.json();

        if (formData.type && formData.date) {
          const cultureResponse = await fetch('/api/cultures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type:       formData.type,
              date_semis: formData.date,
              parcelle_id: nouvelleParcelle.id,
            }),
          });
          if (!cultureResponse.ok) throw new Error('La parcelle est là, mais la culture a foiré.');
        }
      }

      setFormData(EMPTY_FORM);
      handleClose();
      onCreated?.();
    } catch (error) {
      console.error('Eh bah bravo :', error);
      alert(error.message);
    }
  };

  const isEdit = Boolean(editData);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {isEdit ? 'Modifier la parcelle' : 'Créer une nouvelle parcelle'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nom de la parcelle"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Taille (ha)"
              name="size"
              type="number"
              fullWidth
              value={formData.size}
              onChange={handleChange}
            />
            <TextField
              label="Zone / Secteur"
              name="zone"
              fullWidth
              value={formData.zone}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            select
            label="Type de plantation"
            name="type"
            fullWidth
            value={formData.type}
            onChange={handleChange}
          >
            {PLANT_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date de plantation"
            name="date"
            type="date"
            fullWidth
            value={formData.date}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className='ok-button'
          sx={{ borderRadius: 10, px: 4 }}
        >
          {isEdit ? 'Enregistrer' : 'Créer la parcelle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
