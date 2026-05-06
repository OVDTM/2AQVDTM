const cron = require('node-cron');
const pool = require('./db');
const { fetchDonneesMeteo, fetchMeteoTousUtilisateurs } = require('./services/meteo-fetch');
const { envoyerPrevisionsJour } = require('./services/email');

async function envoyerEmailsMeteo() {
  const users = await pool.query(
    "SELECT id, email, geolocalisation FROM utilisateur WHERE geolocalisation IS NOT NULL AND geolocalisation != '' AND email IS NOT NULL"
  );

  for (const user of users.rows) {
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
      console.log(`[Email] Prévisions envoyées à ${user.email}`);
    } catch (err) {
      console.error(`[Email] Erreur pour user ${user.id} :`, err.message);
    }
  }
}

function demarrerScheduler() {
  // Toutes les heures (minute 0)
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Récupération météo...');
    await fetchMeteoTousUtilisateurs();
  });

  // Chaque matin à 8h00 : envoi des prévisions par email
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Envoi des emails météo...');
    await envoyerEmailsMeteo();
  });

  console.log('[Scheduler] Démarré ; météo toutes les heures, emails à 8h00');

  fetchMeteoTousUtilisateurs().catch((err) =>
    console.error('[Scheduler] Erreur au démarrage :', err.message)
  );
}

module.exports = { demarrerScheduler, envoyerEmailsMeteo };
