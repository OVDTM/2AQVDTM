import { useState, useEffect } from 'react';
import '../css/weather.css';
import {
  WbSunny, WbSunnyOutlined, OpacityOutlined, AirOutlined, SpeedOutlined,
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

function positionSoleil(leverSoleil, coucherSoleil) {
  if (!leverSoleil || !coucherSoleil) return { position: 30, label: 'Journée' };

  const now = new Date();
  const maintenant = now.getHours() * 60 + now.getMinutes();
  const [hL, mL] = leverSoleil.split(':').map(Number);
  const [hC, mC] = coucherSoleil.split(':').map(Number);
  const lever = hL * 60 + mL;
  const coucher = hC * 60 + mC;

  if (maintenant <= lever)  return { position: 0,   label: "Avant l'aube" };
  if (maintenant >= coucher) return { position: 100, label: 'Nuit' };

  const position = ((maintenant - lever) / (coucher - lever)) * 100;
  return { position, label: position < 50 ? 'Matin' : 'Après-midi' };
}

const HORIZON_Y = 52;
const AMPLITUDE = 34;

const ARC_PATH = (() => {
  let d = `M 0,${HORIZON_Y}`;
  for (let i = 1; i <= 100; i++)
    d += ` L ${i},${(HORIZON_Y - Math.sin((i / 100) * Math.PI) * AMPLITUDE).toFixed(1)}`;
  return d;
})();

const FILL_PATH = ARC_PATH + ` L 100,${HORIZON_Y} Z`;

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
  const { position: posSoleil, label: labelSoleil } = positionSoleil(
    prevision0?.lever_soleil,
    prevision0?.coucher_soleil
  );
  const sunSvgY = HORIZON_Y - Math.sin((posSoleil / 100) * Math.PI) * AMPLITUDE;

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
          <span className="sun-label">{labelSoleil}</span>
          <div style={{ position: 'relative', width: '100%', height: '60px' }}>
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                <clipPath id="soleil-progress">
                  <rect x="0" y="0" width={posSoleil} height="60" />
                </clipPath>
              </defs>
              {/* Ligne horizon */}
              <line x1="0" y1={HORIZON_Y} x2="100" y2={HORIZON_Y}
                stroke="var(--md-sys-color-outline-variant)" strokeWidth="0.5" />
              {/* Arc complet en gris clair */}
              <path d={ARC_PATH} fill="none"
                stroke="var(--md-sys-color-outline-variant)" strokeWidth="1" />
              {/* Zone remplie jusqu'au soleil */}
              <path d={FILL_PATH} fill="rgba(212, 160, 23, 0.18)"
                clipPath="url(#soleil-progress)" />
              {/* Arc doré jusqu'au soleil */}
              <path d={ARC_PATH} fill="none" stroke="#C8920A" strokeWidth="1.5"
                clipPath="url(#soleil-progress)" />
            </svg>
            <WbSunny style={{
              position: 'absolute',
              left:  `calc(${posSoleil}% - 10px)`,
              top:   `${sunSvgY - 10}px`,
              color: '#C8920A',
              fontSize: '20px',
            }} />
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
