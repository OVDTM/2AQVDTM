import { useState, useEffect } from 'react';
import '../css/weather.css';
import {
  WbSunnyOutlined, OpacityOutlined, AirOutlined, SpeedOutlined,
  WaterDropOutlined, WbTwilightOutlined, NightsStayOutlined,
  CloudOutlined, ThunderstormOutlined
} from '@mui/icons-material';

function iconeMeteo(code, className) {
  const props = className ? { className } : {};
  if (code === 0)  return <WbSunnyOutlined {...props} />;
  if (code <= 3)   return <CloudOutlined {...props} />;
  if (code <= 82)  return <OpacityOutlined {...props} />;
  return <ThunderstormOutlined {...props} />;
}

function labelMeteo(code) {
  if (code === 0)  return 'Ciel dégagé';
  if (code <= 3)   return 'Peu nuageux';
  if (code <= 48)  return 'Brouillard';
  if (code <= 67)  return 'Pluie';
  if (code <= 77)  return 'Neige';
  if (code <= 82)  return 'Averses';
  return 'Orage';
}

function jourSemaine(dateStr, index) {
  if (index === 0) return "Aujourd'hui";
  if (index === 1) return 'Demain';
  const jours = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  return jours[new Date(dateStr).getDay()];
}

export default function Weather() {
  const [meteo, setMeteo] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch('/api/meteo/refresh')
      .then(res => res.json())
      .then(data => { setMeteo(data); setChargement(false); })
      .catch(() => setChargement(false));
  }, []);

  if (chargement) return <div className="weather-dashboard">Chargement...</div>;
  if (!meteo || meteo.erreur) return <div className="weather-dashboard">Données météo indisponibles</div>;

  const prevision0 = meteo.previsions?.[0];

  return (
    <div className="weather-dashboard">

      <div className="weather-top-card">
        <div className="main-temp-section">
          {iconeMeteo(meteo.condition_code, 'main-weather-icon')}
          <div className="temp-details">
            <div className="current-temp">{Math.round(meteo.temperature)}°C</div>
            <div className="condition">{labelMeteo(meteo.condition_code)}</div>
            <div className="feels-like">Ressenti {Math.round(meteo.ressenti)}°C</div>
            <div className="location">Ferme principale</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <OpacityOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Humidité</div>
              <div className="stat-value">{meteo.humidite}%</div>
            </div>
          </div>
          <div className="stat-item">
            <AirOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Vent</div>
              <div className="stat-value">{Math.round(meteo.vent_kmh)} km/h</div>
            </div>
          </div>
          <div className="stat-item">
            <SpeedOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Pression</div>
              <div className="stat-value">{meteo.pression_hpa} hPa</div>
            </div>
          </div>
          <div className="stat-item">
            <WaterDropOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Précipitations</div>
              <div className="stat-value">{meteo.pluie_mm} mm</div>
            </div>
          </div>
          <div className="stat-item">
            <WbTwilightOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Lever du soleil</div>
              <div className="stat-value">{prevision0?.lever_soleil ?? '--:--'}</div>
            </div>
          </div>
          <div className="stat-item">
            <NightsStayOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Coucher de soleil</div>
              <div className="stat-value">{prevision0?.coucher_soleil ?? '--:--'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-middle-section">
        <div className="sun-trajectory-mock">
          <span className="sun-label">Matin</span>
          <div className="trajectory-line">
            <div className="horizon-line"></div>
            <WbSunnyOutlined className="sun-icon-path" />
          </div>
        </div>
      </div>

      <div className="weather-bottom-section">
        <div className="forecast-list">
          {meteo.previsions?.map((jour, index) => (
            <div key={index} className={`forecast-card ${index === 0 ? 'active' : ''}`}>
              <div className="forecast-day">{jourSemaine(jour.date, index)}</div>
              <div className="forecast-icon">{iconeMeteo(jour.condition_code)}</div>
              <div className="forecast-temp">{Math.round(jour.min)}°/{Math.round(jour.max)}°</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
