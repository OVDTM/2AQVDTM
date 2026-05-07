const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { parcelle_id } = req.query;
    const result = parcelle_id
      ? await pool.query('SELECT * FROM cultures WHERE parcelle_id = $1', [parcelle_id])
      : await pool.query('SELECT * FROM cultures');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cultures WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Culture introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { type, date_semis, parcelle_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cultures (type, date_semis, parcelle_id) VALUES ($1, $2, $3) RETURNING *',
      [type, date_semis, parcelle_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { type, date_semis } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cultures SET type = $1, date_semis = $2 WHERE id = $3 RETURNING *',
      [type, date_semis, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Culture introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cultures WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Culture introuvable' });
    res.json({ message: 'Culture supprimée' });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
