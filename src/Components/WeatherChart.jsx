import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import '../css/chart.css';

export default function WeatherChart() {
  const [donnees, setDonnees]       = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch('/api/meteo')
      .then(res => res.json())
      .then(data => {
        const tri = [...data].reverse();
        setDonnees({
          dates:        tri.map(d => new Date(d.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })),
          temperatures: tri.map(d => d.temperature),
          humidite:     tri.map(d => d.humidite),
          pluieMm:      tri.map(d => d.pluie_mm),
        });
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  if (chargement) return <div className="chart">Chargement...</div>;
  if (!donnees || donnees.dates.length === 0)
    return <div className="chart">Aucune donnée météo disponible</div>;

  return (
    <LineChart
      height={400}
      className="chart"
      series={[
        { data: donnees.temperatures, label: 'Température (°C)' },
        { data: donnees.humidite,     label: 'Humidité (%)' },
        { data: donnees.pluieMm,      label: 'Pluie (mm)' },
      ]}
      xAxis={[{ data: donnees.dates, label: 'Date', scaleType: 'band' }]}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}
