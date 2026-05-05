const cron = require('node-cron');
const { fetchMeteoTousUtilisateurs } = require('./services/meteo-fetch');

function demarrerScheduler() {
  // Toutes les heures (minute 0)
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Récupération météo...');
    await fetchMeteoTousUtilisateurs();
  });

  console.log('[Scheduler] Démarré — météo toutes les heures');

  // Premier fetch immédiat au lancement du serveur
  fetchMeteoTousUtilisateurs().catch((err) =>
    console.error('[Scheduler] Erreur au démarrage :', err.message)
  );
}

module.exports = { demarrerScheduler };
