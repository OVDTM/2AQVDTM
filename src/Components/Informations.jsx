import React, { useMemo, useState, useEffect } from 'react';
import '../css/alerts.css';
import {
  TaskAlt,
  WarningAmberOutlined,
  BugReportOutlined,
  WaterDropOutlined
} from '@mui/icons-material';

const normaliser = (o) => ({
  date:        o.date_,
  etat:        o.etat,
  parcelle:    o.parcelle_id,
  commentaire: o.commentaire,
});

const getStyleConfig = (etat) => {
  switch (etat) {
    case 'OK':               return { className: 'severity-info',     icon: <TaskAlt /> };
    case 'Stress hydrique':  return { className: 'severity-warning',  icon: <WaterDropOutlined /> };
    case 'Risque maladie':   return { className: 'severity-warning',  icon: <WarningAmberOutlined /> };
    case 'Maladie détectée': return { className: 'severity-critical', icon: <BugReportOutlined /> };
    default:                 return { className: 'severity-info',     icon: <TaskAlt /> };
  }
};

export default function Informations() {
  const [observations, setObservations] = useState([]);
  const [chargement, setChargement]     = useState(true);
  const [filterType, setFilterType]     = useState('All');

  useEffect(() => {
    fetch('/api/observations')
      .then(res => res.json())
      .then(data => {
        setObservations(data.map(normaliser));
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  const sortedObservations = useMemo(() => {
    return [...observations].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [observations]);

  const filteredObservations = sortedObservations.filter(
    obs => filterType === 'All' || obs.etat === filterType
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (chargement) return <div className="alerts-card">Chargement...</div>;

  return (
    <div className="alerts-card">
      <div className="alerts-header">
        <div className="row" style={{ gap: '16px', alignItems: 'center' }}>
          <h2 className="alerts-title">Journal des Observations</h2>
          <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">Tous</option>
            <option value="OK">Sains</option>
            <option value="Stress hydrique">Stress hydrique</option>
            <option value="Risque maladie">Risque maladie</option>
            <option value="Maladie détectée">Maladie détectée</option>
          </select>
        </div>
        <span className="alerts-badge">{filteredObservations.length} relevés</span>
      </div>

      <div className="alerts-list">
        {filteredObservations.map((obs, index) => {
          const config = getStyleConfig(obs.etat);
          return (
            <div key={index} className="alert-item">
              <div className={`alert-icon-wrapper ${config.className}`}>
                {config.icon}
              </div>

              <div className="alert-content">
                <div className="alert-type">{obs.etat}</div>
                <div className="alert-parcelle">Parcelle #{obs.parcelle} • {obs.commentaire}</div>
              </div>

              <div className="alert-meta">
                <span className={`severity-badge ${config.className}`}>
                  {obs.etat === 'OK' ? 'Sain' : 'Alerte'}
                </span>
                <span className="alert-date">{formatDate(obs.date)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
