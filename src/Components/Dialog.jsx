import React, { useState } from 'react';
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

export default function CreateParcelPopup({ open, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: '',
    date: '',
    zone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Parcelle prête pour la moisson :", formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Créer une nouvelle parcelle</DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nom de la parcelle"
            name="name"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
          
          <Stack direction="row" spacing={2}>
            <TextField
              label="Taille (ha)"
              name="size"
              type="number"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              label="Zone / Secteur"
              name="zone"
              fullWidth
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
            placeholder=''
            fullWidth
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
          Créer la parcelle
        </Button>
      </DialogActions>
    </Dialog>
  );
}