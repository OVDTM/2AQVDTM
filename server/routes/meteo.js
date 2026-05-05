const express = require('express');
const router = express.Router();
const pool = require('../db');
const { fetchMeteoTousUtilisateurs } = require('../services/meteo-fetch');

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meteo ORDER BY date_heure DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/derniere', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meteo ORDER BY date_heure DESC LIMIT 1');
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Aucune donnée météo' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/refresh', async (_req, res) => {
  try {
    await fetchMeteoTousUtilisateurs();
    const result = await pool.query('SELECT * FROM meteo ORDER BY date_heure DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { temperature, humidite, pluie_mm, date_heure, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO meteo (temperature, humidite, pluie_mm, date_heure, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [temperature, humidite, pluie_mm, date_heure, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
