const express = require('express');
const router = express.Router();
const pool = require('../db');

// Règles métier : génère des alertes à partir des données météo
async function genererAlertes() {
  const meteo = await pool.query(
    'SELECT * FROM meteo ORDER BY date_heure DESC LIMIT 1'
  );
  if (meteo.rows.length === 0) return [];

  const { temperature, humidite, pluie_mm } = meteo.rows[0];
  const alertes = [];

  if (humidite > 80 && temperature > 20) {
    alertes.push({ type: 'risque_maladie', niveau: 'élevé', message: `Humidité ${humidite}% + T°${temperature}°C : risque mildiou` });
  }
  if (pluie_mm === 0 && temperature > 30) {
    alertes.push({ type: 'risque_secheresse', niveau: 'moyen', message: `Absence de pluie et T°${temperature}°C : risque sécheresse` });
  }
  if (temperature < 0) {
    alertes.push({ type: 'risque_gel', niveau: 'élevé', message: `T°${temperature}°C : risque de gel` });
  }

  return alertes;
}

router.get('/', async (_req, res) => {
  try {
    const [stockees, generees] = await Promise.all([
      pool.query('SELECT * FROM alertes ORDER BY date_ DESC'),
      genererAlertes(),
    ]);
    res.json({ stockees: stockees.rows, generees });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.get('/parcelle/:parcelle_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM alertes WHERE parcelle_id = $1 ORDER BY date_ DESC',
      [req.params.parcelle_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post('/', async (req, res) => {
  const { type, niveau, date_, parcelle_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alertes (type, niveau, date_, parcelle_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, niveau, date_, parcelle_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM alertes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Alerte introuvable' });
    res.json({ message: 'Alerte supprimée' });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
