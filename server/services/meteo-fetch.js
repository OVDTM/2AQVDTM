const pool = require('../db');

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchEtSauvegarderMeteo(latitude, longitude, user_id) {
  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur API météo : ${response.status}`);

  const data = await response.json();
  const { temperature_2m, relative_humidity_2m, precipitation } = data.current;

  await pool.query(
    'INSERT INTO meteo (temperature, humidite, pluie_mm, date_heure, user_id) VALUES ($1, $2, $3, NOW(), $4)',
    [temperature_2m, relative_humidity_2m, precipitation, user_id]
  );

  console.log(`[Météo] Sauvegardé pour user ${user_id} : T°${temperature_2m}°C, H${relative_humidity_2m}%, P${precipitation}mm`);
}

async function fetchMeteoTousUtilisateurs() {
  const users = await pool.query(
    "SELECT id, geolocalisation FROM utilisateur WHERE geolocalisation IS NOT NULL AND geolocalisation != ''"
  );

  for (const user of users.rows) {
    try {
      const [lat, lon] = user.geolocalisation.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        await fetchEtSauvegarderMeteo(lat, lon, user.id);
      }
    } catch (err) {
      console.error(`[Météo] Erreur pour user ${user.id} :`, err.message);
    }
  }
}

module.exports = { fetchMeteoTousUtilisateurs };
