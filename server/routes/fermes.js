const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ferme');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ferme WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Ferme introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nom, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ferme (nom, user_id) VALUES ($1, $2) RETURNING *',
      [nom, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { nom } = req.body;
  try {
    const result = await pool.query(
      'UPDATE ferme SET nom = $1 WHERE id = $2 RETURNING *',
      [nom, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Ferme introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM ferme WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Ferme introuvable' });
    res.json({ message: 'Ferme supprimée' });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
