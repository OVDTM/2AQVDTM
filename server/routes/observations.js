const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { parcelle_id } = req.query;
    const result = parcelle_id
      ? await pool.query('SELECT * FROM observation WHERE parcelle_id = $1 ORDER BY date_ DESC', [parcelle_id])
      : await pool.query('SELECT * FROM observation ORDER BY date_ DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM observation WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Observation introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { etat, commentaire, date_, parcelle_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO observation (etat, commentaire, date_, parcelle_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [etat, commentaire, date_, parcelle_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { etat, commentaire } = req.body;
  try {
    const result = await pool.query(
      'UPDATE observation SET etat = $1, commentaire = $2 WHERE id = $3 RETURNING *',
      [etat, commentaire, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Observation introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM observation WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Observation introuvable' });
    res.json({ message: 'Observation supprimée' });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
