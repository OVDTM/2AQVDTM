const pool = require('../db');

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchDonneesMeteo(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,surface_pressure,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code',
    timezone: 'auto',
    forecast_days: 7,
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);
  if (!response.ok) throw new Error(`Erreur API météo : ${response.status}`);
  return response.json();
}

async function sauvegarderMeteo(data, user_id) {
  const { temperature_2m, relative_humidity_2m, precipitation } = data.current;
  await pool.query(
    'INSERT INTO meteo (temperature, humidite, pluie_mm, date_heure, user_id) VALUES ($1, $2, $3, NOW(), $4)',
    [temperature_2m, relative_humidity_2m, precipitation, user_id]
  );
}

async function fetchMeteoTousUtilisateurs() {
  const users = await pool.query(
    "SELECT id, geolocalisation FROM utilisateur WHERE geolocalisation IS NOT NULL AND geolocalisation != ''"
  );

  for (const user of users.rows) {
    try {
      const [lat, lon] = user.geolocalisation.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        const data = await fetchDonneesMeteo(lat, lon);
        await sauvegarderMeteo(data, user.id);
        console.log(`[Météo] Sauvegardé pour user ${user.id} : T°${data.current.temperature_2m}°C`);
      }
    } catch (err) {
      console.error(`[Météo] Erreur pour user ${user.id} :`, err.message);
    }
  }
}

module.exports = { fetchDonneesMeteo, sauvegarderMeteo, fetchMeteoTousUtilisateurs };
