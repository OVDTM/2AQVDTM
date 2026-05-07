require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const fermesRouter = require('./routes/fermes');
const parcellesRouter = require('./routes/parcelles');
const culturesRouter = require('./routes/cultures');
const observationsRouter = require('./routes/observations');
const alertesRouter = require('./routes/alertes');
const meteoRouter = require('./routes/meteo');
const dashboardRouter = require('./routes/dashboard');
const docRouter = require('./routes/doc');
const { demarrerScheduler, envoyerEmailsMeteo } = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/debug/emails', async (_req, res) => {
  try {
    await envoyerEmailsMeteo();
    res.json({ status: 'ok', message: 'Emails envoyés' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/fermes', fermesRouter);
app.use('/api/parcelles', parcellesRouter);
app.use('/api/cultures', culturesRouter);
app.use('/api/observations', observationsRouter);
app.use('/api/alertes', alertesRouter);
app.use('/api/meteo', meteoRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/doc', docRouter);

const buildPath = path.join(__dirname, 'public');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  demarrerScheduler();
});
