const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_req, res) => {
  try {
    const [parcelles, alertes, observations, meteo] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM parcelle'),
      pool.query("SELECT COUNT(*) FROM alertes WHERE date_ >= NOW() - INTERVAL '7 days'"),
      pool.query('SELECT * FROM observation ORDER BY date_ DESC LIMIT 5'),
      pool.query('SELECT * FROM meteo ORDER BY date_heure DESC LIMIT 1'),
    ]);

    res.json({
      nb_parcelles: parseInt(parcelles.rows[0].count),
      alertes_semaine: parseInt(alertes.rows[0].count),
      dernieres_observations: observations.rows,
      meteo_actuelle: meteo.rows[0] || null,
    });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
