const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CONDITIONS = {
  0: 'Ciel dégagé', 1: 'Principalement dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: 'Brouillard', 48: 'Brouillard givrant',
  51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
  61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
  71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte',
  80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
  95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage avec forte grêle',
};

function labelCondition(code) {
  return CONDITIONS[code] ?? `Code ${code}`;
}

async function envoyerPrevisionsJour(email, previsions) {
  const today = previsions[0];
  if (!today) return;

  const lignesPrevisions = previsions.slice(0, 7).map((p, i) => {
    const label = i === 0 ? "Aujourd'hui" : new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
    return `
      <tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'}">
        <td style="padding:8px 12px;font-weight:${i === 0 ? 'bold' : 'normal'}">${label}</td>
        <td style="padding:8px 12px">${labelCondition(p.condition_code)}</td>
        <td style="padding:8px 12px;text-align:center">${p.min}°C / ${p.max}°C</td>
        <td style="padding:8px 12px;text-align:center">${p.lever_soleil ?? '—'} → ${p.coucher_soleil ?? '—'}</td>
      </tr>`;
  }).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#333">
      <div style="background:#2e7d32;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;color:#fff;font-size:20px">🌤 Prévisions météo du jour</h1>
        <p style="margin:4px 0 0;color:#c8e6c9;font-size:13px">
          ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style="background:#e8f5e9;padding:16px 24px">
        <h2 style="margin:0 0 4px;font-size:16px">Aujourd'hui : ${labelCondition(today.condition_code)}</h2>
        <p style="margin:0;font-size:14px">
          🌡 ${today.min}°C – ${today.max}°C &nbsp;|&nbsp;
          🌅 Lever : ${today.lever_soleil ?? '—'} &nbsp;|&nbsp;
          🌇 Coucher : ${today.coucher_soleil ?? '—'}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#2e7d32;color:#fff">
            <th style="padding:8px 12px;text-align:left">Jour</th>
            <th style="padding:8px 12px;text-align:left">Conditions</th>
            <th style="padding:8px 12px">Min / Max</th>
            <th style="padding:8px 12px">Soleil</th>
          </tr>
        </thead>
        <tbody>${lignesPrevisions}</tbody>
      </table>

      <p style="padding:12px 24px;font-size:11px;color:#999;margin:0">
        Données fournies par Open-Meteo — AgriSuivi
      </p>
    </div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      email,
    subject: `🌱 Prévisions météo — ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`,
    html,
  });
}

module.exports = { envoyerPrevisionsJour };
