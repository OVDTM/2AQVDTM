const cron = require('node-cron');
const pool = require('./db');
const { fetchDonneesMeteo, fetchMeteoTousUtilisateurs } = require('./services/meteo-fetch');
const { envoyerPrevisionsJour } = require('./services/email');

async function envoyerEmailsMeteo() {
  const { rows } = await pool.query(
    "SELECT id, email, geolocalisation FROM utilisateur WHERE geolocalisation IS NOT NULL AND geolocalisation != '' AND email IS NOT NULL"
  );

  for (const user of rows) {
    try {
      const [lat, lon] = user.geolocalisation.split(',').map(Number);
      if (isNaN(lat) || isNaN(lon)) continue;

      const data = await fetchDonneesMeteo(lat, lon);
      const previsions = data.daily.time.map((date, i) => ({
        date,
        min:            data.daily.temperature_2m_min[i],
        max:            data.daily.temperature_2m_max[i],
        lever_soleil:   data.daily.sunrise[i]?.split('T')[1],
        coucher_soleil: data.daily.sunset[i]?.split('T')[1],
        condition_code: data.daily.weather_code[i],
      }));

      await envoyerPrevisionsJour(user.email, previsions);
    } catch (err) {
      console.error(`email user ${user.id}:`, err.message);
    }
  }
}

function demarrerScheduler() {
  cron.schedule('0 * * * *', fetchMeteoTousUtilisateurs);
  cron.schedule('0 8 * * *', envoyerEmailsMeteo);
  fetchMeteoTousUtilisateurs().catch(err => console.error('meteo init:', err.message));
}

module.exports = { demarrerScheduler, envoyerEmailsMeteo };
