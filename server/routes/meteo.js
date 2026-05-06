const express = require('express');
const router = express.Router();
const pool = require('../db');
const { fetchDonneesMeteo, sauvegarderMeteo } = require('../services/meteo-fetch');

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
    const userResult = await pool.query(
      "SELECT id, geolocalisation FROM utilisateur WHERE geolocalisation IS NOT NULL AND geolocalisation != '' LIMIT 1"
    );
    if (userResult.rows.length === 0)
      return res.status(404).json({ erreur: 'Aucun utilisateur avec géolocalisation' });

    const user = userResult.rows[0];
    const [lat, lon] = user.geolocalisation.split(',').map(Number);

    const data = await fetchDonneesMeteo(lat, lon);
    await sauvegarderMeteo(data, user.id);

    const { current, daily } = data;
    res.json({
      temperature:   current.temperature_2m,
      humidite:      current.relative_humidity_2m,
      pluie_mm:      current.precipitation,
      vent_kmh:      current.wind_speed_10m,
      pression_hpa:  Math.round(current.surface_pressure),
      ressenti:      current.apparent_temperature,
      condition_code: current.weather_code,
      date_heure:    current.time,
      previsions: daily.time.map((date, i) => ({
        date,
        min:            daily.temperature_2m_min[i],
        max:            daily.temperature_2m_max[i],
        lever_soleil:   daily.sunrise[i]?.split('T')[1],
        coucher_soleil: daily.sunset[i]?.split('T')[1],
        condition_code: daily.weather_code[i],
      })),
    });
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
