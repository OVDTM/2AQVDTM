import '../css/weather.css';
import {
  WbSunnyOutlined, OpacityOutlined, AirOutlined, SpeedOutlined,
  WaterDropOutlined, WbTwilightOutlined, NightsStayOutlined, 
  CloudOutlined, ThunderstormOutlined
} from '@mui/icons-material';

export default function Weather() {

  const forecast = [
    { day: "Aujourd'hui", icon: <CloudOutlined />, min: 8, max: 23, active: true },
    { day: "Demain", icon: <CloudOutlined />, min: 12, max: 28, active: false },
    { day: "mer.", icon: <ThunderstormOutlined />, min: 15, max: 19, active: false },
    { day: "jeu.", icon: <ThunderstormOutlined />, min: 10, max: 16, active: false },
    { day: "ven.", icon: <CloudOutlined />, min: 7, max: 15, active: false },
    { day: "sam.", icon: <ThunderstormOutlined />, min: 10, max: 14, active: false },
    { day: "dim.", icon: <CloudOutlined />, min: 9, max: 20, active: false },
  ];

  return (
    <div className="weather-dashboard">
      
      <div className="weather-top-card">
        <div className="main-temp-section">
          <WbSunnyOutlined className="main-weather-icon" />
          <div className="temp-details">
            <div className="current-temp">9°C</div>
            <div className="condition">Ciel dégagé</div>
            <div className="feels-like">Ressenti 5°C</div>
            <div className="location">Puteaux</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <OpacityOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Humidité</div>
              <div className="stat-value">63%</div>
            </div>
          </div>
          <div className="stat-item">
            <AirOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Vent</div>
              <div className="stat-value">16 km/h</div>
            </div>
          </div>
          <div className="stat-item">
            <SpeedOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Pression</div>
              <div className="stat-value">1010 hPa</div>
            </div>
          </div>
          <div className="stat-item">
            <WaterDropOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Précipitations</div>
              <div className="stat-value">0%</div>
            </div>
          </div>
          <div className="stat-item">
            <WbTwilightOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Lever du soleil</div>
              <div className="stat-value">05:50</div>
            </div>
          </div>
          <div className="stat-item">
            <NightsStayOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Coucher de soleil</div>
              <div className="stat-value">19:54</div>
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
          {forecast.map((day, index) => (
            <div key={index} className={`forecast-card ${day.active ? 'active' : ''}`}>
              <div className="forecast-day">{day.day}</div>
              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-temp">{day.min}°/{day.max}°</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}