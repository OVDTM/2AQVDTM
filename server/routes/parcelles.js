const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parcelle');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parcelle WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Parcelle introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nom, localisation, surface, ferme_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO parcelle (nom, localisation, surface, ferme_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, localisation, surface, ferme_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { nom, localisation, surface } = req.body;
  try {
    const result = await pool.query(
      'UPDATE parcelle SET nom = $1, localisation = $2, surface = $3 WHERE id = $4 RETURNING *',
      [nom, localisation, surface, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Parcelle introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM parcelle WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Parcelle introuvable' });
    res.json({ message: 'Parcelle supprimée' });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
